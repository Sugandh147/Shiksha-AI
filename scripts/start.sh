#!/usr/bin/env bash
# scripts/start.sh
# ShikshaAI — Start both servers (macOS / Linux)
# Run from the PROJECT ROOT:  bash scripts/start.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "$SCRIPT_DIR")"

PYEX="$ROOT/backend/venv/bin/python"

# Guard: make sure setup has been run
if [ ! -f "$PYEX" ]; then
    echo ""
    echo "   ERROR: Virtual environment not found."
    echo "   Please run setup first:  bash scripts/setup.sh"
    exit 1
fi
if [ ! -d "$ROOT/frontend/node_modules" ]; then
    echo ""
    echo "   ERROR: node_modules not found."
    echo "   Please run setup first:  bash scripts/setup.sh"
    exit 1
fi
if [ ! -f "$ROOT/backend/.env" ]; then
    echo ""
    echo "   ERROR: backend/.env not found."
    echo "   Please run setup first:  bash scripts/setup.sh"
    exit 1
fi

echo ""
echo "====================================================================="
echo "   ShikshaAI — STARTING DEVELOPMENT SERVERS"
echo "====================================================================="
echo ""
echo "   Backend  →  http://localhost:8000      (FastAPI)"
echo "   Frontend →  http://localhost:3000      (Next.js)"
echo "   API Docs →  http://localhost:8000/docs (Swagger)"
echo ""
echo "   Press Ctrl+C to stop both servers."
echo ""

# Start backend in background
cd "$ROOT/backend"
"$PYEX" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
echo "   Backend started (PID $BACKEND_PID)"
cd "$ROOT"

# Give backend a moment to bind port
sleep 2

# Cleanup on Ctrl+C or exit
cleanup() {
    echo ""
    echo "   Stopping servers..."
    kill "$BACKEND_PID" 2>/dev/null || true
    echo "   Both servers stopped."
    exit 0
}
trap cleanup SIGINT SIGTERM

# Frontend runs in foreground
cd "$ROOT/frontend"
npm run dev

# If Next.js exits normally, clean up backend
kill "$BACKEND_PID" 2>/dev/null || true
