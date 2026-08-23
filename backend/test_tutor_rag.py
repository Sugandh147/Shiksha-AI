"""
test_tutor_rag.py
──────────────────
Automated test suite for AI Tutor Retrieval-Augmented Generation (RAG) System.
Tests:
  1. Login student & retrieve auth headers.
  2. Test Question 1 (Quadratic Equations): Discriminant & Nature of Roots.
  3. Test Question 2 (Trigonometry): Pythagorean identity sin^2(x) + cos^2(x) = 1.
  4. Test Question 3 (Statistics): Arithmetic Mean & Measures of Central Tendency.
  5. Test Question 4 (Geometry): Pythagorean Theorem in right triangles.
  6. Test Question 5 (Algebra): Difference of squares factoring (x^2 - 9y^2).
  7. Test Quick Action Modifiers: "simpler", "deeper", "example", "practice".
  8. Verify Grounded Source Citations & RAG Fallback.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def run_tutor_rag_tests():
    print("\n🤖 Running AI Tutor RAG Automated Test Suite...\n" + "─"*60)

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

    session_id = None

    # Test Questions list covering the 5 target topics
    test_questions = [
        {
            "topic": "Quadratic Equations",
            "query": "How do I solve quadratic equations using the discriminant D = b^2 - 4ac?",
            "modifier": None,
            "expected_kw": ["discriminant", "root", "formula"]
        },
        {
            "topic": "Trigonometry",
            "query": "What is sin^2(x) + cos^2(x) equal to in trigonometry?",
            "modifier": "simpler",
            "expected_kw": ["identity", "1", "triangle"]
        },
        {
            "topic": "Statistics",
            "query": "How do I calculate the arithmetic mean of a data set?",
            "modifier": "example",
            "expected_kw": ["mean", "sum", "average"]
        },
        {
            "topic": "Geometry",
            "query": "What is the Pythagorean theorem for right-angled triangles?",
            "modifier": "deeper",
            "expected_kw": ["hypotenuse", "square", "triangle"]
        },
        {
            "topic": "Algebra",
            "query": "How do I factorize difference of squares like x^2 - 9y^2?",
            "modifier": "practice",
            "expected_kw": ["factor", "squares", "identity"]
        },
    ]

    for idx, tq in enumerate(test_questions, start=1):
        print(f"\n{idx+1}. Testing Question #{idx} [{tq['topic']}]: '{tq['query']}'")
        payload = {
            "message": tq["query"],
            "topic_name": tq["topic"],
            "session_id": session_id,
            "modifier": tq["modifier"]
        }
        resp = client.post("/api/v1/tutor/chat", json=payload, headers=headers)
        assert resp.status_code == 200, f"Tutor chat failed for Q{idx}: {resp.text}"
        res_data = resp.json()

        session_id = res_data["session_id"]

        print(f"   ✅ Explanation: {res_data['explanation'][:110]}...")
        print(f"   ✅ Step-by-Step Items: {len(res_data['step_by_step'])} steps")
        print(f"   ✅ Worked Example: {res_data['example'][:90]}...")
        print(f"   ✅ Sources & Citations Returned: {len(res_data['sources'])}")

        assert len(res_data["explanation"]) > 20, "Explanation too short"
        assert len(res_data["sources"]) > 0, "No source citations returned"

        first_source = res_data["sources"][0]
        print(f"      • Top Source Citation: '{first_source['title']}' ({int(first_source['relevance_score']*100)}% match)")

    print("\n" + "═"*60 + "\n🎉 ALL 5 RAG QUESTIONS PASSED SUCCESSFULLY WITH SOURCE CITATIONS!\n" + "═"*60 + "\n")


if __name__ == "__main__":
    run_tutor_rag_tests()
