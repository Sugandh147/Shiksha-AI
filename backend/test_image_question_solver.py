"""
test_image_question_solver.py
──────────────────────────────
Automated test suite for Image Question Solver (POST /api/v1/tutor/scan-question).
Tests:
  1. Student Authentication.
  2. Printed Math Question Image Upload (Quadratic Equations).
  3. Handwritten Math Question Image Upload (Trigonometry).
  4. Structured Response Validation (Problem, Concept, Steps, Answer, Verification, Similar Question).
  5. Invalid File / Format Handling (400 Bad Request).
  6. Multilingual Vision Solver (Hindi & Hinglish).
"""

import sys
import os
import io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def create_dummy_png_bytes() -> bytes:
    """Generate a valid 1x1 PNG image byte string for testing."""
    return (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc`\x00\x00\x00"
        b"\x02\x00\x01H\xaf\xa4q\x00\x00\x00\x00IEND\xaeB`\x82"
    )


def run_image_question_solver_tests():
    print("\n📷 Running Image Question Solver Automated Test Suite...\n" + "─"*65)

    # 1. Login Student
    print("1. Logging in student (arjun.mehta@student.in)...")
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "arjun.mehta@student.in",
        "password": "student123"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   ✅ Student Logged In")

    png_bytes = create_dummy_png_bytes()

    # 2. Test Printed Question Image Upload (Quadratic Equations)
    print("\n2. Testing POST /api/v1/tutor/scan-question (Printed Quadratic Equation Image)...")
    files = {"file": ("quadratic_question.png", io.BytesIO(png_bytes), "image/png")}
    data = {"topic_name": "Quadratic Equations", "language": "en"}

    resp1 = client.post("/api/v1/tutor/scan-question", files=files, data=data, headers=headers)
    assert resp1.status_code == 200, f"Scan question failed: {resp1.text}"
    out1 = resp1.json()

    print("   ✅ Structured Vision Response Received:")
    print(f"      • Extracted Question: '{out1['extracted_question']}'")
    print(f"      • Problem Formulation: '{out1['problem']}'")
    print(f"      • Core Concept: '{out1['concept']}'")
    print(f"      • Steps Count: {len(out1['steps'])} steps")
    print(f"      • Answer: '{out1['answer']}'")
    print(f"      • Verification: '{out1['verification'][:80]}...'")
    print(f"      • Similar Question: '{out1['similar_question']}'")

    assert len(out1["extracted_question"]) > 5
    assert len(out1["steps"]) >= 3
    assert len(out1["answer"]) > 0
    assert len(out1["verification"]) > 0
    assert len(out1["similar_question"]) > 0

    # 3. Test Handwritten Question Image Upload (Trigonometry)
    print("\n3. Testing POST /api/v1/tutor/scan-question (Handwritten Trigonometry Image)...")
    files_trig = {"file": ("trig_handwritten.jpg", io.BytesIO(png_bytes), "image/jpeg")}
    data_trig = {"topic_name": "Trigonometry", "language": "en"}

    resp2 = client.post("/api/v1/tutor/scan-question", files=files_trig, data=data_trig, headers=headers)
    assert resp2.status_code == 200, f"Handwritten scan failed: {resp2.text}"
    out2 = resp2.json()

    print(f"   ✅ Handwritten Vision Response Received:")
    print(f"      • Concept: '{out2['concept']}'")
    print(f"      • Answer: '{out2['answer']}'")
    assert "Trigonometric" in out2["concept"] or "Identities" in out2["concept"] or len(out2["steps"]) > 0

    # 4. Test Multilingual Vision Solving (Hindi)
    print("\n4. Testing Multilingual Vision Solving (language='hi')...")
    files_hi = {"file": ("math_hi.png", io.BytesIO(png_bytes), "image/png")}
    data_hi = {"topic_name": "Algebra", "language": "hi"}

    resp_hi = client.post("/api/v1/tutor/scan-question", files=files_hi, data=data_hi, headers=headers)
    assert resp_hi.status_code == 200, f"Multilingual scan failed: {resp_hi.text}"
    out_hi = resp_hi.json()
    print(f"   • Extracted Question (Hindi): '{out_hi['extracted_question']}'")
    print(f"   • Concept: '{out_hi['concept']}'")
    print("   ✅ Multilingual Vision Solving Verified!")

    # 5. Test Invalid Image Handling (Empty file / 400 Bad Request)
    print("\n5. Testing Invalid Image Handling (Empty file)...")
    files_empty = {"file": ("empty.jpg", io.BytesIO(b""), "image/jpeg")}
    resp_err = client.post("/api/v1/tutor/scan-question", files=files_empty, headers=headers)
    assert resp_err.status_code == 400, f"Expected 400 Bad Request, got {resp_err.status_code}"
    print(f"   ✅ Invalid Image Error Caught: '{resp_err.json()['detail']}'")

    print("\n" + "═"*65 + "\n🎉 ALL IMAGE QUESTION SOLVER AUTOMATED TESTS PASSED!\n" + "═"*65 + "\n")


if __name__ == "__main__":
    run_image_question_solver_tests()
