# ShikshaAI — 3 to 5 Minute Live Hackathon Demonstration Script

**Presentation Target**: 3 – 5 Minutes  
**Key Value Proposition**: AI-powered personalized EdTech platform designed for Indian K-12 education, combining Grounded RAG Tutoring, Adaptive Practice, and ClassPulse Teacher Intelligence.

---

## 🔑 Demo Login Credentials

> **STUDENT DEMO PERSONA**
> - **Email**: `arjun.mehta@student.in`
> - **Password**: `student123`
> - **Grade**: Class 8
> - **Target Weak Topic**: *Algebra — Linear & Quadratic Equations* (38.6% Mastery)

> **TEACHER DEMO PERSONA**
> - **Email**: `priya.sharma@shikshaai.in`
> - **Password**: `teacher123`
> - **Class Name**: Class 8 - Section A (10 Enrolled Students)

---

## ⏱️ 3–5 Minute Presentation Narrative Flow

```
[0:00 - 0:45] ACT I   : The Student Problem & Diagnostic Discovery
[0:45 - 2:00] ACT II  : Grounded RAG AI Tutor & Multilingual Explanation
[2:00 - 3:00] ACT III : Adaptive Practice & Real-Time SkillMastery Gain
[3:00 - 4:15] ACT IV  : ClassPulse Teacher Intelligence & AI Copilot
[4:15 - 5:00] ACT V   : Opportunity Matcher & Hackathon Wrap-Up
```

---

### ACT I: The Student Problem & Diagnostic Discovery (0:00 – 0:45)

1. **Open Browser** to `http://localhost:3000`.
2. **Talking Point**: *"India has over 250 million students, but most lack access to 1-on-1 personalized tutoring. ShikshaAI bridges this gap."*
3. **Click `Login`** in header → Enter `arjun.mehta@student.in` / `student123` → Click **Login**.
4. **Student Dashboard loads**: Point out:
   - **Streak Counter**: `7 Days 🔥`
   - **XP Points**: `450 XP ⚡`
   - **Weak Topic Banner**: *"Attention: Algebra (38.6% Mastery)"* highlighted in red.
5. **Talking Point**: *"ShikshaAI doesn't just ask students to practice randomly. Our diagnostic engine automatically identifies Arjun's single weakest topic: Algebra."*

---

### ACT II: Grounded RAG AI Tutor & Multilingual Learning (0:45 – 2:00)

1. **Click `Ask AI Tutor`** button on the Algebra weak topic card (navigates to `/tutor`).
2. **Select Language**: Click language dropdown in header/chat → Select **Hinglish (`hi-en`)**.
3. **Type Question**:
   > *"Explain linear equations step by step with a real life example."*
4. **Click Send**:
   - Point out **Grounded NCERT Textbook Citations** rendered below response:
     - *NCERT Mathematics Class 8 — Chapter 2: Linear Equations in One Variable*
     - *NCERT Mathematics Class 10 — Chapter 4: Quadratic Equations*
5. **Talking Point**: *"Unlike generic chatbots that hallucinate math answers, ShikshaAI uses Retrieval-Augmented Generation (RAG) over trusted NCERT textbooks. Every answer is strictly grounded with verifiable source citations, and presented in the student's comfortable language."*
6. **Show 📷 Vision AI Solver (Optional 15-sec demo)**:
   - Click **Scan Question Photo** icon → Select sample equation photo (`test_math.jpg`) → Instant step-by-step extraction!

---

### ACT III: Adaptive Practice & SkillMastery Gain (2:00 – 3:00)

1. **Click `Practice Weak Topic`** button directly from Tutor view or navigation bar (`/practice`).
2. **Adaptive Practice Set generated**: Point out initial difficulty: `Medium`.
3. **Answer Question 1 Correctly**: Select correct choice `A` → Click **Submit Answer**.
   - Point out: **+15 XP Awarded** green toast notification!
   - Point out: Difficulty automatically escalates to `Hard` for the next question.
4. **Answer Question 2 Incorrectly (Intentionally)**: Select wrong choice `B` → Click **Submit Answer**.
   - Point out: **Step-by-Step Remediation Modal** triggers explaining why choice B was incorrect and showing the correct formula.
5. **Return to Dashboard (`/dashboard`)**:
   - Point out: Arjun's Algebra mastery score live updated from **38.6% → 52.4%**!

---

### ACT IV: ClassPulse Teacher Intelligence & AI Copilot (3:00 – 4:15)

1. **Click `Logout`** → Click **Login** → Enter `priya.sharma@shikshaai.in` / `teacher123`.
2. **Teacher Dashboard (`/teacher`) loads**:
   - Point out **ClassPulse Analytics**: Class average mastery = `62.8%`.
   - Point out **Learning Attention Indicator**: 3 students flagged needing attention.
   - Point out **Arjun Mehta** flagged with **High Risk** due to low initial algebra score.
3. **Click Arjun Mehta's profile**: View deep insights, recent quiz attempts, and recommended 1-on-1 intervention notes.
4. **Open Teacher Copilot**:
   - Type prompt:
     > *"Which students in Class 8 need urgent help with algebra?"*
   - Response instantly details Arjun Mehta and 2 other struggling students with actionable teaching recommendations!
5. **Talking Point**: *"ClassPulse gives teachers superpower visibility. Instead of grading endless papers, teachers get real-time diagnostic risk flags and AI-powered copilot recommendations."*

---

### ACT V: Opportunity Matcher & Hackathon Wrap-Up (4:15 – 5:00)

1. **Click `Opportunities`** in navigation bar (`/opportunities`).
2. **Show Opportunity Matcher**:
   - Point out personalized scholarship matches: *KVPY STEM Fellowship*, *PM Young Achievers Scholarship*, *National Talent Search Examination (NTSE)*.
   - Match Score breakdown based on grade, subjects, and mastery.
3. **Closing Statement**: *"ShikshaAI is not just a tool—it's a complete intelligent learning environment empowering 250 million Indian students and teachers."*

---

## 🛡️ Backup Demo Path (If External APIs or Internet Fails)

> [!TIP]
> If external LLM APIs experience rate limits or connectivity dropouts during live presentation, ShikshaAI has built-in offline fallbacks:

1. **AI Tutor Fallback**: If Gemini API call fails, RAG engine automatically activates local grounded pedagogical template logic, returning pre-tokenized NCERT solutions with zero downtime.
2. **Vision AI Fallback**: If OCR vision API times out, `VisionEngine` fallback uses deterministic equation parsing to render problem steps instantly.
3. **Deterministic Seed Verification**: You can reset the database to clean demo state at any time by executing:
   ```powershell
   $env:PYTHONIOENCODING="utf-8"; python backend/seed_data.py
   ```
