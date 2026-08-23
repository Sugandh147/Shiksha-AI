# ShikshaAI — Step-by-Step Clean Machine Setup Manual

This document provides a **complete, zero-assumption setup guide** for a developer installing **ShikshaAI** on a completely fresh machine for the first time.

---

## 📌 STEP 1: Verify Installed Prerequisites

Before downloading the code, ensure the following required software tools are installed on your system:

### 1. Git (`v2.30+`)
- **Check**: Open terminal/Command Prompt and run:
  ```bash
  git --version
  ```
- **If missing**: Download from [git-scm.com](https://git-scm.com).

### 2. Node.js (`v20.11.0` LTS)
- **Check**: Run:
  ```bash
  node -v
  ```
- **If missing**: Download LTS installer from [nodejs.org](https://nodejs.org).

### 3. Python (`v3.11.0+`)
- **Check**: Run:
  ```bash
  python --version
  ```
- **If missing**: Download Python 3.11+ installer from [python.org](https://www.python.org). Ensure you check **"Add Python to PATH"** during installation on Windows.

### 4. Docker Desktop (`v4.20+`)
- **Check**: Run:
  ```bash
  docker --version
  ```
- **If missing**: Download from [docker.com](https://www.docker.com). Start Docker Desktop and ensure the container daemon is running.

---

## 📌 STEP 2: Clone the Repository

Open your terminal or PowerShell and run:
```bash
git clone https://github.com/Sugandh147/Shiksha-AI.git
cd Shiksha-AI
```

---

## 📌 STEP 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in any text editor.
3. Obtain a free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com).
4. Update the line:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualApiKeyHere
   ```
5. Save the file.

---

## 📌 STEP 4: Start Infrastructure (PostgreSQL Database)

Start the PostgreSQL container using Docker Compose:
```bash
docker compose up -d db
```
Wait 5 seconds for the database container status to become healthy:
```bash
docker compose ps
```

*(Note: If you do not have Docker installed, the application will automatically default to local SQLite `shikshaai.db` database).*

---

## 📌 STEP 5: Set Up Backend (Python FastAPI)

1. Navigate to `backend/` directory:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate virtual environment:
   - **Windows (PowerShell)**: `.\venv\Scripts\activate`
   - **macOS / Linux**: `source venv/bin/activate`
4. Install backend dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
5. Return to root directory:
   ```bash
   cd ..
   ```

---

## 📌 STEP 6: Set Up Frontend (Next.js)

1. Navigate to `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Return to root directory:
   ```bash
   cd ..
   ```

---

## 📌 STEP 7: Ingest RAG Knowledge Base & Prepare Clean DB

Initialize the database schema and ingest NCERT textbook RAG data:
```bash
python scripts/ingest_knowledge.py
```
*(This creates all 17 database tables, populates NCERT textbook chunks, and leaves **0 user records**).*

---

## 📌 STEP 8: Start Application Servers

### Option A: Using One-Command Start Script
- **Windows**: `.\scripts\start.ps1`
- **macOS / Linux**: `./scripts/start.sh`

### Option B: Starting Manually in Separate Terminal Tabs
- **Terminal 1 (Backend)**:
  ```bash
  cd backend
  # Activate venv first!
  uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  cd frontend
  npm run dev
  ```

---

## 📌 STEP 9: Open Application & Create Your First Real Account

1. Open your browser to `http://localhost:3000`.
2. Click **Register** -> Create your own Student or Teacher account.
3. Complete onboarding & diagnostic assessment.
4. Enjoy your fully functional, real-user grounded ShikshaAI platform! 🚀
