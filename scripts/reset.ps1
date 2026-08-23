# scripts/reset.ps1 — Local Development Database Reset Script
$ErrorActionPreference = "Stop"

Write-Host "`n=====================================================================" -ForegroundColor Red
Write-Host "⚠️  LOCAL DEVELOPMENT DATABASE RESET (PURGES ALL USER ACCOUNTS)" -ForegroundColor Red
Write-Host "=====================================================================`n" -ForegroundColor Red

& "backend\venv\Scripts\python.exe" backend\reset_and_seed_content.py

Write-Host "`n   ✓ Database reset complete. User count reset to 0.`n" -ForegroundColor Green
