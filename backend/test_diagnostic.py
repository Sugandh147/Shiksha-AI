"""
test_diagnostic.py
──────────────────
Automated verification test suite for the Diagnostic Assessment System.
Tests:
  1. POST /diagnostic/start — Question retrieval & security
  2. POST /diagnostic/submit — Dynamic scoring, weak topic detection (e.g. Quadratic Equations), SkillMastery persistence
  3. GET /diagnostic/results — Result persistence retrieval
  4. GET /students/me/weak-topics — Weak topics API
  5. GET /students/me/mastery — Overall & per-topic mastery API
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_diagnostic_tests():
    print("\n🧪 Running Diagnostic Assessment Automated Test Suite...\n" + "─"*55)

    # 1. Login Student
    print("1. Logging in student...")
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "arjun.mehta@student.in",
        "password": "student123"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    student_id = login_resp.json()["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"   ✅ Logged in as Student #{student_id}")

    # 2. Start Diagnostic Quiz
    print("\n2. Testing POST /api/v1/diagnostic/start...")
    start_resp = client.post("/api/v1/diagnostic/start", headers=headers)
    assert start_resp.status_code == 200, f"Start failed: {start_resp.text}"
    quiz_data = start_resp.json()
    questions = quiz_data["questions"]
    assert len(questions) >= 10, f"Expected at least 10 questions, got {len(questions)}"
    print(f"   ✅ Fetched {len(questions)} diagnostic questions")
    print(f"   Topics Covered: {quiz_data['topics_covered']}")

    # Security check: Ensure no answer keys in questions
    for q in questions:
        assert "correct_answer" not in q, f"Security Leak! correct_answer found in question #{q['id']}"
        assert "explanation" not in q, f"Security Leak! explanation found in question #{q['id']}"
    print("   ✅ Security Check Passed: No answer leakage in question payload")

    # 3. Build Submission where Quadratic Equations is intentionally failed
    print("\n3. Testing POST /api/v1/diagnostic/submit with dynamic answers...")
    # Fetch questions from DB directly in test script to know correct answers
    from app.db.database import SessionLocal
    from app.db.models import Question
    db = SessionLocal()
    db_questions = db.query(Question).filter(Question.is_diagnostic == True).all()
    q_dict = {q.id: q for q in db_questions}
    db.close()

    submission_answers = {}
    for q in questions:
        q_id = q["id"]
        topic_name = q["topic_name"]
        db_q = q_dict.get(q_id)
        if not db_q:
            continue

        if topic_name == "Quadratic Equations":
            # Intentionally choose WRONG answer for Quadratic Equations
            wrong_opt = "A" if db_q.correct_answer != "A" else "B"
            submission_answers[str(q_id)] = wrong_opt
        else:
            # Choose CORRECT answer for other topics (Algebra, Geometry, Trigonometry, Statistics)
            submission_answers[str(q_id)] = db_q.correct_answer

    print(f"   Submitting {len(submission_answers)} answers (Quadratic Equations intentionally failed)...")
    submit_resp = client.post("/api/v1/diagnostic/submit", json={"answers": submission_answers, "time_taken_secs": 120}, headers=headers)
    assert submit_resp.status_code == 200, f"Submit failed: {submit_resp.text}"
    res = submit_resp.json()

    print(f"   ✅ Submission Received!")
    print(f"      • Overall Score: {res['overall_score_percentage']}% ({res['correct_count']}/{res['total_questions']} correct)")
    print(f"      • Assigned Baseline Level: {res['baseline_level']}")
    print(f"      • Weak Topics Identified: {res['weak_topics']}")
    print(f"      • Strong Topics Identified: {res['strong_topics']}")

    assert "Quadratic Equations" in res["weak_topics"], f"Expected Quadratic Equations in weak_topics, got {res['weak_topics']}"
    print("   ✅ Weak Topic Detection Verified: Quadratic Equations correctly identified as weak area (< 70%)!")

    # 4. GET /api/v1/diagnostic/results
    print("\n4. Testing GET /api/v1/diagnostic/results...")
    results_resp = client.get("/api/v1/diagnostic/results", headers=headers)
    assert results_resp.status_code == 200, f"Results failed: {results_resp.text}"
    fetched_res = results_resp.json()
    assert fetched_res["diagnostic_id"] == res["diagnostic_id"]
    print(f"   ✅ Diagnostic Results Retrieved: ID #{fetched_res['diagnostic_id']}")

    # 5. GET /api/v1/students/me/weak-topics
    print("\n5. Testing GET /api/v1/students/me/weak-topics...")
    weak_resp = client.get("/api/v1/students/me/weak-topics", headers=headers)
    assert weak_resp.status_code == 200, f"Weak topics failed: {weak_resp.text}"
    weak_list = weak_resp.json()
    weak_names = [wt["topic_name"] for wt in weak_list]
    print(f"   ✅ Weak Topics API Returned: {weak_names}")
    assert "Quadratic Equations" in weak_names, f"Expected Quadratic Equations in weak topics list: {weak_names}"

    # 6. GET /api/v1/students/me/mastery
    print("\n6. Testing GET /api/v1/students/me/mastery...")
    mastery_resp = client.get("/api/v1/students/me/mastery", headers=headers)
    assert mastery_resp.status_code == 200, f"Mastery failed: {mastery_resp.text}"
    mastery_data = mastery_resp.json()
    print(f"   ✅ Mastery API Returned: Overall {mastery_data['overall_mastery']}% across {len(mastery_data['topics'])} topics")

    print("\n" + "═"*60 + "\n🎉 ALL DIAGNOSTIC ASSESSMENT AUTOMATED TESTS PASSED!\n" + "═"*60 + "\n")

if __name__ == "__main__":
    run_diagnostic_tests()
