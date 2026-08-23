# scripts/start.ps1 — Windows Application Startup Script for ShikshaAI
$ErrorActionPreference = "Stop"

Write-Host "`n=====================================================================" -ForegroundColor Cipher
Write-Host "🚀 STARTING SHIKSHAAI LOCAL DEVELOPMENT SERVERS" -ForegroundColor Green
Write-Host "=====================================================================`n" -ForegroundColor Cipher

# Check for Docker Compose DB (optional, if using Postgres)
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    Write-Host "Checking Docker PostgreSQL service..." -ForegroundColor Yellow
    docker compose up -d db | Out-Null
    Write-Host "   ✓ Docker PostgreSQL container running.`n" -ForegroundColor Green
}

Write-Host "Starting FastAPI Backend Server (http://localhost:8000)..." -ForegroundColor Cyan
$backendProc = Start-Process -FilePath "backend\venv\Scripts\python.exe" -ArgumentList "-m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000" -WorkingDirectory "backend" -PassThru

Write-Host "Starting Next.js Frontend Server (http://localhost:3000)..." -ForegroundColor Cyan
Set-Location frontend
npm run dev
