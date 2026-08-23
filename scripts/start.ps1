# scripts/start.ps1
# ShikshaAI — Start both servers (Windows PowerShell)
# Run from the PROJECT ROOT: .\scripts\start.ps1
# ─────────────────────────────────────────────────────────────────────────────

$Root = Split-Path -Parent $PSScriptRoot
$pyEx = "$Root\backend\venv\Scripts\python.exe"

# Guard: make sure setup has been run
if (-not (Test-Path $pyEx)) {
    Write-Host ""
    Write-Host "   ERROR: Virtual environment not found." -ForegroundColor Red
    Write-Host "   Please run setup first:  .\scripts\setup.ps1" -ForegroundColor Yellow
    exit 1
}
if (-not (Test-Path "$Root\frontend\node_modules")) {
    Write-Host ""
    Write-Host "   ERROR: node_modules not found." -ForegroundColor Red
    Write-Host "   Please run setup first:  .\scripts\setup.ps1" -ForegroundColor Yellow
    exit 1
}
if (-not (Test-Path "$Root\backend\.env")) {
    Write-Host ""
    Write-Host "   ERROR: backend\.env not found." -ForegroundColor Red
    Write-Host "   Please run setup first:  .\scripts\setup.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   SHIKSHAAI — STARTING DEVELOPMENT SERVERS"                          -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Backend  →  http://localhost:8000      (FastAPI)"  -ForegroundColor White
Write-Host "   Frontend →  http://localhost:3000      (Next.js)" -ForegroundColor White
Write-Host "   API Docs →  http://localhost:8000/docs (Swagger)"  -ForegroundColor White
Write-Host ""
Write-Host "   Press Ctrl+C to stop both servers." -ForegroundColor DarkGray
Write-Host ""

# Start backend in a new visible window so its logs are visible
$backendArgs  = "-m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
$backendProc  = Start-Process `
    -FilePath   $pyEx `
    -ArgumentList $backendArgs `
    -WorkingDirectory "$Root\backend" `
    -PassThru

Write-Host "   Backend started (PID $($backendProc.Id))" -ForegroundColor Green

# Give the backend a moment to bind its port
Start-Sleep -Seconds 2

# Frontend runs in this window (blocks until Ctrl+C)
Push-Location "$Root\frontend"
try {
    npm run dev
} finally {
    # When Next.js exits, kill the backend too
    Stop-Process -Id $backendProc.Id -ErrorAction SilentlyContinue
    Pop-Location
    Write-Host ""
    Write-Host "   Both servers stopped." -ForegroundColor Yellow
}
