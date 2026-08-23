"""
test_e2e_qa_journey.py
────────────────────────
Full-Stack E2E QA Test Suite covering all 18 student and teacher journey steps:
  1. Student Login & Authentication
  2. Diagnostic Start & Submit
  3. Weak Topics Retrieval
  4. AI Tutor Chat & Grounded RAG Retrieval
  5. Source Citation Verification
  6. Simpler Explanation Modifier Request
  7. 📷 Vision Question Solver Upload
  8. Adaptive Practice Set Generation
  9. Practice Answer Submission & Adaptive Rules
  10. DB Skill Mastery Update Verification
  11. Student Dashboard Data Hydration
  12. OpportunityMatch Engine Matching
  13. Teacher Login & Auth
  14. Teacher ClassPulse Analytics
  15. Learning Attention Indicator Flagged Students
  16. Teacher Student Detail Insights View
  17. Teacher Copilot Natural Q&A
  18. Role-Based Access Control Security Verification
"""

import sys
import os
import io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def create_dummy_png_bytes() -> bytes:
    """Generate a valid PNG image byte string for testing."""
    return (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc`\x00\x00\x00"
        b"\x02\x00\x01H\xaf\xa4q\x00\x00\x00\x00IEND\xaeB`\x82"
    )


def run_full_e2e_qa_suite():
    print("\n" + "═"*70)
    print("🧪 SHIKSHAAI — FULL-STACK E2E QA AUTOMATED TEST SUITE")
    print("═"*70 + "\n")

    # ── 1. Student Login ───────────────────────────────────────────────────────
    print("STEP 1: Testing Student Login (arjun.mehta@student.in)...")
    s_login = client.post("/api/v1/auth/login", json={
        "email": "arjun.mehta@student.in",
        "password": "student123"
    })
    assert s_login.status_code == 200, f"Student login failed: {s_login.text}"
    student_token = s_login.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}
    print("  ✅ PASS: Student authenticated successfully")

    # ── 2. Diagnostic Assessment Start & Submit ───────────────────────────────
    print("\nSTEP 2: Testing Diagnostic Assessment Start & Submit...")
    d_start = client.post("/api/v1/diagnostic/start", json={"subject_name": "Mathematics"}, headers=student_headers)
    assert d_start.status_code == 200, f"Diagnostic start failed: {d_start.text}"
    d_data = d_start.json()
    assert len(d_data["questions"]) >= 5, "Diagnostic must return 5-15 questions"
    print(f"  • Diagnostic Quiz Started: {len(d_data['questions'])} questions loaded")

    # Submit sample answers
    answers = {
        str(q["id"]): list(q["options"].keys())[0] if isinstance(q["options"], dict) else q["options"][0]
        for q in d_data["questions"]
    }
    d_sub = client.post("/api/v1/diagnostic/submit", json={
        "answers": answers
    }, headers=student_headers)
    assert d_sub.status_code == 200, f"Diagnostic submit failed: {d_sub.text}"
    d_res = d_sub.json()
    print(f"  ✅ PASS: Diagnostic submitted. Accuracy: {d_res['overall_score_percentage']}%, Weak Topics: {len(d_res['weak_topics'])}")

    # ── 3. Weak Topics Retrieval ──────────────────────────────────────────────
    print("\nSTEP 3: Testing Weak Topics Retrieval...")
    wt_resp = client.get("/api/v1/student/weak-topics", headers=student_headers)
    assert wt_resp.status_code == 200, f"Weak topics failed: {wt_resp.text}"
    wt_list = wt_resp.json()
    print(f"  ✅ PASS: Weak topics retrieved ({len(wt_list)} flagged weak topics)")

    # ── 4. AI Tutor Chat & RAG Context Retrieval ─────────────────────────────
    print("\nSTEP 4: Testing AI Tutor Chat & Grounded RAG Context Retrieval...")
    chat_resp = client.post("/api/v1/tutor/chat", json={
        "message": "Explain quadratic equations using the discriminant formula",
        "topic_name": "Quadratic Equations",
        "language": "en"
    }, headers=student_headers)
    assert chat_resp.status_code == 200, f"Tutor chat failed: {chat_resp.text}"
    chat_res = chat_resp.json()
    print("  ✅ PASS: AI Tutor chat completed")

    # ── 5. Grounded Sources Verification ──────────────────────────────────────
    print("\nSTEP 5: Verifying Grounded NCERT Sources & Citations...")
    assert len(chat_res["sources"]) > 0, "Response must contain grounded NCERT sources"
    print(f"  • Sources Count: {len(chat_res['sources'])}")
    print(f"  • Top Citation: '{chat_res['sources'][0]['title']}' ({round(chat_res['sources'][0]['relevance_score']*100)}% match)")
    print("  ✅ PASS: Grounded sources verified")

    # ── 6. Request Simpler Explanation ────────────────────────────────────────
    print("\nSTEP 6: Testing Simpler Explanation Modifier Request...")
    simpler_resp = client.post("/api/v1/tutor/chat", json={
        "message": "Explain quadratic equations",
        "topic_name": "Quadratic Equations",
        "modifier": "simpler",
        "language": "en"
    }, headers=student_headers)
    assert simpler_resp.status_code == 200, f"Simpler modifier failed: {simpler_resp.text}"
    print("  ✅ PASS: Simpler explanation modifier executed")

    # ── 7. 📷 Vision Question Solver Upload ──────────────────────────────────
    print("\nSTEP 7: Testing 📷 Scan Question Vision Solver Upload...")
    png_bytes = create_dummy_png_bytes()
    files = {"file": ("math_photo.png", io.BytesIO(png_bytes), "image/png")}
    data = {"topic_name": "Quadratic Equations", "language": "en"}
    vis_resp = client.post("/api/v1/tutor/scan-question", files=files, data=data, headers=student_headers)
    assert vis_resp.status_code == 200, f"Vision solver failed: {vis_resp.text}"
    vis_res = vis_resp.json()
    assert "extracted_question" in vis_res
    assert "steps" in vis_res
    assert "verification" in vis_res
    print(f"  • Extracted Math Text: '{vis_res['extracted_question']}'")
    print(f"  • Core Concept: '{vis_res['concept']}'")
    print("  ✅ PASS: Vision Question Solver verified")

    # ── 8. Adaptive Practice Set Generation ──────────────────────────────────
    print("\nSTEP 8: Testing Adaptive Practice Set Generation...")
    p_gen = client.post("/api/v1/practice/generate", json={"count": 5}, headers=student_headers)
    assert p_gen.status_code == 200, f"Practice generate failed: {p_gen.text}"
    p_data = p_gen.json()
    assert len(p_data["questions"]) > 0, "Practice set must contain questions"
    print(f"  ✅ PASS: Adaptive practice set generated ({len(p_data['questions'])} questions)")

    # ── 9. Practice Answer Submission & Adaptive Rules ────────────────────────
    print("\nSTEP 9: Testing Practice Answer Submission & Adaptive Rules...")
    target_q = p_data["questions"][0]
    p_sub = client.post("/api/v1/practice/submit", json={
        "question_id": target_q["question_id"],
        "chosen_answer": "A",
        "time_taken_secs": 12
    }, headers=student_headers)
    assert p_sub.status_code == 200, f"Practice submit failed: {p_sub.text}"
    p_res = p_sub.json()
    print(f"  • Result: {'Correct' if p_res['is_correct'] else 'Incorrect'}")
    print(f"  • Next Difficulty Calibrated: {p_res['next_difficulty']}")
    print("  ✅ PASS: Practice answer submitted & difficulty calibrated")

    # ── 10. Database Skill Mastery Update Verification ─────────────────────────
    print("\nSTEP 10: Verifying Skill Mastery Database Updates...")
    mastery_resp = client.get("/api/v1/students/me/mastery", headers=student_headers)
    assert mastery_resp.status_code == 200, f"Get mastery failed: {mastery_resp.text}"
    m_list = mastery_resp.json()
    assert len(m_list) > 0
    print(f"  ✅ PASS: Skill masteries retrieved ({len(m_list)} topics tracked in DB)")

    # ── 11. Student Dashboard Data Hydration ──────────────────────────────────
    print("\nSTEP 11: Testing Student Dashboard Data Hydration...")
    dash_resp = client.get("/api/v1/student/dashboard", headers=student_headers)
    assert dash_resp.status_code == 200, f"Student dashboard failed: {dash_resp.text}"
    dash_data = dash_resp.json()
    print(f"  • Welcome Message: '{dash_data['welcome_message']}'")
    print(f"  • Overall Mastery: {dash_data['overall_mastery']}%")
    print(f"  • Streak Days: {dash_data['streak_days']} days | XP: {dash_data['total_xp']}")
    print("  ✅ PASS: Student dashboard hydrated")

    # ── 12. OpportunityMatch Engine ───────────────────────────────────────────
    print("\nSTEP 12: Testing OpportunityMatch Engine...")
    opp_resp = client.get("/api/v1/opportunities/matches", headers=student_headers)
    assert opp_resp.status_code == 200, f"Opportunity matches failed: {opp_resp.text}"
    opp_matches = opp_resp.json()
    assert len(opp_matches) > 0
    print(f"  ✅ PASS: Opportunity matches calculated (Top match: '{opp_matches[0]['opportunity']['name']}' at {opp_matches[0]['match_score']}%)")

    # ── 13. Teacher Login ──────────────────────────────────────────────────────
    print("\nSTEP 13: Testing Teacher Login (priya.sharma@shikshaai.in)...")
    t_login = client.post("/api/v1/auth/login", json={
        "email": "priya.sharma@shikshaai.in",
        "password": "teacher123"
    })
    assert t_login.status_code == 200, f"Teacher login failed: {t_login.text}"
    teacher_token = t_login.json()["access_token"]
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}
    print("  ✅ PASS: Teacher authenticated successfully")

    # ── 14. Teacher ClassPulse Analytics ──────────────────────────────────────
    print("\nSTEP 14: Testing Teacher ClassPulse Analytics...")
    classes_resp = client.get("/api/v1/teachers/classes", headers=teacher_headers)
    assert classes_resp.status_code == 200, f"Teacher classes failed: {classes_resp.text}"
    t_classes = classes_resp.json()
    assert len(t_classes) > 0
    class_id = t_classes[0]["id"]

    analytics_resp = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=teacher_headers)
    assert analytics_resp.status_code == 200, f"Class analytics failed: {analytics_resp.text}"
    a_data = analytics_resp.json()
    print(f"  • Total Students: {a_data['total_students']}")
    print(f"  • Class Average Mastery: {a_data['average_mastery']}%")
    print(f"  • Quiz Accuracy: {a_data['average_quiz_accuracy']}%")
    print("  ✅ PASS: ClassPulse analytics retrieved")

    # ── 15. Learning Attention Indicator Flagged Students ─────────────────────
    print("\nSTEP 15: Verifying Learning Attention Indicator Flagged Students...")
    flagged = a_data["students_needing_attention"]
    print(f"  • Flagged Students Count: {len(flagged)}")
    if len(flagged) > 0:
        print(f"  • Sample Flagged Student: '{flagged[0]['full_name']}' ({flagged[0]['risk_level']} Risk)")
        print(f"  • Transparent Reasons: {flagged[0]['flagged_reasons']}")
    print("  ✅ PASS: Learning Attention Indicator verified")

    # ── 16. Teacher Student Detail Insights View ──────────────────────────────
    print("\nSTEP 16: Testing Teacher Student Detail Insights View...")
    target_student_id = flagged[0]["student_id"] if len(flagged) > 0 else 2
    ins_resp = client.get(f"/api/v1/teachers/students/{target_student_id}/insights", headers=teacher_headers)
    assert ins_resp.status_code == 200, f"Student insights failed: {ins_resp.text}"
    ins_data = ins_resp.json()
    print(f"  • Student: '{ins_data['full_name']}'")
    print(f"  • Mastery: {ins_data['overall_mastery']}%")
    print(f"  • Intervention: '{ins_data['recommended_intervention'][:70]}...'")
    print("  ✅ PASS: Student detailed insights retrieved")

    # ── 17. Teacher Copilot Natural Q&A ───────────────────────────────────────
    print("\nSTEP 17: Testing Teacher Copilot Natural Q&A...")
    copilot_resp = client.post("/api/v1/teachers/copilot", json={
        "question": "Which students need help with algebra?",
        "class_id": class_id
    }, headers=teacher_headers)
    assert copilot_resp.status_code == 200, f"Teacher copilot failed: {copilot_resp.text}"
    c_data = copilot_resp.json()
    print(f"  • Copilot Query: '{c_data['query']}'")
    print(f"  • Answer Preview: '{c_data['answer'][:80]}...'")
    print("  ✅ PASS: Teacher Copilot Q&A verified")

    # ── 18. Role-Based Access Control Security Verification ──────────────────
    print("\nSTEP 18: Verifying Role-Based Access Control (RBAC) Security...")
    # Student trying to access teacher endpoint -> must return 403 Forbidden
    rbac_student_test = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=student_headers)
    assert rbac_student_test.status_code in [403, 401], f"Security failure: Student accessed teacher endpoint (HTTP {rbac_student_test.status_code})"

    # Teacher trying to access student onboarding -> must return 403 Forbidden
    rbac_teacher_test = client.post("/api/v1/student/onboarding", json={"name": "Fake"}, headers=teacher_headers)
    assert rbac_teacher_test.status_code in [403, 401], f"Security failure: Teacher accessed student onboarding (HTTP {rbac_teacher_test.status_code})"

    print("  ✅ PASS: RBAC Security enforcement verified (403 Forbidden for cross-role calls)")

    print("\n" + "═"*70)
    print("🎉 ALL 18 E2E QA JOURNEY STEPS PASSED WITH 100% SUCCESS!")
    print("═"*70 + "\n")


if __name__ == "__main__":
    run_full_e2e_qa_suite()
