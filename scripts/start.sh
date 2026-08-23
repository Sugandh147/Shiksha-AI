#!/usr/bin/env bash
# scripts/start.sh — Unix/Linux/macOS Application Startup Script for ShikshaAI
set -e

echo ""
echo "====================================================================="
echo "🚀 STARTING SHIKSHAAI LOCAL DEVELOPMENT SERVERS"
echo "====================================================================="
echo ""

if command -v docker &> /dev/null; then
    echo "Checking Docker PostgreSQL service..."
    docker compose up -d db || true
    echo "   ✓ Docker PostgreSQL status checked."
    echo ""
fi

echo "Starting FastAPI Backend Server (http://localhost:8000)..."
backend/venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --app-dir backend &
BACKEND_PID=$!

echo "Starting Next.js Frontend Server (http://localhost:3000)..."
cd frontend
npm run dev

kill $BACKEND_PID 2>/dev/null || true
