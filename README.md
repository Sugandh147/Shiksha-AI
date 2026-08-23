# 🎓 ShikshaAI — AI-Powered Equitable K-12 Education Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-v20.11.0-brightgreen.svg)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-v3.11.0-blue.svg)](https://www.python.org/)
[![FastAPI Version](https://img.shields.io/badge/FastAPI-v0.110.0-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js Version](https://img.shields.io/badge/Next.js-v14.2-black.svg)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-v16_with_pgvector-336791.svg)](https://www.postgresql.org/)

---

## 📖 What it is
**ShikshaAI** is a grounded, multilingual AI-powered learning environment engineered specifically for Indian K-12 education. It combines **Grounded RAG AI Tutoring** (anchored strictly in official NCERT textbooks) with an **Adaptive Learning Engine** and **ClassPulse Teacher Intelligence** to deliver personalized 1-on-1 tutoring to students while giving teachers real-time diagnostic risk visibility.

---

## 🎯 Problem & Solution

### The Problem
- **Massive Student-Teacher Imbalance**: India has over 250 million K-12 students, leading to overcrowded classrooms where millions struggle silently with foundational math & science concepts.
- **Flawed Generic AI Chatbots**: Public chatbots like ChatGPT hallucinate math formulas, lack curriculum alignment, and fail to provide textbook citations or local language support.
- **Teacher Blind Spots**: Teachers lack real-time visibility into micro-concept gaps before semester exams.

### The Solution
- **Closed-Loop Grounded Learning**: Baseline diagnostic quizzes automatically pinpoint weak topics.
- **NCERT Grounded RAG Tutoring**: AI answers questions step-by-step in English, Hindi, or Hinglish with explicit textbook chapter citations.
- **Real-Time Mastery Gain**: Adaptive practice sets recalculate mastery scores ($0.75 \cdot Old + 0.25 \cdot Current$) and adjust difficulty in real time.
- **ClassPulse Teacher Copilot**: Teachers view live class rosters, attention risk flags, and use an AI Copilot to generate evidence-based teaching interventions.

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14 Turbopack)                     │
│  React 18 • TypeScript • Vanilla CSS Glassmorphism • Axios Client      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP REST Requests (JWT Bearer)
┌────────────────────────────────────▼────────────────────────────────────┐
│                      BACKEND API (FastAPI v0.110)                       │
│  Routers: Auth • Student • Teacher • Diagnostic • Tutor • Practice      │
└────────┬───────────────────────────┬───────────────────────────┬────────┘
         │ SQLAlchemy ORM            │ Vector Retrieval          │ Vision OCR
┌────────▼──────────┐       ┌────────▼──────────┐       ┌────────▼──────────┐
│ DATABASE STORAGE  │       │ GROUNDED RAG AI   │       │ VISION AI SOLVER  │
│ PostgreSQL/SQLite │       │ TF-IDF Cosine     │       │ Google Gemini     │
│ 17 Relational ORM │       │ NCERT Chunks      │       │ 1.5 Flash Vision  │
└───────────────────┘       └───────────────────┘       └───────────────────┘
```

---

## 💻 Tech Stack & Pinned Versions

- **Frontend**: Next.js `14.2` (Turbopack App Router), React `18`, TypeScript `5`, Lucide Icons, Axios.
- **Backend**: FastAPI `0.110.0`, Uvicorn `0.28.0`, Pydantic V2 `2.6.4`, Passlib Bcrypt, PyJWT.
- **Database**: PostgreSQL `16` (with `pgvector`) or SQLite `3` (for local development).
- **AI & RAG**: Google Gemini 1.5 Flash REST API, TF-IDF Cosine Vector Search Engine.

---

## 📋 Prerequisites

Before cloning and setting up ShikshaAI, ensure your local machine has the following tools installed:

| Tool | Required Version | Verification Command | Download Link |
| :--- | :--- | :--- | :--- |
| **Git** | `v2.30+` | `git --version` | [git-scm.com](https://git-scm.com) |
| **Node.js** | `v20.11.0` (LTS) | `node -v` | [nodejs.org](https://nodejs.org) |
| **npm** | `v10.0+` | `npm -v` | Included with Node.js |
| **Python** | `v3.11.0+` | `python --version` | [python.org](https://www.python.org) |
| **Docker Desktop** | `v4.20+` | `docker --version` | [docker.com](https://www.docker.com) |

---

## ⚡ Quickstart (One-Command Automated Setup)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sugandh147/Shiksha-AI.git
   cd Shiksha-AI
   ```

2. **Run Automated Setup**:
   - **Windows (PowerShell)**:
     ```powershell
     .\scripts\setup.ps1
     ```
   - **macOS / Linux (Bash)**:
     ```bash
     chmod +x scripts/*.sh
     ./scripts/setup.sh
     ```

3. **Start Development Servers**:
   - **Windows (PowerShell)**:
     ```powershell
     .\scripts\start.ps1
     ```
   - **macOS / Linux (Bash)**:
     ```bash
     ./scripts/start.sh
     ```

4. **Open Application**:
   - Frontend UI: `http://localhost:3000`
   - Backend API Documentation: `http://localhost:8000/docs`

---

## 🛠️ Manual Step-by-Step Installation Guide

If you prefer installing dependencies manually, follow these steps:

### Step 1: Environment Variables Setup
Copy the template environment file to `.env`:
```bash
cp .env.example .env
```
*(Optional: Open `.env` and add your free `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com)).*

### Step 2: Infrastructure Database (PostgreSQL)
Start PostgreSQL container using Docker Compose:
```bash
docker compose up -d db
```
*Verify DB container health:*
```bash
docker compose ps
```

### Step 3: Backend Setup (Python Virtualenv)
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Run Database Migrations & Knowledge Ingestion
From the project root:
```bash
# Ingest NCERT knowledge base RAG chunks & educational question bank:
python scripts/ingest_knowledge.py
```
*(This sets up a clean database with **0 Users, 0 Classes, 0 Attempts**, ready for live registration).*

### Step 5: Frontend Setup (Next.js)
```bash
cd frontend
npm install
```

### Step 6: Start Applications
- **Backend**: `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` (from `backend/`)
- **Frontend**: `npm run dev` (from `frontend/`)

---

## 📚 RAG Knowledge Base Ingestion

The Retrieval-Augmented Generation (RAG) engine vector-searches official NCERT textbook knowledge base chunks stored in the `document_chunks` table.

To re-ingest NCERT textbook chapters at any time, run:
```bash
python scripts/ingest_knowledge.py
```
This parses textbooks, tokenizes text, calculates TF-IDF vector terms, and indexes chunks without adding fake user data.

---

## 🧪 Testing & Verification Suite

Run automated test suites to verify 100% functionality:

```bash
# 1. Run 17-Step Real User Flow Test:
python backend/test_real_user_flow.py

# 2. Run Comprehensive Acceptance Test Suite:
python backend/test_final_acceptance_suite.py

# 3. Run Security & RBAC Isolation Audit:
python backend/test_security_audit.py

# 4. Run Frontend TypeScript Typecheck & Production Build:
cd frontend
npx tsc --noEmit
npm run build
```

---

## 🔧 Troubleshooting Guide

| Issue / Error | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Docker not running`** | Docker Desktop is stopped. | Start Docker Desktop application and wait for the daemon status to turn green. |
| **`Port 5432 or 8000 in use`** | Another service occupies port 5432 or 8000. | Change `POSTGRES_PORT=5433` in `.env` or kill occupying process: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess`. |
| **`Database connection failed`** | `DATABASE_URL` incorrect or container starting. | Ensure `DATABASE_URL` in `.env` matches container credentials or use default SQLite `sqlite:///./shikshaai.db`. |
| **`AI Provider API Key missing`** | `GEMINI_API_KEY` unconfigured. | Get a free API key at [Google AI Studio](https://aistudio.google.com) and paste into `.env`. System will fall back to local NCERT templates if unconfigured. |
| **`CORS Policy Error`** | Frontend origin blocked by API. | Add your frontend URL (e.g. `http://localhost:3000`) to `CORS_ORIGINS` in `.env`. |
| **`ModuleNotFoundError in Python`** | Virtual environment not activated. | Run `source backend/venv/bin/activate` or use `backend\venv\Scripts\python.exe`. |

---

## 📜 License
Licensed under the [MIT License](LICENSE).
