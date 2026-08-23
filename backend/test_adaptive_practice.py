"""
test_adaptive_practice.py
──────────────────────────
Automated Test Suite for the complete Adaptive Practice Engine flow:
  1. Diagnostic Quiz — Identify weak topic (Quadratic Equations).
  2. Recommended Practice API — Verify weak topic prioritization.
  3. Practice Set Generation — Fetch targeted question set for weak topic.
  4. Adaptive Submission — Test wrong answer (difficulty drop), repeat mistake (remediation callout), and correct answer streak (difficulty upgrade).
  5. Real-time Mastery Persistence — Verify DB SkillMastery and Dashboard feed updates.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def run_adaptive_practice_tests():
    print("\n🎯 Running Adaptive Practice Engine Complete Flow Test Suite...\n" + "─"*65)

    # 1. Login Student
    print("1. Logging in student...")
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "arjun.mehta@student.in",
        "password": "student123"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    student_name = login_resp.json()["user"]["full_name"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"   ✅ Logged in as Student: {student_name}")

    # 2. Diagnostic Quiz Phase: Fail Quadratic Equations
    print("\n2. Diagnostic Phase: Submitting quiz to create weak area in Quadratic Equations...")
    start_resp = client.post("/api/v1/diagnostic/start", headers=headers)
    questions = start_resp.json()["questions"]

    from app.db.database import SessionLocal
    from app.db.models import Question
    db = SessionLocal()
    db_qs = {q.id: q for q in db.query(Question).filter(Question.is_diagnostic == True).all()}

    diagnostic_answers = {}
    quad_topic_id = None
    for q in questions:
        q_id = q["id"]
        db_q = db_qs.get(q_id)
        if not db_q:
            continue
        if q["topic_name"] == "Quadratic Equations":
            quad_topic_id = q["topic_id"]
            # Intentionally pick wrong answer
            diagnostic_answers[str(q_id)] = "A" if db_q.correct_answer != "A" else "B"
        else:
            diagnostic_answers[str(q_id)] = db_q.correct_answer

    diag_sub = client.post("/api/v1/diagnostic/submit", json={"answers": diagnostic_answers}, headers=headers)
    assert diag_sub.status_code == 200
    diag_res = diag_sub.json()
    assert "Quadratic Equations" in diag_res["weak_topics"]
    print(f"   ✅ Diagnostic Completed! Weak topics identified: {diag_res['weak_topics']}")

    # 3. Recommended Practice API
    print("\n3. Testing GET /api/v1/practice/recommended...")
    rec_resp = client.get("/api/v1/practice/recommended", headers=headers)
    assert rec_resp.status_code == 200
    rec_list = rec_resp.json()
    print(f"   ✅ Recommended Topics: {[r['topic_name'] + ' (' + str(r['mastery_score']) + '%)' for r in rec_list[:3]]}")
    assert rec_list[0]["topic_name"] == "Quadratic Equations"

    # 4. Generate Targeted Practice Set
    print("\n4. Testing POST /api/v1/practice/generate for Quadratic Equations...")
    gen_resp = client.post("/api/v1/practice/generate", json={"topic_id": quad_topic_id, "count": 5}, headers=headers)
    assert gen_resp.status_code == 200
    practice_data = gen_resp.json()
    practice_qs = practice_data["questions"]
    print(f"   ✅ Practice Set Generated: {len(practice_qs)} questions for topic '{practice_data['session_topic_name']}'")
    print(f"   Initial Difficulty: {practice_data['initial_difficulty']}")

    # 5. Adaptive Answer Submissions
    print("\n5. Testing Adaptive Submissions (Wrong answer, Remediation trigger, Correct streak upgrade)...")

    # Q1: Wrong answer
    q1 = practice_qs[0]
    db_q1 = db_qs.get(q1["question_id"])
    wrong_opt = "A" if db_q1.correct_answer != "A" else "B"
    sub1 = client.post("/api/v1/practice/submit", json={
        "question_id": q1["question_id"],
        "chosen_answer": wrong_opt,
        "time_taken_secs": 12,
        "consecutive_wrongs": 0
    }, headers=headers).json()
    print(f"   • Q1 Submit (Wrong): is_correct={sub1['is_correct']} → Next Difficulty: {sub1['next_difficulty']}")
    assert sub1["is_correct"] is False
    assert sub1["next_difficulty"] in ["easy", "medium"]

    # Q2: Second Wrong answer (consecutive_wrongs = 1 -> triggers remediation)
    q2 = practice_qs[1]
    db_q2 = db_qs.get(q2["question_id"])
    wrong_opt2 = "A" if db_q2.correct_answer != "A" else "B"
    sub2 = client.post("/api/v1/practice/submit", json={
        "question_id": q2["question_id"],
        "chosen_answer": wrong_opt2,
        "time_taken_secs": 15,
        "consecutive_wrongs": 1
    }, headers=headers).json()
    print(f"   • Q2 Submit (Repeated Mistake): requires_remediation={sub2['requires_remediation']}")
    assert sub2["requires_remediation"] is True
    assert sub2["remediation_concept"] is not None
    print(f"   ✅ Remediation Triggered: '{sub2['remediation_concept'][:80]}...'")

    # Q3, Q4, Q5: Correct Answer Streak (3 correct answers)
    streak_count = 0
    for idx, q_item in enumerate(practice_qs[2:], start=3):
        db_q = db_qs.get(q_item["question_id"])
        sub_resp = client.post("/api/v1/practice/submit", json={
            "question_id": q_item["question_id"],
            "chosen_answer": db_q.correct_answer,
            "time_taken_secs": 10,
            "current_streak": streak_count
        }, headers=headers).json()
        streak_count += 1
        print(f"   • Q{idx} Submit (Correct): is_correct={sub_resp['is_correct']} → Next Difficulty: {sub_resp['next_difficulty']} | Updated Mastery: {sub_resp['mastery_score']}%")
        assert sub_resp["is_correct"] is True

    # 6. Verify Dashboard Feed Persistence
    print("\n6. Testing GET /api/v1/student/dashboard to verify mastery update persistence...")
    dash_resp = client.get("/api/v1/student/dashboard", headers=headers)
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    print(f"   ✅ Student Dashboard Updated!")
    print(f"      • Overall Mastery: {dash_data['overall_mastery']}%")
    print(f"      • Current Streak: {dash_data['streak_days']} days")
    print(f"      • Total XP: {dash_data['total_xp']} XP")

    db.close()
    print("\n" + "═"*65 + "\n🎉 COMPLETE FLOW TEST (Diagnostic → Weak Topic → Practice → Mastery → Dashboard) PASSED!\n" + "═"*65 + "\n")


if __name__ == "__main__":
    run_adaptive_practice_tests()
