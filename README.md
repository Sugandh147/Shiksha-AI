# ShikshaAI 🎓

> **Intelligent Multilingual AI Learning Ecosystem for Indian K-12 Education**

ShikshaAI is a full-stack AI education platform combining grounded NCERT RAG tutoring, vision question solving, adaptive practice, and real-time teacher intelligence — supporting English, Hindi, and Hinglish.

---

## ⚡ Quick Start (Clone → Run in 2 Steps)

### Prerequisites

You only need **two tools** installed globally:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18 LTS+ | [nodejs.org](https://nodejs.org/) |

> No Docker required. No PostgreSQL required. Uses SQLite out of the box.

---

### Step 1 — Setup (run once after cloning)

**Windows (PowerShell):**
```powershell
git clone https://github.com/Sugandh147/Shiksha-AI.git
cd Shiksha-AI
.\scripts\setup.ps1
```

**macOS / Linux:**
```bash
git clone https://github.com/Sugandh147/Shiksha-AI.git
cd Shiksha-AI
bash scripts/setup.sh
```

The setup script will automatically:
- ✅ Check Python and Node.js versions
- ✅ Create all required `.env` files (backend + frontend)
- ✅ Create the Python virtual environment (`backend/venv`)
- ✅ Install all Python packages (`requirements.txt`)
- ✅ Install all Node.js packages (`npm install`)
- ✅ Initialize the SQLite database and seed content
- ✅ Ingest the NCERT knowledge base for AI Tutor

---

### Step 2 — Start

**Windows (PowerShell):**
```powershell
.\scripts\start.ps1
```

**macOS / Linux:**
```bash
bash scripts/start.sh
```

Then open **http://localhost:3000** in your browser. Register an account and start learning.

---

## 🔑 Optional: Enable AI Features (Free Gemini API Key)

The AI Tutor, Vision Solver, and Teacher Copilot require a **Google Gemini API key**.

1. Get a **free** key at [aistudio.google.com](https://aistudio.google.com)
2. Open `backend/.env`
3. Replace `GEMINI_API_KEY=placeholder` with your key

> Without a key, the AI Tutor gracefully falls back to local NCERT template responses.

---

## 🗂️ Project Structure

```
Shiksha-AI/
├── scripts/
│   ├── setup.ps1       ← Windows one-command setup
│   ├── setup.sh        ← macOS/Linux one-command setup
│   ├── start.ps1       ← Windows start both servers
│   ├── start.sh        ← macOS/Linux start both servers
│   └── ingest_knowledge.py
├── backend/
│   ├── app/
│   │   ├── routers/    ← Auth, Student, Teacher, Tutor, Practice, Opportunities
│   │   ├── core/       ← RAG engine, Vision engine, Security
│   │   ├── db/         ← SQLAlchemy models & session
│   │   └── schemas/    ← Pydantic request/response schemas
│   ├── .env.example    ← Backend env template
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/        ← Next.js pages (dashboard, tutor, teacher, etc.)
│   │   ├── components/ ← Reusable UI components
│   │   ├── context/    ← AuthContext, ToastContext
│   │   └── lib/        ← Axios API client
│   └── .env.example    ← Frontend env template
├── .env.example        ← Root env template
└── .gitignore
```

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Vanilla CSS |
| **Backend** | FastAPI 0.110, Python 3.11, SQLAlchemy ORM |
| **Database** | SQLite (default) / PostgreSQL (optional via Docker) |
| **AI** | Google Gemini 1.5 Flash, TF-IDF NCERT RAG, Vision OCR |
| **Auth** | JWT (HS256), bcrypt password hashing |

---

## ✨ Features

- **Real User Registration & Auth** — Student and Teacher accounts with JWT
- **Student Onboarding** — Grade, subjects, goals, language preference
- **Diagnostic Quiz** — Baseline assessment to pinpoint topic weaknesses
- **NCERT RAG AI Tutor** — Step-by-step explanations with textbook citations in English, Hindi, or Hinglish
- **📷 Vision Question Solver** — Photograph any question; AI extracts and solves it
- **Adaptive Practice** — Dynamic difficulty based on consecutive streaks
- **SkillMastery Engine** — Weighted recency formula tracks real mastery scores
- **ClassPulse Teacher Dashboard** — Live class heatmaps, risk flags, attention indicators
- **AI Teacher Copilot** — Natural language queries answered with real class data
- **Opportunity Matcher** — Matches students to NMMS, INSPIRE, YASASVI scholarships

---

## 🛡️ Security

- Salted bcrypt password hashing via `passlib`
- Signed HS256 JWT access tokens (24-hour expiry)
- Role-Based Access Control (`require_student`, `require_teacher` FastAPI dependencies)
- Student data filtered strictly by `current_user.id`
- Teacher access gated to enrolled class students only

---

## 🧪 Testing

```bash
# Run from project root after setup
backend/venv/Scripts/python.exe backend/test_real_user_flow.py          # Windows
backend/venv/bin/python         backend/test_real_user_flow.py          # macOS/Linux

backend/venv/Scripts/python.exe backend/test_final_acceptance_suite.py  # Windows
backend/venv/bin/python         backend/test_final_acceptance_suite.py  # macOS/Linux
```

---

## 🐳 Optional: PostgreSQL via Docker

For production-grade testing with PostgreSQL instead of SQLite:

```bash
docker compose up -d db
```

Then edit `backend/.env`:
```
DATABASE_URL=postgresql://shiksha_user:shiksha_password@localhost:5432/shikshaai
```

---

## 🌐 API Documentation

After starting the backend, visit **http://localhost:8000/docs** for the full interactive Swagger API reference.

---

## 📄 Environment Variables Reference

| Variable | File | Description | Default |
|----------|------|-------------|---------|
| `DATABASE_URL` | `backend/.env` | Database connection string | `sqlite:///./shikshaai.db` |
| `SECRET_KEY` | `backend/.env` | JWT signing secret | Auto-generated by setup |
| `GEMINI_API_KEY` | `backend/.env` | Google Gemini API key | `placeholder` |
| `ALLOWED_ORIGINS` | `backend/.env` | CORS allowed origins | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | Frontend API base URL | `http://localhost:8000/api/v1` |

---

## ❓ Troubleshooting

**Port already in use?**
```bash
# Kill whatever is on port 8000 or 3000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
# macOS/Linux:
lsof -ti:8000 | xargs kill
```

**Python not found?**
- Ensure Python is added to PATH during installation
- Windows: re-run the Python installer and check "Add Python to PATH"

**npm not found?**
- Install Node.js from [nodejs.org](https://nodejs.org/) — npm is included

**AI Tutor says "service unavailable"?**
- Add your Gemini API key to `backend/.env` (see [Enable AI Features](#-optional-enable-ai-features-free-gemini-api-key))
