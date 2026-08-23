# ShikshaAI — Live Hackathon Demonstration Guide (Real User Accounts)

This guide walks you through conducting a **live, 3 to 5-minute hackathon demonstration** of **ShikshaAI** using **real user accounts created live by you** during the presentation.

> [!IMPORTANT]
> **Zero Fake / Fictional User Accounts**:
> The application starts with an empty user database (**0 Users, 0 Classes, 0 Attempts**). You will register your own teacher and student accounts live through the standard registration UI.

---

## 🛠️ Step 0: Prerequisite Setup & Database Reset

Before your presentation, ensure your database is clean and ready for real registration:

1. **Reset Database to 0 Users (Leaves Educational Content Intact)**:
   ```powershell
   python backend/reset_and_seed_content.py
   ```
2. **Start Backend Server**:
   ```powershell
   cd backend
   uvicorn app.main:app --reload
   ```
3. **Start Frontend Web Application**:
   ```powershell
   cd frontend
   npm run dev
   ```
4. **Open Browser**: Navigate to `http://localhost:3000`.

---

## ⏱️ 3 to 5-Minute Live Demonstration Narrative

```
[0:00 - 0:45] ACT I   : Teacher Registration, Class Creation & Join Code Generation
[0:45 - 2:00] ACT II  : Student Registration, Onboarding & Diagnostic Quiz
[2:00 - 3:00] ACT III : Grounded RAG AI Tutor & Real-Time Adaptive Practice
[3:00 - 4:15] ACT IV  : Class Join & Live ClassPulse Teacher Intelligence
[4:15 - 5:00] ACT V   : Opportunity Matcher & Presentation Wrap-Up
```

---

### ACT I: Teacher Registration, Class Creation & Join Code (0:00 – 0:45)

1. Open `http://localhost:3000` in your main browser window.
2. Click **Register** → Enter your name, email, password, and select **Role: Teacher**.
3. Click **Sign Up** → Log in with your new teacher account.
4. On the **Teacher Dashboard (`/teacher`)**, point out the initial clean empty state:
   - *"No classes or students registered yet."*
5. Click the **`+ Create Class`** button in the navbar:
   - **Class Name**: Enter `Grade 8 Mathematics`
   - **Grade Level**: Enter `8`
   - Click **Create Class**.
6. Note the **6-Character Class Join Code** displayed in the notification (e.g. `MATH8A`).
7. **Talking Point**: *"Teachers can create classes in seconds and distribute a simple 6-character join code to their students."*

---

### ACT II: Student Registration, Onboarding & Diagnostic Quiz (0:45 – 2:00)

1. Open an **Incognito / Private Window** (or second browser) to `http://localhost:3000`.
2. Click **Register** → Enter your student name, email, password, and select **Role: Student**.
3. Click **Sign Up** → Log in with your new student account.
4. **Student Onboarding (`/onboarding`)**:
   - Select **Grade 8**, **Mathematics**, and preferred language (**Hinglish** or **English**).
   - Enter your learning goal → Click **Complete Profile**.
5. **Take Diagnostic Quiz (`/diagnostic`)**:
   - Answer the diagnostic questions.
   - Click **Submit Diagnostic Quiz**.
6. **Student Dashboard (`/dashboard`)**:
   - Point out your actual calculated diagnostic score and identified **Weak Topic** (e.g., *Algebra* at <70% mastery).
7. **Talking Point**: *"ShikshaAI automatically assesses a student's baseline knowledge and pinpoints their exact topic-level weaknesses in real time."*

---

### ACT III: Grounded RAG AI Tutor & Real-Time Adaptive Practice (2:00 – 3:00)

1. **Ask AI Tutor (`/tutor`)**:
   - Click **Ask AI Tutor** on your weak topic card.
   - Select **Hinglish (`hi-en`)** or **English**.
   - Type: *"Explain linear equations step by step with a real life example."*
   - Click **Send**.
   - Point out the **NCERT Source Cards** attached below the response:
     - *NCERT Mathematics Class 8 — Chapter 2: Linear Equations in One Variable*
2. **Talking Point**: *"Unlike generic LLMs that hallucinate math formulas, ShikshaAI grounds every response in official NCERT textbooks with explicit verifiable citations."*
3. **Adaptive Practice (`/practice`)**:
   - Click **Practice Weak Topic** → Answer a practice question.
   - Submit answer → See **+15 XP** awarded.
   - Return to **Dashboard (`/dashboard`)** → Point out your topic mastery score and total XP live updating in PostgreSQL.

---

### ACT IV: Class Join & Live ClassPulse Teacher Intelligence (3:00 – 4:15)

1. On the Student Dashboard (`/dashboard`), click the **`+ Join Class`** button in the header.
2. Enter the **6-character Join Code** generated in Act I (e.g., `MATH8A`) → Click **Join Class**.
3. **Switch to Teacher Browser Tab**:
   - Refresh or select your class in the dropdown on `/teacher`.
4. Point out **ClassPulse Live Analytics**:
   - **Total Students**: Updated from `0 → 1`
   - **Learning Attention Indicator**: Shows your student account with an objective risk rating based on live diagnostic performance.
5. **Teacher Copilot Q&A**:
   - Open Teacher Copilot → Type: *"Which students in my class need urgent help with algebra?"*
   - Click **Ask Copilot**.
   - Show Teacher Copilot analyzing live database metrics to recommend targeted 1-on-1 teaching interventions.

---

### ACT V: Opportunity Matcher & Wrap-Up (4:15 – 5:00)

1. On the Student Window, click **Opportunities (`/opportunities`)**.
2. Show personalized STEM scholarships matched to your student's grade and mastery profile (e.g. *KVPY STEM Fellowship*, *NTSE*).
3. **Closing Pitch**: *"ShikshaAI delivers closed-loop personalized tutoring grounded in official NCERT textbooks while giving teachers real-time diagnostic superpowers."*

---

## 🛡️ Robustness & Graceful Fallbacks

> [!TIP]
> If external LLM API rate limits occur during live presentation:
> 1. **RAG Engine Fallback**: If Gemini times out, `RAGEngine` automatically retrieves grounded NCERT textbook snippets directly from SQLite database records without crashing.
> 2. **Authentication Isolation**: Using Incognito windows for the student account prevents session cookie overlap between student and teacher roles.
