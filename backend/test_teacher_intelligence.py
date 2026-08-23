"""
test_teacher_intelligence.py
──────────────────────────────
Automated test suite for ClassPulse Teacher Intelligence System.
Tests:
  1. Teacher Authentication.
  2. GET /teachers/classes — Class listing.
  3. GET /teachers/classes/{id}/analytics — ClassPulse dashboard metrics & Learning Attention Indicators.
  4. GET /teachers/students/{id}/insights — Student detail insights & recommended interventions.
  5. POST /teachers/copilot — Privacy-preserving AI Copilot Q&A across 4 scenario queries.
  6. RBAC Isolation Verification — Verify unauthorized student access is blocked (403 Forbidden).
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def run_teacher_intelligence_tests():
    print("\n👩‍🏫 Running ClassPulse Teacher Intelligence Automated Test Suite...\n" + "─"*65)

    # 1. Login Teacher
    print("1. Logging in teacher (priya.sharma@shikshaai.in)...")
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "priya.sharma@shikshaai.in",
        "password": "teacher123"
    })
    assert login_resp.status_code == 200, f"Teacher login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    teacher_name = login_resp.json()["user"]["full_name"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"   ✅ Logged in as Teacher: {teacher_name}")

    # 2. List Classes
    print("\n2. Testing GET /api/v1/teachers/classes...")
    classes_resp = client.get("/api/v1/teachers/classes", headers=headers)
    assert classes_resp.status_code == 200, f"Get classes failed: {classes_resp.text}"
    classes_list = classes_resp.json()
    assert len(classes_list) > 0, "No classes found for teacher"
    class_obj = classes_list[0]
    class_id = class_obj["id"]
    print(f"   ✅ Classes Found: {len(classes_list)} classes. Target Class: '{class_obj['name']}' (ID #{class_id})")

    # 3. ClassPulse Analytics & Learning Attention Indicator
    print(f"\n3. Testing GET /api/v1/teachers/classes/{class_id}/analytics...")
    analytics_resp = client.get(f"/api/v1/teachers/classes/{class_id}/analytics", headers=headers)
    assert analytics_resp.status_code == 200, f"Analytics failed: {analytics_resp.text}"
    analytics = analytics_resp.json()

    print(f"   ✅ ClassPulse Analytics Received:")
    print(f"      • Total Students: {analytics['total_students']}")
    print(f"      • Average Mastery: {analytics['average_mastery']}%")
    print(f"      • Average Quiz Accuracy: {analytics['average_quiz_accuracy']}%")
    print(f"      • Students Needing Attention: {len(analytics['students_needing_attention'])}")
    print(f"      • Most Difficult Topics: {[t['topic_name'] + ' (' + str(t['average_mastery']) + '%)' for t in analytics['most_difficult_topics']]}")

    if analytics['students_needing_attention']:
        flagged = analytics['students_needing_attention'][0]
        print(f"      • Flagged Student: {flagged['full_name']} ({flagged['risk_level']} Risk - Score {flagged['risk_score']})")
        print(f"        Flagged Reasons: {flagged['flagged_reasons']}")
        assert len(flagged["flagged_reasons"]) > 0, "Flagged reasons should be transparently listed"
    print("   ✅ Learning Attention Indicator Verified!")

    # 4. Student Detail Insights
    from app.db.database import SessionLocal
    from app.db.models import ClassMember
    db = SessionLocal()
    member = db.query(ClassMember).filter(ClassMember.class_id == class_id).first()
    student_id = member.student_id if member else 2
    db.close()

    print(f"\n4. Testing GET /api/v1/teachers/students/{student_id}/insights...")
    insights_resp = client.get(f"/api/v1/teachers/students/{student_id}/insights", headers=headers)
    assert insights_resp.status_code == 200, f"Insights failed: {insights_resp.text}"
    insights = insights_resp.json()

    print(f"   ✅ Student Detail Insights Received for {insights['full_name']}:")
    print(f"      • Overall Mastery: {insights['overall_mastery']}%")
    print(f"      • Attention Level: {insights['attention_level']}")
    print(f"      • Weak Topics Count: {len(insights['weak_topics'])}")
    print(f"      • Recommended Intervention: '{insights['recommended_intervention']}'")
    assert "recommended_intervention" in insights

    # 5. Teacher Copilot Q&A Engine
    print("\n5. Testing Teacher Copilot (POST /api/v1/teachers/copilot) across 4 scenario queries...")
    copilot_queries = [
        "Which students need help with algebra?",
        "Which topic is the class struggling with?",
        "Who has improved the most?",
        "What should I teach tomorrow?",
    ]

    for q_idx, q in enumerate(copilot_queries, start=1):
        cp_resp = client.post("/api/v1/teachers/copilot", json={"question": q, "class_id": class_id}, headers=headers)
        assert cp_resp.status_code == 200, f"Copilot query failed for '{q}': {cp_resp.text}"
        cp_data = cp_resp.json()
        print(f"\n   Copilot Query #{q_idx}: '{q}'")
        print(f"   • Answer: {cp_data['answer'][:110]}...")
        print(f"   • Data Sources: {cp_data['data_sources']}")
        print(f"   • Recommended Actions: {cp_data['recommended_actions']}")
        assert len(cp_data["answer"]) > 10
        assert len(cp_data["recommended_actions"]) > 0

    # 6. RBAC Isolation Check
    print("\n6. Testing RBAC Isolation (Blocking unauthorized student details access)...")
    unauth_resp = client.get("/api/v1/teachers/students/9999/insights", headers=headers)
    assert unauth_resp.status_code == 403, f"Expected 403 Forbidden, got {unauth_resp.status_code}"
    print("   ✅ RBAC Verification Passed: Unauthorized student access blocked (403 Forbidden)!")

    print("\n" + "═"*65 + "\n🎉 ALL CLASSPULSE TEACHER INTELLIGENCE AUTOMATED TESTS PASSED!\n" + "═"*65 + "\n")


if __name__ == "__main__":
    run_teacher_intelligence_tests()
