"""
test_opportunity_match.py
───────────────────────────
Automated test suite for OpportunityMatch Module.
Tests:
  1. GET /opportunities — List verified public and clearly labeled demo opportunities.
  2. GET /opportunities/matches — Calculate personalized transparent match scores & rationale.
  3. Verify transparent rationale reasons ("Why this matches you").
  4. Verify descending sort order by match score %.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def run_opportunity_match_tests():
    print("\n🏆 Running OpportunityMatch Module Automated Test Suite...\n" + "─"*65)

    # 1. Register / Login Student
    print("1. Registering student (opp.student@shikshaai.in)...")
    reg_resp = client.post("/api/v1/auth/register", json={
        "email": "opp.student@shikshaai.in",
        "full_name": "Opportunity Test Student",
        "password": "Password123!",
        "role": "student"
    })
    if reg_resp.status_code == 200:
        token = reg_resp.json()["access_token"]
    else:
        login_resp = client.post("/api/v1/auth/login", json={
            "email": "opp.student@shikshaai.in",
            "password": "Password123!"
        })
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   ✅ Student Authenticated")

    # 2. Test GET /api/v1/opportunities
    print("\n2. Testing GET /api/v1/opportunities...")
    opps_resp = client.get("/api/v1/opportunities", headers=headers)
    assert opps_resp.status_code == 200, f"Get opportunities failed: {opps_resp.text}"
    opps_list = opps_resp.json()
    print(f"   ✅ Opportunities Found: {len(opps_list)} items in database")

    verified_count = sum(1 for o in opps_list if not o["is_demo"])
    demo_count = sum(1 for o in opps_list if o["is_demo"])
    print(f"      • Verified Public Scholarships: {verified_count}")
    print(f"      • Clearly Labeled Demo Items:   {demo_count}")
    assert verified_count >= 3
    assert demo_count >= 2

    # 3. Test GET /api/v1/opportunities/matches
    print("\n3. Testing GET /api/v1/opportunities/matches...")
    matches_resp = client.get("/api/v1/opportunities/matches", headers=headers)
    assert matches_resp.status_code == 200, f"Get matches failed: {matches_resp.text}"
    matches_list = matches_resp.json()
    assert len(matches_list) > 0, "No opportunity matches returned"

    print(f"   ✅ Calculated Matches: {len(matches_list)} matched opportunities")
    top_match = matches_list[0]

    print("\n   Top Opportunity Match Details:")
    print(f"   • Name: '{top_match['opportunity']['name']}'")
    print(f"   • Provider: '{top_match['opportunity']['provider']}'")
    print(f"   • Match Score: {top_match['match_score']}% ({top_match['match_category']})")
    print(f"   • Is Demo Flag: {top_match['opportunity']['is_demo']}")
    print("   • Why This Matches You (Transparent Rationale):")
    for r in top_match["why_matches"]:
        print(f"     - {r}")

    assert top_match["match_score"] >= 50.0
    assert len(top_match["why_matches"]) >= 2
    assert "Matched:" in top_match["why_matches"][0] or "Eligible:" in top_match["why_matches"][0]

    # 4. Verify Descending Sort Order
    scores = [m["match_score"] for m in matches_list]
    assert scores == sorted(scores, reverse=True), "Matches must be sorted descending by match score"
    print("\n   ✅ Descending Match Score Sorting Verified!")

    print("\n" + "═"*65 + "\n🎉 ALL OPPORTUNITY MATCH AUTOMATED TESTS PASSED!\n" + "═"*65 + "\n")


if __name__ == "__main__":
    run_opportunity_match_tests()
