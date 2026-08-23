# ShikshaAI

## AI-Powered Equitable Learning Platform

ShikshaAI is an intelligent, grounded learning platform designed for Indian K-12 education that personalizes learning by combining AI tutoring, Retrieval-Augmented Generation (RAG) textbook explanations, baseline diagnostic assessments, adaptive practice sets, real-time student mastery tracking, multilingual instruction, teacher intelligence dashboards, and AI Teacher Copilot analytics. The application operates using **100% REAL USER ACCOUNTS and REAL LEARNING DATA**, allowing students and teachers to generate authentic database records without hardcoded analytics or fake personas.

---

## PROBLEM

Across India's K-12 education system, over 250 million students face severe access and equity challenges. Overcrowded classrooms leave teachers unable to deliver individualized 1-on-1 support, causing students with foundational math and science gaps to fall silently behind. Existing digital tools often rely on static video lectures or generic AI chatbots that hallucinate mathematical formulas, lack curriculum alignment, and provide zero textbook citations or regional language support.

---

## SOLUTION

ShikshaAI solves this through a **Closed-Loop Grounded Learning Cycle**:

```
Assess (Diagnostic Quiz)
  ↓
Identify (Weak Topic Analysis)
  ↓
Teach (NCERT Grounded RAG AI Tutor)
  ↓
Practice (Adaptive Dynamic Difficulty)
  ↓
Measure (SkillMastery Weighted Recency Calculation)
  ↓
Adapt (Dynamic Question Escalation / Remediation)
  ↓
Teacher Intervention (ClassPulse Risk Flags & AI Copilot)
```

---

## KEY FEATURES

- **Real User Registration & Profiles**: Authentic registration for students and teachers with persistent database storage in PostgreSQL/SQLite.
- **Student Onboarding**: Collects grade level, preferred subjects, target goals, and preferred learning language.
- **Baseline Diagnostic Assessment**: Automatically evaluates subject readiness and pinpoints exact topic-level weaknesses (<70% mastery threshold).
- **NCERT Grounded RAG AI Tutor**: Answers student questions step-by-step in English, Hindi, or Hinglish with explicit textbook chapter source citations.
- **📷 Vision AI Photo Question Solver**: Extracts LaTeX formulas from uploaded question photos using Google Gemini 1.5 Vision and generates step-by-step solutions.
- **Real-Time Adaptive Practice**: Dynamic practice sets that adjust question difficulty (Easy → Medium → Hard) based on consecutive correct streaks or wrong answers.
- **SkillMastery Engine**: Recalculates topic mastery after every attempt using a weighted recency formula ($Mastery_{new} = 0.75 \cdot Mastery_{old} + 0.25 \cdot Score_{current}$).
- **Multilingual Instruction**: Supports English, Devanagari Hindi (`hi`), and Hinglish (`hi-en`) for accessible learning across diverse linguistic backgrounds.
- **ClassPulse Teacher Dashboard**: Gives teachers real-time visibility into class average mastery, quiz accuracy, and transparent Learning Attention Indicator risk scores.
- **Class Join System**: Teachers create classes and generate unique 6-character join codes (e.g. `MATH8A`) for student enrollment.
- **AI Teacher Copilot**: Translates natural language teacher queries into live database metrics and provides evidence-based pedagogical recommendations.
- **STEM Opportunity Matcher**: Matches qualified students to verified national scholarships (e.g. KVPY, NTSE) based on grade and mastery scores.

---

## HOW IT WORKS

### Student Flow
1. **Register & Log In**: Student creates a new account and selects preferred language.
2. **Onboarding**: Selects grade (e.g. Class 8) and learning goals.
3. **Diagnostic Quiz**: Answers baseline questions; system stores attempts in PostgreSQL and identifies weak topics.
4. **AI Tutor**: Student asks for concept explanations; RAG engine vector-searches official NCERT textbook chunks and streams grounded answers with citations.
5. **Adaptive Practice**: Student completes questions; correct answers award XP and escalate difficulty, while wrong answers trigger concept remediation.
6. **Mastery Update**: SkillMastery and dashboard statistics update dynamically.

### Teacher Flow
1. **Register & Log In**: Teacher creates account and accesses ClassPulse dashboard.
2. **Create Class**: Teacher creates a class and receives an invite code.
3. **Student Join**: Students enter the join code to enroll in the class.
4. **Analytics & Copilot**: Teacher views live class roster, attention risk indicators, and asks Teacher Copilot for targeted intervention strategies.

---

## AI / RAG ARCHITECTURE

```
Student Question / Query
  ↓
Text Preprocessing & Tokenization
  ↓
TF-IDF Term Frequency Cosine Similarity Search
  ↓
Top Relevant NCERT Textbook Chunks Retrieved (top_k=3)
  ↓
System Prompt Assembly (Curriculum Rules + Source Context + Language Rule)
  ↓
Google Gemini 1.5 Flash LLM Processing
  ↓
Grounded Response + Verifiable NCERT Source Citations
```

### Why RAG is Essential
Public LLMs frequently hallucinate math steps and use non-standard methods. ShikshaAI's RAG architecture forces the LLM to pull facts strictly from official NCERT textbook knowledge bases, eliminating hallucinations and ensuring 100% curriculum alignment.

---

## TECH STACK

| Technology | Purpose |
| :--- | :--- |
| **Next.js 14 (App Router)** | High-performance React frontend framework with Turbopack |
| **TypeScript** | Type-safe development across frontend and backend schemas |
| **Vanilla CSS & Glassmorphism** | Modern, responsive visual design system |
| **FastAPI (v0.110.0)** | Asynchronous, high-throughput Python API gateway |
| **SQLAlchemy ORM** | Relational ORM mapping 17 database tables |
| **PostgreSQL 16 / SQLite** | Relational database storage with foreign key indexing |
| **pgvector** | PostgreSQL vector similarity extension |
| **Google Gemini 1.5 Flash** | Multilingual LLM for grounded tutoring & Teacher Copilot |
| **Docker Compose** | Reproducible multi-container infrastructure orchestration |

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14 App Router)                    │
│  React Components • Glassmorphism UI • Axios authenticated requests     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP REST Requests (JWT Bearer Token)
┌────────────────────────────────────▼────────────────────────────────────┐
│                      BACKEND API (FastAPI v0.110)                       │
│  Routers: Auth • Student • Teacher • Diagnostic • Tutor • Practice      │
└────────┬───────────────────────────┬───────────────────────────┬────────┘
         │ SQLAlchemy ORM            │ Vector Search             │ Vision API
┌────────▼──────────┐       ┌────────▼──────────┐       ┌────────▼──────────┐
│ DATABASE STORAGE  │       │ GROUNDED RAG AI   │       │ VISION OCR AI     │
│ PostgreSQL/SQLite │       │ TF-IDF Cosine     │       │ Google Gemini     │
│ 17 Relational ORM │       │ NCERT Chunks      │       │ 1.5 Flash Vision  │
└───────────────────┘       └───────────────────┘       └───────────────────┘
```

---

## DATABASE SCHEMA OVERVIEW

The database architecture consists of 17 fully indexed relational ORM tables:

- `users`: Authentication credentials, roles (`student`/`teacher`), and language preferences.
- `student_profiles`: Grade level, learning style, total XP, streak days, and onboarding status.
- `teacher_profiles`: School name, subject specialization, and years of experience.
- `classes` & `class_members`: Class metadata, teacher ownership, 6-character `invite_code`, and student enrollment links.
- `subjects` & `topics`: NCERT curriculum taxonomy hierarchy.
- `questions`: Question bank with difficulty levels, options, explanations, and diagnostic flags.
- `diagnostic_attempts` & `quiz_attempts`: Attempt logs recording chosen answers, correctness, and response times.
- `skill_masteries`: Dynamic topic mastery scores, level escalation, and streak counts.
- `learning_events`: Logged events tracking XP gains and activity history.
- `chat_sessions` & `chat_messages`: Tutor chat histories.
- `documents` & `document_chunks`: NCERT textbook knowledge base chunks and metadata for RAG search.
- `opportunities`: Verified STEM scholarship listings.

---

## LOCAL DEVELOPMENT

### Prerequisites
- Node.js `v20.11.0` (LTS)
- Python `v3.11.0+`
- Docker Desktop `v4.20+`

### Setup & Run Instructions

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Sugandh147/Shiksha-AI.git
   cd Shiksha-AI
   ```

2. **Environment File**:
   ```bash
   cp .env.example .env
   ```

3. **Start PostgreSQL Database**:
   ```bash
   docker compose up -d db
   ```

4. **Install Backend Dependencies**:
   ```bash
   cd backend
   python -m venv venv
   # Windows: .\venv\Scripts\activate | macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   cd ..
   ```

5. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

6. **Initialize Database & Ingest Knowledge Base**:
   ```bash
   python scripts/ingest_knowledge.py
   ```

7. **Start Application Servers**:
   - **Windows (PowerShell)**: `.\scripts\start.ps1`
   - **macOS / Linux (Bash)**: `./scripts/start.sh`

8. **Open Application**:
   Navigate to `http://localhost:3000` and register your account.

---

## ENVIRONMENT VARIABLES

| Variable Name | Description | Default Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Relational database connection string | `sqlite:///./shikshaai.db` |
| `POSTGRES_DB` | PostgreSQL database name | `shikshaai` |
| `POSTGRES_USER` | PostgreSQL username | `shiksha_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `shiksha_password` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `JWT_SECRET` | Secret key for signing JWT access tokens | Configured in `.env` |
| `GEMINI_API_KEY` | Google Gemini 1.5 Flash API Key | Configured in `.env` |
| `CORS_ORIGINS` | Allowed frontend CORS origins | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | API base URL for frontend client | `http://localhost:8000/api/v1` |

---

## TESTING

Run the comprehensive test suite verifying 100% real user flow, RBAC security boundaries, and dynamic analytics:

```bash
# Execute Master Acceptance Test Suite:
python backend/test_final_acceptance_suite.py

# Execute Real User Flow Test:
python backend/test_real_user_flow.py

# Execute Security & Data Isolation Audit:
python backend/test_security_audit.py
```

---

## PROJECT STRUCTURE

```
Shiksha-AI/
├── .env.example               # Root environment variable template
├── .nvmrc                     # Node.js version lock file (v20.11.0)
├── .python-version            # Python version lock file (v3.11.0)
├── docker-compose.yml         # PostgreSQL + pgvector infrastructure container
├── SETUP.md                   # Clean machine setup manual
├── DEMO.md                    # Live demonstration guide
├── scripts/
│   ├── ingest_knowledge.py    # NCERT RAG knowledge ingestion script
│   ├── setup.ps1 / setup.sh   # One-command automated setup scripts
│   ├── start.ps1 / start.sh   # One-command server startup scripts
│   └── reset.ps1 / reset.sh   # Local development database reset scripts
├── backend/
│   ├── app/
│   │   ├── core/              # Security, RAG engine, Vision engine, Constants
│   │   ├── db/                # Database models & Session initialization
│   │   ├── routers/           # FastAPI routers (Auth, Student, Teacher, Tutor, etc.)
│   │   └── schemas/           # Pydantic V2 request & response schemas
│   ├── reset_and_seed_content.py
│   ├── requirements.txt
│   ├── test_real_user_flow.py
│   ├── test_final_acceptance_suite.py
│   └── test_security_audit.py
└── frontend/
    ├── src/
    │   ├── app/               # Next.js App Router pages (dashboard, tutor, teacher, etc.)
    │   ├── components/        # Reusable UI components & ProtectedRoute
    │   ├── context/           # AuthContext provider
    │   ├── lib/               # Axios API client & utility functions
    │   └── types/             # TypeScript interfaces
    ├── package.json
    └── tsconfig.json
```

---

## SECURITY

- **Authentication**: Salted password hashing via Bcrypt (`passlib`) and signed HS256 JWT access tokens.
- **Role-Based Access Control (RBAC)**: Enforced via FastAPI dependencies (`require_student`, `require_teacher`).
- **Data Isolation**: Student data endpoints filter strictly by `current_user.id`. Teachers can only access students enrolled in their assigned classes via `verify_teacher_class_access()`.
- **Input Validation**: Request bodies validated via strict Pydantic V2 schemas; file uploads capped at 5 MB with MIME type filtering (`image/jpeg`, `image/png`, `image/webp`).

---

## LIMITATIONS

- **RAG Vector Search**: Local in-database TF-IDF cosine similarity search is optimized for NCERT curriculum chapters. Scaling to millions of textbook pages will benefit from migrating to `pgvector` HNSW indexes.
- **LLM Dependency**: Live AI tutoring requires internet access for Google Gemini API calls. If disconnected, system gracefully degrades to local NCERT textbook template responses.

---

## FUTURE SCOPE

- **Offline PWA Sync**: ServiceWorker local caching for offline practice in rural low-bandwidth areas.
- **Voice Multilingual Querying**: Speech-to-text integration using OpenAI Whisper for regional voice input.
