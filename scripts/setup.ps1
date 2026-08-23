# scripts/setup.ps1 — Windows Setup Automation Script for ShikshaAI
$ErrorActionPreference = "Stop"

Write-Host "`n=====================================================================" -ForegroundColor Cipher
Write-Host "🚀 SHIKSHAAI — ONE-COMMAND LOCAL DEVELOPMENT SETUP" -ForegroundColor Green
Write-Host "=====================================================================`n" -ForegroundColor Cipher

# 1. Environment Variable Setup (.env)
if (-not (Test-Path ".env")) {
    Write-Host "[1/5] Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "   ✓ Created .env file. Update GEMINI_API_KEY in .env if available.`n" -ForegroundColor Green
} else {
    Write-Host "[1/5] .env file already exists.`n" -ForegroundColor Cyan
}

# 2. Python Virtual Environment Setup
Write-Host "[2/5] Setting up Python virtual environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend\venv")) {
    python -m venv backend\venv
    Write-Host "   ✓ Created virtual environment at backend\venv" -ForegroundColor Green
}
& "backend\venv\Scripts\python.exe" -m pip install --upgrade pip setuptools wheel
& "backend\venv\Scripts\pip.exe" install -r backend\requirements.txt
Write-Host "   ✓ Installed backend Python dependencies.`n" -ForegroundColor Green

# 3. Frontend Node Dependencies Setup
Write-Host "[3/5] Installing frontend Node dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..
Write-Host "   ✓ Installed frontend npm packages.`n" -ForegroundColor Green

# 4. Database Setup & Docker Check
Write-Host "[4/5] Preparing database & running Alembic migrations..." -ForegroundColor Yellow
& "backend\venv\Scripts\python.exe" backend\reset_and_seed_content.py
Write-Host "   ✓ Initialized clean database schema.`n" -ForegroundColor Green

# 5. Knowledge Base RAG Ingestion
Write-Host "[5/5] Ingesting NCERT textbook knowledge base & question bank..." -ForegroundColor Yellow
& "backend\venv\Scripts\python.exe" scripts\ingest_knowledge.py

Write-Host "`n=====================================================================" -ForegroundColor Cipher
Write-Host "✨ SETUP COMPLETE! RUN .\scripts\start.ps1 TO START THE APPLICATION." -ForegroundColor Green
Write-Host "=====================================================================`n" -ForegroundColor Cipher
