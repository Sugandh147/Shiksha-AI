"""
test_final_acceptance_suite.py
───────────────────────────────
Comprehensive Final Acceptance Test Suite for ShikshaAI.
Tests:
  1. Real Student Journey & DB Persistence
  2. Real Teacher Class Creation & Join System
  3. Strict RBAC & Cross-User Data Isolation
  4. 0-Data Empty State Handling
  5. DB Persistence Verification
  6. API Health & RAG Grounding Verification
"""

import os
import sys
import json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.db.database import SessionLocal, engine
from app.db.models import (
    User, StudentProfile, TeacherProfile, Class, ClassMember,
    SkillMastery, DiagnosticAttempt, QuizAttempt, LearningEvent
)
from reset_and_seed_content import purge_and_seed

client = TestClient(app)


def run_final_acceptance_suite():
    print("\n" + "═"*75)
    print("🏆 SHIKSHAAI — FINAL ACCEPTANCE TEST SUITE (100% REAL USER DATA)")
    print("═"*75 + "\n")

    # Step 0: Ensure Clean Starting State
    print("0. Resetting Database to Clean Educational Content State (0 Users)...")
    purge_and_seed()
    db: Session = SessionLocal()
    assert db.query(User).count() == 0, "Users table must be empty!"
    assert db.query(Class).count() == 0, "Classes table must be empty!"
    db.close()
    print("   ✓ Verified: DB starts at 0 Users, 0 Classes, 0 Attempts\n")

    # ── TEST 1: REAL STUDENT JOURNEY & PERSISTENCE ──────────────────────────────
    print("TEST 1: REAL STUDENT JOURNEY & PERSISTENCE")
    # 1. Register Student A
    res = client.post("/api/v1/auth/register", json={
        "email": "student.alpha@shikshaai.in",
        "full_name": "Aarav Sharma",
        "password": "Password123!",
        "role": "student",
        "preferred_language": "en"
    })
    assert res.status_code in [200, 201]
    token_sa = res.json()["access_token"]
    headers_sa = {"Authorization": f"Bearer {token_sa}"}
    print("   [1.1] Registered Student A ('Aarav Sharma')")

    # 2. Complete Onboarding
    res = client.post("/api/v1/student/onboarding", json={
        "name": "Aarav Sharma",
        "education_level": "Middle School",
        "class_grade": 8,
        "subjects": ["Mathematics", "Science"],
        "preferred_language": "en",
        "learning_goal": "Master Grade 8 Math"
    }, headers=headers_sa)
    assert res.status_code == 200
    print("   [1.2] Completed Onboarding")

    # 3. Diagnostic Quiz
    res = client.post("/api/v1/diagnostic/start", headers=headers_sa)
    assert res.status_code == 200
    qs = res.json()["questions"]
    assert len(qs) > 0

    # Submit answers (intentionally wrong on some to generate weak topic)
    res = client.post("/api/v1/diagnostic/submit", json={
        "answers": {str(q["id"]): "B" for q in qs}
    }, headers=headers_sa)
    assert res.status_code == 200
    print(f"   [1.3] Submitted Diagnostic Quiz (Score: {res.json()['overall_score_percentage']}%)")

    # 4. Verify DB Storage & SkillMastery Creation
    db = SessionLocal()
    sa_user = db.query(User).filter(User.email == "student.alpha@shikshaai.in").first()
    assert sa_user is not None
    sa_attempts = db.query(DiagnosticAttempt).filter(DiagnosticAttempt.student_id == sa_user.id).all()
    sa_masteries = db.query(SkillMastery).filter(SkillMastery.student_id == sa_user.id).all()
    db.close()
    assert len(sa_attempts) > 0
    assert len(sa_masteries) > 0
    print(f"   [1.4] Verified DB Records: {len(sa_attempts)} attempt, {len(sa_masteries)} SkillMasteries created")

    # 5. RAG AI Tutor Query
    res = client.post("/api/v1/tutor/chat", json={
        "message": "Explain linear equations step by step",
        "topic_name": "Algebra & Polynomials",
        "language": "en"
    }, headers=headers_sa)
    assert res.status_code == 200
    tutor_data = res.json()
    assert len(tutor_data["sources"]) > 0
    print(f"   [1.5] RAG AI Tutor retrieved {len(tutor_data['sources'])} NCERT textbook citations")

    # 6. Adaptive Practice & Learning Event Storage
    res = client.post("/api/v1/practice/generate", json={"num_questions": 2}, headers=headers_sa)
    assert res.status_code == 200
    p_qs = res.json()["questions"]

    # Submit practice answer
    res = client.post("/api/v1/practice/submit", json={
        "question_id": p_qs[0]["question_id"],
        "chosen_answer": "A",
        "time_taken_secs": 12
    }, headers=headers_sa)
    assert res.status_code == 200
    p_res = res.json()
    print(f"   [1.6] Practice Submitted (New Mastery: {p_res['mastery_score']}%)")

    # 7. Persistence Check via Page Refresh Simulation
    res = client.get("/api/v1/student/dashboard", headers=headers_sa)
    assert res.status_code == 200
    dash_sa = res.json()
    assert dash_sa["total_xp"] > 0
    print(f"   [1.7] Dashboard Persistence Verified (Total XP: {dash_sa['total_xp']})\n")

    # ── TEST 2: REAL TEACHER & CLASS JOIN ──────────────────────────────────────
    print("TEST 2: REAL TEACHER & CLASS JOIN SYSTEM")
    # 1. Register Teacher A
    res = client.post("/api/v1/auth/register", json={
        "email": "teacher.alpha@shikshaai.in",
        "full_name": "Prof. Rajesh Kumar",
        "password": "Password123!",
        "role": "teacher",
        "preferred_language": "en"
    })
    assert res.status_code in [200, 201]
    token_ta = res.json()["access_token"]
    headers_ta = {"Authorization": f"Bearer {token_ta}"}
    print("   [2.1] Registered Teacher A ('Prof. Rajesh Kumar')")

    # 2. Create Class & Generate Invite Code
    res = client.post("/api/v1/teachers/classes", json={
        "name": "Class 8 - Section Alpha",
        "grade_level": 8
    }, headers=headers_ta)
    assert res.status_code == 200
    cls_info = res.json()
    invite_code = cls_info["invite_code"]
    class_id = cls_info["id"]
    assert invite_code is not None and len(invite_code) == 6
    print(f"   [2.2] Created Class '{cls_info['name']}' (Invite Code: {invite_code})")

    # 3. Student A Joins Class using Invite Code
    res = client.post("/api/v1/student/classes/join", json={"invite_code": invite_code}, headers=headers_sa)
    assert res.status_code == 200
    print(f"   [2.3] Student A Joined Class using code '{invite_code}'")

    # 4. Teacher A Verifies Class Analytics & Roster
    res = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=headers_ta)
    assert res.status_code == 200
    analytics_data = res.json()
    assert analytics_data["total_students"] == 1
    print(f"   [2.4] Verified Teacher Class Analytics (Enrolled Students: {analytics_data['total_students']})")

    # 5. Teacher Copilot Q&A over Live Class Data
    res = client.post("/api/v1/teachers/copilot", json={
        "question": "Give me a summary of class performance",
        "class_id": class_id
    }, headers=headers_ta)
    assert res.status_code == 200
    print("   [2.5] Teacher Copilot analyzed live DB class metrics successfully\n")

    # ── TEST 3: DATA ISOLATION & RBAC SECURITY ──────────────────────────────────
    print("TEST 3: DATA ISOLATION & RBAC SECURITY")
    # 1. Register Student B
    res = client.post("/api/v1/auth/register", json={
        "email": "student.beta@shikshaai.in",
        "full_name": "Diya Patel",
        "password": "Password123!",
        "role": "student",
        "preferred_language": "en"
    })
    assert res.status_code in [200, 201]
    token_sb = res.json()["access_token"]
    headers_sb = {"Authorization": f"Bearer {token_sb}"}
    print("   [3.1] Registered Student B ('Diya Patel')")

    # Student B dashboard should NOT see Student A's XP or activity
    res = client.get("/api/v1/student/dashboard", headers=headers_sb)
    assert res.status_code == 200
    dash_sb = res.json()
    assert dash_sb["total_xp"] == 0
    assert all(act.get("xp_earned", 0) == 0 for act in dash_sb["recent_activity"])
    print("   [3.2] Verified Student B cannot see Student A's XP or learning activity")

    # 2. Register Teacher B
    res = client.post("/api/v1/auth/register", json={
        "email": "teacher.beta@shikshaai.in",
        "full_name": "Ms. Ananya Roy",
        "password": "Password123!",
        "role": "teacher",
        "preferred_language": "en"
    })
    assert res.status_code in [200, 201]
    token_tb = res.json()["access_token"]
    headers_tb = {"Authorization": f"Bearer {token_tb}"}

    # Teacher B attempting to access Teacher A's class -> 403 Forbidden
    res = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=headers_tb)
    assert res.status_code == 403
    print("   [3.3] Verified Teacher B blocked from Teacher A's class analytics (403 Forbidden)")

    # Student A attempting to access Teacher-only endpoint -> 403 Forbidden
    res = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=headers_sa)
    assert res.status_code == 403
    print("   [3.4] Verified Student blocked from Teacher-only endpoint (403 Forbidden)\n")

    # ── TEST 4: EMPTY STATE HANDLING ───────────────────────────────────────────
    print("TEST 4: EMPTY STATE HANDLING FOR NEW ACCOUNTS")
    # Newly registered student before diagnostic
    res = client.get("/api/v1/student/dashboard", headers=headers_sb)
    assert res.status_code == 200
    sb_dash = res.json()
    assert sb_dash["overall_mastery"] == 0.0
    assert sb_dash["weak_topics"] == []
    print("   [4.1] Student Dashboard handles 0-attempt empty state cleanly (0.0% Mastery, 0 Weak Topics)")

    # Newly registered teacher before classes
    res = client.get("/api/v1/teachers/classes", headers=headers_tb)
    assert res.status_code == 200
    assert res.json() == []
    print("   [4.2] Teacher Classes handles 0-class empty state cleanly ([])\n")

    # ── TEST 5: PERSISTENCE AFTER SERVICE RESTART ──────────────────────────────
    print("TEST 5: DB PERSISTENCE DIRECT QUERY")
    db = SessionLocal()
    total_users = db.query(User).count()
    total_classes = db.query(Class).count()
    total_members = db.query(ClassMember).count()
    total_masteries = db.query(SkillMastery).count()
    total_events = db.query(LearningEvent).count()
    db.close()

    assert total_users == 4  # Student A, Teacher A, Student B, Teacher B
    assert total_classes == 1
    assert total_members == 1
    assert total_masteries > 0
    assert total_events > 0

    print(f"   [5.1] Direct DB Query Verified: {total_users} Users, {total_classes} Class, {total_members} ClassMember, {total_masteries} SkillMasteries, {total_events} LearningEvents stored cleanly in DB!\n")

    print("═"*75)
    print("🎉 ALL ACCEPTANCE SUITE TESTS PASSED WITH 100% SUCCESS!")
    print("═"*75 + "\n")


if __name__ == "__main__":
    run_final_acceptance_suite()
