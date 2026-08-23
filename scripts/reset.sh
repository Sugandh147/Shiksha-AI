#!/usr/bin/env bash
# scripts/reset.sh — Local Development Database Reset Script
set -e

echo ""
echo "====================================================================="
echo "⚠️  LOCAL DEVELOPMENT DATABASE RESET (PURGES ALL USER ACCOUNTS)"
echo "====================================================================="
echo ""

backend/venv/bin/python backend/reset_and_seed_content.py

echo ""
echo "   ✓ Database reset complete. User count reset to 0."
echo ""
