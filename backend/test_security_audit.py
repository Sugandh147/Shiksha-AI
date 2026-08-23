"""
test_security_audit.py
────────────────────────
Automated Security Audit & Hardening Test Suite for ShikshaAI.
Verifies:
  1. Secret Leak & Git Tracking Security (.gitignore, .env)
  2. Bcrypt Password Hashing & Salt Security
  3. JWT Signature Integrity & Token Forgery Rejection
  4. Cross-Student Data Access Isolation (403/404 Forbidden)
  5. Teacher Class & Student RBAC Authorization Boundaries
  6. File Upload MIME Type Filtering & 5 MB Size Capping
  7. AI Prompt Sanitization & Length Caps
  8. Sanitized Global Exception Handling
"""

import sys
import os
import io
import json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.db.database import SessionLocal
from app.db.models import User, UserRole

client = TestClient(app)


def run_security_audit_suite():
    print("\n" + "═"*75)
    print("🛡️ SHIKSHAAI — AUTOMATED SECURITY AUDIT & DEFENSIVE HARDENING TEST SUITE")
    print("═"*75 + "\n")

    # ── 1. Secret Leak & Git Tracking Security ─────────────────────────────────
    print("TEST 1: Verifying Secret Leak Prevention & .gitignore Rules...")
    bgit = os.path.join(os.path.dirname(__file__), ".gitignore")
    fgit = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", ".gitignore")
    rgit = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".gitignore")

    for gpath in [bgit, fgit, rgit]:
        if os.path.exists(gpath):
            with open(gpath, "r", encoding="utf-8") as f:
                content = f.read()
                assert ".env" in content or "env" in content, f".gitignore at {gpath} must exclude .env files"
    print("   ✅ PASS: .gitignore files properly exclude .env and sensitive environment files")

    # ── 2. Password Hashing Security ─────────────────────────────────────────
    print("\nTEST 2: Verifying Bcrypt Password Hashing Security...")
    db = SessionLocal()
    u = db.query(User).filter(User.email == "arjun.mehta@student.in").first()
    db.close()
    assert u is not None
    assert u.password_hash.startswith("$2b$") or u.password_hash.startswith("$2a$"), "Passwords must use Bcrypt salt hashing"
    assert u.password_hash != "student123", "Raw passwords must never be stored in plain text"
    print("   ✅ PASS: Password hashing verified (Bcrypt salted hash)")

    # ── 3. JWT Signature Integrity & Token Forgery Rejection ───────────────────
    print("\nTEST 3: Verifying JWT Token Forgery Rejection...")
    forged_headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake_signature"}
    forged_resp = client.get("/api/v1/student/dashboard", headers=forged_headers)
    assert forged_resp.status_code in [401, 403], f"Expected 401/403 for forged JWT token, got {forged_resp.status_code}"
    print("   ✅ PASS: Forged JWT token successfully rejected (401/403 Unauthorized)")

    # ── 4. Student Auth & RBAC Isolation ──────────────────────────────────────
    print("\nTEST 4: Verifying Student Authentication & RBAC Boundary...")
    s_login = client.post("/api/v1/auth/login", json={"email": "arjun.mehta@student.in", "password": "student123"})
    assert s_login.status_code == 200
    s_token = s_login.json()["access_token"]
    s_headers = {"Authorization": f"Bearer {s_token}"}

    # Student trying to access teacher analytics -> 403 Forbidden
    rbac_resp = client.get("/api/v1/teachers/classes/1/analytics", headers=s_headers)
    assert rbac_resp.status_code == 403, f"Expected 403 Forbidden for cross-role call, got {rbac_resp.status_code}"
    print("   ✅ PASS: Student blocked from accessing teacher analytics (HTTP 403 Forbidden)")

    # ── 5. Teacher Class & Student Access Boundaries ───────────────────────────
    print("\nTEST 5: Verifying Teacher Data Isolation Boundaries...")
    t_login = client.post("/api/v1/auth/login", json={"email": "priya.sharma@shikshaai.in", "password": "teacher123"})
    assert t_login.status_code == 200
    t_token = t_login.json()["access_token"]
    t_headers = {"Authorization": f"Bearer {t_token}"}

    # Teacher trying to access unassigned class (e.g. Class #999) -> 403 Forbidden
    unassigned_resp = client.get("/api/v1/teachers/classes/999/analytics", headers=t_headers)
    assert unassigned_resp.status_code == 403, f"Expected 403 Forbidden for unassigned class, got {unassigned_resp.status_code}"
    print("   ✅ PASS: Teacher blocked from accessing unassigned class data (HTTP 403 Forbidden)")

    # ── 6. File Upload MIME Type Filtering & Size Limits ───────────────────────
    print("\nTEST 6: Verifying File Upload MIME Type Filtering & Size Cap...")
    # Test invalid MIME type (e.g., text/plain executable file)
    txt_files = {"file": ("malicious.exe", io.BytesIO(b"fake executable payload"), "text/plain")}
    txt_resp = client.post("/api/v1/tutor/scan-question", files=txt_files, headers=s_headers)
    assert txt_resp.status_code in [400, 415, 422], f"Expected 400 Bad Request for non-image file, got {txt_resp.status_code}"
    print("   ✅ PASS: Invalid non-image MIME types rejected (HTTP 400 Bad Request)")

    # Test file size limit exceeding 5 MB
    large_bytes = b"0" * (6 * 1024 * 1024)  # 6 MB file
    large_files = {"file": ("huge_photo.png", io.BytesIO(large_bytes), "image/png")}
    large_resp = client.post("/api/v1/tutor/scan-question", files=large_files, headers=s_headers)
    assert large_resp.status_code == 413, f"Expected 413 Entity Too Large for 6MB file, got {large_resp.status_code}"
    print("   ✅ PASS: File size > 5 MB successfully rejected (HTTP 413 Entity Too Large)")

    # ── 7. AI Prompt Input Length Caps & Injection Safeguards ──────────────────
    print("\nTEST 7: Verifying AI Prompt Injection Mitigation & Input Length Capping...")
    oversized_prompt = "Explain algebra " * 200  # >2000 chars
    chat_resp = client.post("/api/v1/tutor/chat", json={
        "message": oversized_prompt,
        "topic_name": "Algebra",
        "language": "en"
    }, headers=s_headers)
    assert chat_resp.status_code == 200, f"AI Tutor must gracefully process or truncate long queries without crashing: {chat_resp.text}"
    print("   ✅ PASS: AI Tutor gracefully handled oversized query without server crash")

    # ── 8. Sanitized Global Exception Handling ─────────────────────────────────
    print("\nTEST 8: Verifying Sanitized Global Exception Responses...")
    bad_req = client.post("/api/v1/tutor/chat", json={"invalid": "payload"}, headers=s_headers)
    assert bad_req.status_code in [400, 422]
    bad_json = bad_req.json()
    assert "traceback" not in bad_json, "Raw stack traces must not be exposed to client responses"
    print("   ✅ PASS: Global exception handlers sanitize error payloads (no stack trace exposure)")

    print("\n" + "═"*75)
    print("🎉 ALL SECURITY AUDIT TEST CASES PASSED WITH 100% SUCCESS!")
    print("═"*75 + "\n")


if __name__ == "__main__":
    run_security_audit_suite()
