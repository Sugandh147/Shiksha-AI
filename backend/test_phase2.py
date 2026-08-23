"""
test_phase2.py
──────────────
Verification test suite for Phase 2 implementation.
Tests:
  1. Student login & JWT token generation
  2. Student registration & initial profile state
  3. Student onboarding & initial learning profile creation
  4. Student dashboard data fetching (backend dynamic content)
  5. Teacher login & profile retrieval
  6. RBAC Protected Routes: Student attempting to access teacher routes (403 Forbidden)
  7. RBAC Data Isolation: Teacher attempting to access unrelated student data (403 Forbidden)
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_phase2_tests():
    print("\n🧪 Running Phase 2 Automated Tests...\n" + "─"*50)

    # ── Test 1: Student Login ─────────────────────────────────────────────────
    print("1. Testing Student Login...")
    resp = client.post("/api/v1/auth/login", json={
        "email": "arjun.mehta@student.in",
        "password": "student123"
    })
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    student_auth = resp.json()
    student_token = student_auth["access_token"]
    student_id = student_auth["user"]["id"]
    print(f"   ✅ Student Login Successful! User ID: {student_id}, Token Length: {len(student_token)}")

    # ── Test 2: Teacher Login ─────────────────────────────────────────────────
    print("\n2. Testing Teacher Login...")
    resp = client.post("/api/v1/auth/login", json={
        "email": "priya.sharma@shikshaai.in",
        "password": "teacher123"
    })
    assert resp.status_code == 200, f"Teacher login failed: {resp.text}"
    teacher_auth = resp.json()
    teacher_token = teacher_auth["access_token"]
    teacher_id = teacher_auth["user"]["id"]
    print(f"   ✅ Teacher Login Successful! Teacher ID: {teacher_id}, Role: {teacher_auth['user']['role']}")

    # ── Test 3: New Student Register & Onboarding ─────────────────────────────
    print("\n3. Testing New Student Registration & Onboarding...")
    new_email = "test.student.phase2@shikshaai.in"
    reg_resp = client.post("/api/v1/auth/register", json={
        "email": new_email,
        "full_name": "Test Student Phase2",
        "password": "password123",
        "role": "student",
        "preferred_language": "en"
    })
    assert reg_resp.status_code == 201, f"Register failed: {reg_resp.text}"
    new_student_token = reg_resp.json()["access_token"]
    new_student_id = reg_resp.json()["user"]["id"]
    print(f"   ✅ New Student Registered! ID: {new_student_id}")

    # Submit onboarding
    onboard_resp = client.post("/api/v1/student/onboarding", json={
        "name": "Test Student Phase2 Updated",
        "education_level": "Middle School",
        "class_grade": 8,
        "subjects": ["Mathematics", "Science"],
        "preferred_language": "hinglish",
        "learning_goal": "Score high in school exams"
    }, headers={"Authorization": f"Bearer {new_student_token}"})
    assert onboard_resp.status_code == 200, f"Onboarding failed: {onboard_resp.text}"
    onboard_data = onboard_resp.json()
    assert onboard_data["onboarding_completed"] is True
    print(f"   ✅ Student Onboarding Completed & Initial Learning Profile Created! Goal: '{onboard_data['learning_goal']}'")

    # ── Test 4: Student Dashboard Data Fetching ──────────────────────────────
    print("\n4. Testing Backend-Driven Student Dashboard...")
    dash_resp = client.get("/api/v1/student/dashboard", headers={"Authorization": f"Bearer {student_token}"})
    assert dash_resp.status_code == 200, f"Dashboard failed: {dash_resp.text}"
    dash = dash_resp.json()
    print(f"   ✅ Dashboard Data Received:")
    print(f"      • Welcome: {dash['welcome_message']}")
    print(f"      • Overall Mastery: {dash['overall_mastery']}%")
    print(f"      • Weak Topics Count: {len(dash['weak_topics'])}")
    print(f"      • Streak: {dash['streak_days']} days | XP: {dash['total_xp']}")

    # ── Test 5: Teacher Student Roster Retrieval ─────────────────────────────
    print("\n5. Testing Teacher Roster Access...")
    roster_resp = client.get("/api/v1/teacher/students", headers={"Authorization": f"Bearer {teacher_token}"})
    assert roster_resp.status_code == 200, f"Teacher roster failed: {roster_resp.text}"
    roster = roster_resp.json()
    print(f"   ✅ Teacher Roster Fetched: {len(roster)} enrolled students in Grade 8 Section A")

    # ── Test 6: Verify Student Cannot Access Teacher Routes ───────────────────
    print("\n6. Testing RBAC: Student accessing Teacher route...")
    forbidden_resp = client.get("/api/v1/teacher/profile", headers={"Authorization": f"Bearer {student_token}"})
    assert forbidden_resp.status_code == 403, f"Expected 403 Forbidden, got {forbidden_resp.status_code}"
    print(f"   ✅ RBAC Enforced: Student call to /teacher/profile blocked with 403 Forbidden!")

    # ── Test 7: Verify Teacher Cannot Access Unrelated Student Data ─────────
    print("\n7. Testing RBAC Data Isolation: Teacher accessing unrelated student data...")
    # new_student_id is NOT in teacher's class
    unrelated_resp = client.get(f"/api/v1/teacher/students/{new_student_id}", headers={"Authorization": f"Bearer {teacher_token}"})
    assert unrelated_resp.status_code == 403, f"Expected 403 Forbidden for unrelated student, got {unrelated_resp.status_code}"
    print(f"   ✅ Data Isolation Enforced: Teacher accessing unassigned Student #{new_student_id} blocked with 403 Forbidden!")

    print("\n" + "═"*50 + "\n🎉 ALL PHASE 2 AUTOMATED TESTS PASSED SUCCESSFULLY!\n" + "═"*50 + "\n")

if __name__ == "__main__":
    run_phase2_tests()
