#!/usr/bin/env bash
# scripts/setup.sh — Unix/Linux/macOS Setup Automation Script for ShikshaAI
set -e

echo ""
echo "====================================================================="
echo "🚀 SHIKSHAAI — ONE-COMMAND LOCAL DEVELOPMENT SETUP"
echo "====================================================================="
echo ""

# 1. Environment Variable Setup (.env)
if [ ! -f ".env" ]; then
    echo "[1/5] Creating .env from .env.example..."
    cp .env.example .env
    echo "   ✓ Created .env file. Configure GEMINI_API_KEY in .env if available."
    echo ""
else
    echo "[1/5] .env file already exists."
    echo ""
fi

# 2. Python Virtual Environment Setup
echo "[2/5] Setting up Python virtual environment..."
if [ ! -d "backend/venv" ]; then
    python3 -m venv backend/venv
    echo "   ✓ Created virtual environment at backend/venv"
fi
backend/venv/bin/python -m pip install --upgrade pip setuptools wheel
backend/venv/bin/pip install -r backend/requirements.txt
echo "   ✓ Installed backend Python dependencies."
echo ""

# 3. Frontend Node Dependencies Setup
echo "[3/5] Installing frontend Node dependencies..."
cd frontend
npm install
cd ..
echo "   ✓ Installed frontend npm packages."
echo ""

# 4. Database Setup & Clean Schema Creation
echo "[4/5] Preparing database & running migrations..."
backend/venv/bin/python backend/reset_and_seed_content.py
echo "   ✓ Initialized clean database schema."
echo ""

# 5. Knowledge Base RAG Ingestion
echo "[5/5] Ingesting NCERT textbook knowledge base & question bank..."
backend/venv/bin/python scripts/ingest_knowledge.py

echo ""
echo "====================================================================="
echo "✨ SETUP COMPLETE! RUN ./scripts/start.sh TO START THE APPLICATION."
echo "====================================================================="
echo ""
