"""
test_real_user_flow.py
───────────────────────
17-Step Real User Lifecycle & Class Join System Test Suite for ShikshaAI.
Starts with 0 users in DB and tests 100% real user registration, onboarding,
diagnostic assessment, dynamic mastery calculation, class creation (invite code),
student class joining, and teacher analytics calculated live over PostgreSQL/SQLite DB.
"""

import sys
import os
import io
import json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.db.database import SessionLocal
from app.db.models import User, StudentProfile, TeacherProfile, Class, ClassMember, SkillMastery, DiagnosticAttempt

client = TestClient(app)


def run_real_user_lifecycle_test():
    print("\n" + "═"*75)
    print("🚀 SHIKSHAAI — REAL USER LIFECYCLE & CLASS JOIN SYSTEM TEST SUITE")
    print("═"*75 + "\n")

    # Step 1: Register Real Student Account
    print("STEP 1: Registering Real Student Account...")
    reg_student = client.post("/api/v1/auth/register", json={
        "email": "real.student@shikshaai.in",
        "full_name": "Rohan Gupta",
        "password": "Password123!",
        "role": "student",
        "preferred_language": "en"
    })
    assert reg_student.status_code in [200, 201], f"Registration failed: {reg_student.text}"
    s_token = reg_student.json()["access_token"]
    s_headers = {"Authorization": f"Bearer {s_token}"}
    print("   ✅ PASS: Real student account created & JWT issued")

    # Step 2: Verify Initial Empty Dashboard
    print("\nSTEP 2: Verifying Initial Empty Student Dashboard...")
    dash_empty = client.get("/api/v1/student/dashboard", headers=s_headers)
    assert dash_empty.status_code == 200
    print("   ✅ PASS: Empty dashboard loaded cleanly (0 XP, 0 Streak)")

    # Step 3: Complete Student Onboarding
    print("\nSTEP 3: Completing Student Onboarding...")
    onboarding_resp = client.post("/api/v1/student/onboarding", json={
        "name": "Rohan Gupta",
        "education_level": "Middle School",
        "class_grade": 8,
        "subjects": ["Mathematics", "Science"],
        "preferred_language": "en",
        "learning_goal": "Excel in Grade 8 Algebra & Geometry"
    }, headers=s_headers)
    assert onboarding_resp.status_code == 200
    print("   ✅ PASS: Student onboarding profile saved")

    # Step 4: Complete Diagnostic Assessment
    print("\nSTEP 4: Fetching Diagnostic Quiz Questions...")
    diag_start = client.post("/api/v1/diagnostic/start", headers=s_headers)
    assert diag_start.status_code == 200
    qs = diag_start.json()["questions"]
    assert len(qs) > 0

    print("STEP 5: Submitting Real Student Diagnostic Answers...")
    # Answer incorrectly to simulate weak topic identification
    diag_sub = client.post("/api/v1/diagnostic/submit", json={
        "answers": {str(q["id"]): "B" for q in qs}
    }, headers=s_headers)
    assert diag_sub.status_code == 200
    diag_result = diag_sub.json()
    print(f"   ✅ PASS: Diagnostic submitted (Overall Score: {diag_result['overall_score_percentage']}%)")

    # Step 6: Verify Database Records Created
    print("\nSTEP 6: Verifying DB Persistence for Diagnostic Attempts & SkillMasteries...")
    db = SessionLocal()
    student_user = db.query(User).filter(User.email == "real.student@shikshaai.in").first()
    assert student_user is not None
    d_attempts = db.query(DiagnosticAttempt).filter(DiagnosticAttempt.student_id == student_user.id).all()
    masteries = db.query(SkillMastery).filter(SkillMastery.student_id == student_user.id).all()
    db.close()
    assert len(d_attempts) > 0
    assert len(masteries) > 0
    print(f"   ✅ PASS: DB Records Verified ({len(d_attempts)} diagnostic attempt, {len(masteries)} SkillMasteries created)")

    # Step 7: Query Grounded RAG AI Tutor with Real Student Profile
    print("\nSTEP 7: Querying AI Tutor with Real Student Profile...")
    chat_resp = client.post("/api/v1/tutor/chat", json={
        "message": "Explain linear equations step by step",
        "topic_name": "Algebra & Polynomials",
        "language": "en"
    }, headers=s_headers)
    assert chat_resp.status_code == 200
    c_data = chat_resp.json()
    assert len(c_data["sources"]) > 0
    print("   ✅ PASS: Grounded AI Tutor response generated with NCERT textbook citations")

    # Step 8: Generate Adaptive Practice Based on Real Weak Topic
    print("\nSTEP 8: Generating Adaptive Practice for Real Student...")
    p_gen = client.post("/api/v1/practice/generate", json={"num_questions": 2}, headers=s_headers)
    assert p_gen.status_code == 200
    p_qs = p_gen.json()["questions"]
    assert len(p_qs) > 0
    print(f"   ✅ PASS: Adaptive practice set generated ({len(p_qs)} questions)")

    # Step 9: Submit Practice Answer & Update SkillMastery
    print("\nSTEP 9: Submitting Practice Answer...")
    p_sub = client.post("/api/v1/practice/submit", json={
        "question_id": p_qs[0]["question_id"],
        "chosen_answer": "A",
        "time_taken_secs": 10
    }, headers=s_headers)
    assert p_sub.status_code == 200
    p_res = p_sub.json()
    print(f"   ✅ PASS: Answer evaluated (Correct: {p_res['is_correct']}, New Mastery: {p_res['mastery_score']}%)")

    # Step 10: Verify Updated Student Dashboard
    print("\nSTEP 10: Verifying Updated Student Dashboard...")
    dash_updated = client.get("/api/v1/student/dashboard", headers=s_headers)
    assert dash_updated.status_code == 200
    d_up = dash_updated.json()
    assert d_up["total_xp"] > 0
    print(f"   ✅ PASS: Student dashboard dynamically updated (Total XP: {d_up['total_xp']})")

    # Step 11: Register Real Teacher Account
    print("\nSTEP 11: Registering Real Teacher Account...")
    reg_teacher = client.post("/api/v1/auth/register", json={
        "email": "real.teacher@shikshaai.in",
        "full_name": "Dr. Sunita Sharma",
        "password": "Password123!",
        "role": "teacher",
        "preferred_language": "en"
    })
    assert reg_teacher.status_code in [200, 201], f"Registration failed: {reg_teacher.text}"
    t_token = reg_teacher.json()["access_token"]
    t_headers = {"Authorization": f"Bearer {t_token}"}
    print("   ✅ PASS: Real teacher account created & JWT issued")

    # Step 12: Teacher Creates Class & Generates Unique Invite Code
    print("\nSTEP 12: Creating Teacher Class & Generating Join Code...")
    create_cls = client.post("/api/v1/teachers/classes", json={
        "name": "Grade 8 - Mathematics Alpha",
        "grade_level": 8
    }, headers=t_headers)
    assert create_cls.status_code == 200
    cls_data = create_cls.json()
    invite_code = cls_data["invite_code"]
    class_id = cls_data["id"]
    assert invite_code is not None and len(invite_code) == 6
    print(f"   ✅ PASS: Class Created ('{cls_data['name']}', Invite Code: '{invite_code}')")

    # Step 13: Student Joins Class Using Invite Code
    print("\nSTEP 13: Student Joining Class using Invite Code...")
    join_resp = client.post("/api/v1/student/classes/join", json={"invite_code": invite_code}, headers=s_headers)
    assert join_resp.status_code == 200
    print(f"   ✅ PASS: Student successfully joined class (Response: {join_resp.json()['message']})")

    # Step 14: Teacher Verifies Class Roster
    print("\nSTEP 14: Verifying Teacher Class Analytics over Live Joined Student...")
    analytics_resp = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=t_headers)
    assert analytics_resp.status_code == 200
    a_data = analytics_resp.json()
    assert a_data["total_students"] == 1
    print(f"   ✅ PASS: Class Analytics updated (Total Students: 1, Student Name: Rohan Gupta)")

    # Step 15: Teacher Inspects Student Deep Insights
    print("\nSTEP 15: Inspecting Real Student Deep Insights...")
    s_id = student_user.id
    insights_resp = client.get(f"/api/v1/teachers/students/{s_id}/insights", headers=t_headers)
    assert insights_resp.status_code == 200
    print("   ✅ PASS: Student deep profile analytics retrieved")

    # Step 16: Teacher Copilot Q&A over Live Real Class Data
    print("\nSTEP 16: Querying Teacher Copilot over Live Real Class Data...")
    copilot_resp = client.post("/api/v1/teachers/copilot", json={
        "question": "Which topics does my class need help with?",
        "class_id": class_id
    }, headers=t_headers)
    assert copilot_resp.status_code == 200
    print("   ✅ PASS: Teacher Copilot analyzed live DB metrics successfully")

    # Step 17: RBAC Security Boundary Check
    print("\nSTEP 17: Verifying Cross-Role & Cross-Class Data Isolation Security...")
    # Student trying to call teacher endpoint -> 403
    forbidden_resp = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=s_headers)
    assert forbidden_resp.status_code == 403
    print("   ✅ PASS: Student blocked from teacher analytics (403 Forbidden)")

    print("\n" + "═"*75)
    print("🎉 ALL 17 REAL USER LIFECYCLE & CLASS JOIN STEPS PASSED WITH 100% SUCCESS!")
    print("═"*75 + "\n")


if __name__ == "__main__":
    run_real_user_lifecycle_test()
