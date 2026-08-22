# ShikshaAI 🎓
### AI for Equitable Education Access

> Built for the AI Hackathon 2026 — A personalized, multi-lingual AI tutoring platform for Indian students.

---

## 🚀 What is ShikshaAI?

ShikshaAI bridges India's education gap by delivering:
- **Socratic AI Tutoring** grounded in NCERT textbooks (Hindi & English)
- **Adaptive Practice** that adjusts difficulty in real time
- **Diagnostic Assessments** to personalize the starting level
- **Teacher Dashboards** with class-wide mastery heatmaps
- **AI Teacher Copilot** that generates lesson plans & worksheets instantly

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python 3.14) |
| Database | PostgreSQL + pgvector (SQLite for local dev) |
| ORM | SQLAlchemy 2.0 + Alembic |
| AI | Google Gemini 1.5/2.0 Flash |
| Auth | JWT (python-jose + bcrypt) |

---

## 📁 Project Structure

```
Shiksha-AI/
├── backend/               # FastAPI Python backend
│   ├── app/
│   │   ├── main.py        # Entry point, CORS, routers
│   │   ├── config.py      # Settings from .env
│   │   ├── db/
│   │   │   ├── database.py  # SQLAlchemy engine & session
│   │   │   └── models.py    # All 16 ORM models
│   │   ├── routers/
│   │   │   └── health.py    # Health-check endpoints
│   │   └── schemas/
│   │       └── common.py    # Pydantic response schemas
│   ├── alembic/           # Database migrations
│   ├── seed_data.py       # Demo data (1 teacher, 10 students)
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/              # Next.js frontend
    ├── src/
    │   ├── app/           # App Router pages
    │   │   ├── page.tsx          # Landing page
    │   │   ├── (auth)/login/     # Login page
    │   │   ├── (auth)/register/  # Register page
    │   │   └── dashboard/        # Student dashboard
    │   ├── context/
    │   │   └── AuthContext.tsx   # Global auth state
    │   ├── lib/
    │   │   ├── api.ts            # Axios API client
    │   │   └── utils.ts          # Utility functions
    │   └── types/
    │       └── index.ts          # TypeScript types
    └── .env.local.example
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+ 
- Node.js 18+
- PostgreSQL 14+ (or SQLite for local dev)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate       # Windows
# source venv/bin/activate    # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL and SECRET_KEY

# Run migrations
alembic upgrade head

# Seed demo data
python seed_data.py

# Start server
uvicorn app.main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🧑‍💻 Demo Accounts (after seeding)

| Role | Email | Password |
|:---|:---|:---|
| Teacher | priya.sharma@shikshaai.in | teacher123 |
| Student | arjun.mehta@student.in | student123 |
| Student | sneha.iyer@student.in | student123 |

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/v1/health` | API health check |
| `GET` | `/api/v1/health/db` | Database connectivity check |
| `GET` | `/api/v1/health/ping` | Simple liveness probe |

*(More endpoints coming in Phase 2 — Auth, Tutor, Practice, Analytics)*

---

## 🗺️ Development Roadmap

- [x] **Phase 1**: Foundation — Backend, Frontend, DB schema, Migrations, Seed data
- [ ] **Phase 2**: Auth system — Login, Register, JWT, Role guards  
- [ ] **Phase 3**: Diagnostic Quiz + RAG-powered AI Tutor
- [ ] **Phase 4**: Adaptive Practice Engine
- [ ] **Phase 5**: Student Analytics + Teacher Dashboard + Copilot

---

## 🏗️ Database Models

16 models covering the full learning lifecycle:

`User` · `StudentProfile` · `TeacherProfile` · `Class` · `ClassMember` · `Subject` · `Topic` · `Question` · `DiagnosticAttempt` · `QuizAttempt` · `SkillMastery` · `LearningEvent` · `ChatSession` · `ChatMessage` · `Document` · `DocumentChunk`

---

## 📜 License

MIT License — Built with ❤️ for the AI Hackathon 2026
