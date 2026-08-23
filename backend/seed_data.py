"""
seed_data.py
────────────
Populates the database with realistic demo data for ShikshaAI:
  • 1 Teacher
  • 10 Students
  • 1 Class (Grade 8 - Section A)
  • 4 Subjects (Mathematics, Science, English, Social Studies)
  • 12 Topics across subjects
  • 40 Questions (easy/medium/hard, diagnostic + practice)
  • Realistic learning performance (quiz attempts, skill masteries)
  • 2 Knowledge Documents + chunks (NCERT-style)
  • Learning events for 10 days of activity

Run with:  python seed_data.py
"""

import os
import sys
import random
from datetime import datetime, timedelta, timezone

# Ensure we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from passlib.context import CryptContext  # kept for future auth router use
from sqlalchemy.orm import Session

from app.db.database import SessionLocal, engine, Base
from app.db import models
from app.db.models import (
    User, UserRole, StudentProfile, TeacherProfile,
    Class, ClassMember, Subject, Topic,
    Question, QuestionType, DifficultyLevel,
    DiagnosticAttempt, QuizAttempt, SkillMastery,
    LearningEvent, LearningEventType,
    ChatSession, ChatMessage,
    Document, DocumentChunk,
)

import bcrypt

rng = random.Random(42)  # Fixed seed for reproducible data

def hash_password(plain: str) -> str:
    """Hash a password using bcrypt directly (bypasses passlib compatibility issues)."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")



def utc_days_ago(n: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=n)


# ─────────────────────────────────────────────────────────────────────────────
# SEED FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def seed_teacher(db: Session) -> User:
    print("  ➤ Creating teacher...")
    teacher = User(
        email="priya.sharma@shikshaai.in",
        full_name="Ms. Priya Sharma",
        password_hash=hash_password("teacher123"),
        role=UserRole.teacher,
        preferred_language="en",
        is_active=True,
        is_verified=True,
    )
    db.add(teacher)
    db.flush()

    profile = TeacherProfile(
        user_id=teacher.id,
        school_name="Delhi Public School, Sector 12",
        subject_specialization="Mathematics & Science",
        years_experience=8,
    )
    db.add(profile)
    db.flush()
    print(f"    ✓ Teacher: {teacher.full_name} (ID: {teacher.id})")
    return teacher


def seed_students(db: Session) -> list[User]:
    print("  ➤ Creating 10 students...")
    student_data = [
        ("Arjun Mehta",       "arjun.mehta@student.in",    8, "visual",    "en"),
        ("Prerna Gupta",      "prerna.gupta@student.in",   8, "reading",   "hi"),
        ("Kiran Rao",         "kiran.rao@student.in",      8, "visual",    "en"),
        ("Fatima Sheikh",     "fatima.sheikh@student.in",  8, "auditory",  "hi"),
        ("Rohan Verma",       "rohan.verma@student.in",    8, "visual",    "en"),
        ("Anika Patel",       "anika.patel@student.in",    8, "reading",   "en"),
        ("Dev Bhat",          "dev.bhat@student.in",       8, "visual",    "en"),
        ("Sneha Iyer",        "sneha.iyer@student.in",     8, "auditory",  "en"),
        ("Kabir Khan",        "kabir.khan@student.in",     8, "visual",    "hi"),
        ("Meera Nair",        "meera.nair@student.in",     8, "reading",   "en"),
    ]
    students = []
    for full_name, email, grade, style, lang in student_data:
        student = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password("student123"),
            role=UserRole.student,
            preferred_language=lang,
            is_active=True,
            is_verified=True,
        )
        db.add(student)
        db.flush()

        profile = StudentProfile(
            user_id=student.id,
            grade_level=grade,
            education_level="Middle School",
            school_name="Delhi Public School, Sector 12",
            learning_style=style,
            preferred_subjects=["Mathematics", "Science"],
            learning_goal="Master core concepts and excel in exams",
            diagnostic_completed=True,
            current_streak_days=rng.randint(1, 12),
            total_xp=rng.randint(100, 1500),
            onboarding_completed=True,
        )
        db.add(profile)
        db.flush()
        students.append(student)
        print(f"    ✓ Student: {full_name} (ID: {student.id})")
    return students


def seed_class(db: Session, teacher: User, students: list[User]) -> Class:
    print("  ➤ Creating class...")
    class_ = Class(
        name="Grade 8 - Section A",
        grade_level=8,
        teacher_id=teacher.id,
        invite_code="SIKSHA8A",
        is_active=True,
    )
    db.add(class_)
    db.flush()

    for student in students:
        member = ClassMember(class_id=class_.id, student_id=student.id)
        db.add(member)

    db.flush()
    print(f"    ✓ Class: {class_.name} with {len(students)} students")
    return class_


def seed_subjects_and_topics(db: Session) -> dict:
    print("  ➤ Creating subjects and topics...")
    subjects_data = [
        {
            "name": "Mathematics",
            "description": "Numbers, algebra, geometry, and data handling for Class 8",
            "icon": "📐",
            "color": "#6366f1",
            "topics": [
                ("Algebra",               "Linear expressions, simplification, and polynomial factoring", 0),
                ("Quadratic Equations",   "Roots, factorization, discriminant, and quadratic formula",    1),
                ("Trigonometry",          "Trigonometric ratios, right triangles, and identities",        2),
                ("Geometry",              "Angles, triangles, Pythagorean theorem, and circle properties",3),
                ("Statistics",            "Mean, median, mode, data interpretation, and probability",     4),
            ],
        },
        {
            "name": "Science",
            "description": "Physics, Chemistry, Biology concepts for Class 8",
            "icon": "🔬",
            "color": "#10b981",
            "topics": [
                ("Force and Pressure",       "Effects of force and pressure in daily life",   0),
                ("Microorganisms",           "Types, uses and harmful effects of microbes",    1),
                ("Cell Structure",           "Plant and animal cell components",               2),
                ("Light",                   "Reflection and refraction of light",             3),
            ],
        },
        {
            "name": "English",
            "description": "Grammar, comprehension and writing skills",
            "icon": "📖",
            "color": "#f59e0b",
            "topics": [
                ("Tenses",                  "Present, past and future tenses",                0),
                ("Essay Writing",           "Structure and techniques for essay writing",      1),
            ],
        },
        {
            "name": "Social Studies",
            "description": "History, geography and civics for Class 8",
            "icon": "🗺️",
            "color": "#ec4899",
            "topics": [
                ("The Indian Constitution", "Fundamental rights and duties of citizens",       0),
                ("Agriculture in India",    "Types of farming and major crops",                1),
            ],
        },
    ]

    result = {"subjects": {}, "topics": {}}
    for sdata in subjects_data:
        subject = Subject(
            name=sdata["name"],
            description=sdata["description"],
            icon=sdata["icon"],
            color=sdata["color"],
        )
        db.add(subject)
        db.flush()
        result["subjects"][sdata["name"]] = subject
        print(f"    ✓ Subject: {sdata['name']}")

        for tname, tdesc, torder in sdata["topics"]:
            topic = Topic(
                subject_id=subject.id,
                name=tname,
                description=tdesc,
                grade_level=8,
                order_index=torder,
            )
            db.add(topic)
            db.flush()
            result["topics"][tname] = topic
    return result


def seed_questions(db: Session, subjects: dict, topics: dict) -> list[Question]:
    print("  ➤ Creating questions...")
    questions_data = [
        # ── Mathematics: Algebra ──────────────────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Algebra",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "Simplify the expression: 3x + 5x - 2x",
            "options": {"A": "6x", "B": "10x", "C": "6x²", "D": "8x"},
            "correct_answer": "A",
            "explanation": "Combine like terms: (3 + 5 - 2)x = 6x."
        },
        {
            "subject": "Mathematics", "topic": "Algebra",
            "difficulty": DifficultyLevel.medium, "is_diagnostic": True,
            "question_text": "If 4(2y - 3) = 20, what is the value of y?",
            "options": {"A": "3", "B": "4", "C": "5", "D": "6"},
            "correct_answer": "B",
            "explanation": "Divide both sides by 4: 2y - 3 = 5 → 2y = 8 → y = 4."
        },
        {
            "subject": "Mathematics", "topic": "Algebra",
            "difficulty": DifficultyLevel.hard, "is_diagnostic": True,
            "question_text": "Factorize completely: x² - 9y²",
            "options": {"A": "(x - 3y)²", "B": "(x + 3y)(x - 3y)", "C": "(x + 9y)(x - y)", "D": "(x - 9y)(x + y)"},
            "correct_answer": "B",
            "explanation": "Difference of squares formula: a² - b² = (a+b)(a-b). Here a=x and b=3y."
        },
        # ── Mathematics: Quadratic Equations ──────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Quadratic Equations",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "What are the roots of the quadratic equation x² - 5x + 6 = 0?",
            "options": {"A": "x = 1, 6", "B": "x = 2, 3", "C": "x = -2, -3", "D": "x = 0, 5"},
            "correct_answer": "B",
            "explanation": "Factorize: (x - 2)(x - 3) = 0 → x = 2 or x = 3."
        },
        {
            "subject": "Mathematics", "topic": "Quadratic Equations",
            "difficulty": DifficultyLevel.medium, "is_diagnostic": True,
            "question_text": "Calculate the discriminant (D = b² - 4ac) for the quadratic equation 2x² - 4x + 2 = 0.",
            "options": {"A": "0", "B": "8", "C": "16", "D": "-8"},
            "correct_answer": "A",
            "explanation": "D = (-4)² - 4(2)(2) = 16 - 16 = 0. Real and equal roots."
        },
        {
            "subject": "Mathematics", "topic": "Quadratic Equations",
            "difficulty": DifficultyLevel.hard, "is_diagnostic": True,
            "question_text": "If one root of x² + kx - 12 = 0 is 3, what is the value of k?",
            "options": {"A": "-1", "B": "1", "C": "4", "D": "-4"},
            "correct_answer": "B",
            "explanation": "Substitute x=3: 3² + 3k - 12 = 0 → 9 + 3k - 12 = 0 → 3k = 3 → k = 1."
        },
        # ── Mathematics: Trigonometry ─────────────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Trigonometry",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "In a right-angled triangle, how is sin(θ) defined?",
            "options": {"A": "Adjacent / Hypotenuse", "B": "Opposite / Hypotenuse", "C": "Opposite / Adjacent", "D": "Hypotenuse / Opposite"},
            "correct_answer": "B",
            "explanation": "Sine ratio is Opposite side over Hypotenuse (SOH)."
        },
        {
            "subject": "Mathematics", "topic": "Trigonometry",
            "difficulty": DifficultyLevel.medium, "is_diagnostic": True,
            "question_text": "What is the value of sin²(30°) + cos²(30°)?",
            "options": {"A": "0", "B": "1/2", "C": "1", "D": "√3/2"},
            "correct_answer": "C",
            "explanation": "By the Pythagorean trigonometric identity, sin²(θ) + cos²(θ) = 1 for any angle θ."
        },
        {
            "subject": "Mathematics", "topic": "Trigonometry",
            "difficulty": DifficultyLevel.hard, "is_diagnostic": True,
            "question_text": "If tan(θ) = 4/3 in a right triangle, what is cos(θ)?",
            "options": {"A": "3/5", "B": "4/5", "C": "5/3", "D": "3/4"},
            "correct_answer": "A",
            "explanation": "Opposite=4, Adjacent=3 → Hypotenuse = √(4²+3²) = 5. Therefore cos(θ) = Adjacent/Hypotenuse = 3/5."
        },
        # ── Mathematics: Geometry ─────────────────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Geometry",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "What is the sum of all interior angles in any triangle?",
            "options": {"A": "90°", "B": "180°", "C": "270°", "D": "360°"},
            "correct_answer": "B",
            "explanation": "The sum of interior angles in any triangle is always 180 degrees."
        },
        {
            "subject": "Mathematics", "topic": "Geometry",
            "difficulty": DifficultyLevel.medium, "is_diagnostic": True,
            "question_text": "In a right-angled triangle, the two perpendicular legs measure 6 cm and 8 cm. What is the hypotenuse?",
            "options": {"A": "9 cm", "B": "10 cm", "C": "12 cm", "D": "14 cm"},
            "correct_answer": "B",
            "explanation": "Pythagorean Theorem: c² = 6² + 8² = 36 + 64 = 100 → c = √100 = 10 cm."
        },
        {
            "subject": "Mathematics", "topic": "Geometry",
            "difficulty": DifficultyLevel.hard, "is_diagnostic": True,
            "question_text": "A circle has a radius of 7 cm. What is its circumference? (Use π = 22/7)",
            "options": {"A": "22 cm", "B": "44 cm", "C": "154 cm", "D": "88 cm"},
            "correct_answer": "B",
            "explanation": "Circumference = 2πr = 2 × (22/7) × 7 = 44 cm."
        },
        # ── Mathematics: Statistics ───────────────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Statistics",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "Find the arithmetic mean of the numbers: 4, 8, 12, 16, 20.",
            "options": {"A": "10", "B": "12", "C": "14", "D": "16"},
            "correct_answer": "B",
            "explanation": "Mean = (4 + 8 + 12 + 16 + 20) / 5 = 60 / 5 = 12."
        },
        {
            "subject": "Mathematics", "topic": "Statistics",
            "difficulty": DifficultyLevel.medium, "is_diagnostic": True,
            "question_text": "What is the median of the data set: 3, 7, 2, 9, 5, 8, 1?",
            "options": {"A": "4", "B": "5", "C": "6", "D": "7"},
            "correct_answer": "B",
            "explanation": "Sort data: 1, 2, 3, 5, 7, 8, 9. The middle element (4th value) is 5."
        },
        {
            "subject": "Mathematics", "topic": "Statistics",
            "difficulty": DifficultyLevel.hard, "is_diagnostic": True,
            "question_text": "A bag contains 3 red balls and 7 blue balls. What is the probability of drawing a red ball?",
            "options": {"A": "3/7", "B": "3/10", "C": "7/10", "D": "1/3"},
            "correct_answer": "B",
            "explanation": "Total balls = 3 + 7 = 10. Probability = Favorable outcomes / Total outcomes = 3/10."
        },
        # ── Science: Force and Pressure ────────────────────────────────────────
        {
            "subject": "Science", "topic": "Force and Pressure",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "What is the SI unit of pressure?",
            "options": {"A": "Newton", "B": "Pascal", "C": "Joule", "D": "Watt"},
            "correct_answer": "B",
            "explanation": "Pressure = Force/Area. SI unit is Pascal (Pa) = N/m². 1 Pa = 1 N/m². Named after Blaise Pascal."
        },
        {
            "subject": "Science", "topic": "Force and Pressure",
            "difficulty": DifficultyLevel.medium,
            "question_text": "A force of 200 N acts on an area of 5 m². What is the pressure?",
            "options": {"A": "10 Pa", "B": "20 Pa", "C": "40 Pa", "D": "1000 Pa"},
            "correct_answer": "C",
            "explanation": "Pressure = Force ÷ Area = 200 ÷ 5 = 40 Pa."
        },
        {
            "subject": "Science", "topic": "Force and Pressure",
            "difficulty": DifficultyLevel.hard,
            "question_text": "Why do camels have broad, flat feet?",
            "options": {
                "A": "To run faster on sand",
                "B": "To reduce pressure on soft sand surfaces",
                "C": "To increase pressure on sand",
                "D": "To maintain body temperature"
            },
            "correct_answer": "B",
            "explanation": "P = F/A. Broader feet increase area → less pressure on soft sand, preventing the camel from sinking. This is an application of pressure = force/area."
        },
        # ── Science: Microorganisms ────────────────────────────────────────────
        {
            "subject": "Science", "topic": "Microorganisms",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "Which microorganism is used to make curd from milk?",
            "options": {"A": "Yeast", "B": "Penicillium", "C": "Lactobacillus", "D": "Rhizobium"},
            "correct_answer": "C",
            "explanation": "Lactobacillus bacteria converts milk into curd by producing lactic acid. This process is called fermentation."
        },
        {
            "subject": "Science", "topic": "Microorganisms",
            "difficulty": DifficultyLevel.medium,
            "question_text": "Which gas is produced during the fermentation of sugar by yeast?",
            "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon Dioxide", "D": "Hydrogen"},
            "correct_answer": "C",
            "explanation": "Yeast ferments sugar anaerobically: Sugar → Ethanol + CO₂. The CO₂ makes bread dough rise."
        },
        {
            "subject": "Science", "topic": "Microorganisms",
            "difficulty": DifficultyLevel.hard,
            "question_text": "Rhizobium bacteria found in root nodules of leguminous plants performs which function?",
            "options": {
                "A": "Photosynthesis",
                "B": "Nitrogen fixation",
                "C": "Decomposition of dead matter",
                "D": "Producing antibiotics"
            },
            "correct_answer": "B",
            "explanation": "Rhizobium fixes atmospheric nitrogen (N₂) into ammonia (NH₃), enriching soil fertility. This is a mutualistic relationship with the plant."
        },
        # ── Science: Cell Structure ────────────────────────────────────────────
        {
            "subject": "Science", "topic": "Cell Structure",
            "difficulty": DifficultyLevel.easy,
            "question_text": "Which organelle is known as the 'powerhouse of the cell'?",
            "options": {"A": "Nucleus", "B": "Ribosome", "C": "Mitochondria", "D": "Golgi Body"},
            "correct_answer": "C",
            "explanation": "Mitochondria produces ATP (energy) through cellular respiration. It has a double membrane and its own DNA."
        },
        {
            "subject": "Science", "topic": "Cell Structure",
            "difficulty": DifficultyLevel.medium,
            "question_text": "Which structure is present in plant cells but NOT in animal cells?",
            "options": {"A": "Nucleus", "B": "Cell Wall", "C": "Mitochondria", "D": "Cell Membrane"},
            "correct_answer": "B",
            "explanation": "Plant cells have a rigid cell wall made of cellulose that provides structural support. Animal cells only have a flexible cell membrane."
        },
        # ── English: Tenses ────────────────────────────────────────────────────
        {
            "subject": "English", "topic": "Tenses",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "Which sentence is in the simple past tense?",
            "options": {
                "A": "She is reading a book.",
                "B": "She reads every day.",
                "C": "She read a book yesterday.",
                "D": "She will read tomorrow."
            },
            "correct_answer": "C",
            "explanation": "'Read' (past form of read) + time marker 'yesterday' indicates Simple Past tense. It describes a completed action."
        },
        {
            "subject": "English", "topic": "Tenses",
            "difficulty": DifficultyLevel.medium,
            "question_text": "Fill in the blank: By tomorrow, they _____ the project.",
            "options": {
                "A": "will complete",
                "B": "will have completed",
                "C": "completed",
                "D": "are completing"
            },
            "correct_answer": "B",
            "explanation": "'Will have completed' = Future Perfect Tense. Used when an action will be finished before a specific future time ('by tomorrow')."
        },
        # ── Social Studies: Constitution ───────────────────────────────────────
        {
            "subject": "Social Studies", "topic": "The Indian Constitution",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "When was the Indian Constitution adopted?",
            "options": {"A": "15 August 1947", "B": "26 November 1949", "C": "26 January 1950", "D": "30 January 1948"},
            "correct_answer": "B",
            "explanation": "The Constitution was adopted on 26 November 1949 (Constitution Day). It came into effect on 26 January 1950 (Republic Day)."
        },
        {
            "subject": "Social Studies", "topic": "The Indian Constitution",
            "difficulty": DifficultyLevel.medium,
            "question_text": "Right to Education (Article 21-A) makes education free and compulsory for children aged:",
            "options": {"A": "5-12 years", "B": "6-14 years", "C": "6-18 years", "D": "5-16 years"},
            "correct_answer": "B",
            "explanation": "Article 21-A (added by 86th Amendment, 2002) guarantees free and compulsory education to all children between 6-14 years."
        },
    ]

    created = []
    for qdata in questions_data:
        subject = subjects[qdata["subject"]]
        topic = topics[qdata["topic"]]
        q = Question(
            subject_id=subject.id,
            topic_id=topic.id,
            question_text=qdata["question_text"],
            question_type=QuestionType.mcq,
            difficulty=qdata["difficulty"],
            options=qdata["options"],
            correct_answer=qdata["correct_answer"],
            explanation=qdata["explanation"],
            grade_level=8,
            is_diagnostic=qdata.get("is_diagnostic", False),
        )
        db.add(q)
        created.append(q)
    db.flush()
    print(f"    ✓ Created {len(created)} questions")
    return created


def seed_learning_performance(
    db: Session,
    students: list[User],
    questions: list[Question],
    topics: dict,
):
    print("  ➤ Seeding realistic learning performance...")

    # Each student gets a "performance tier" — determines how well they do
    performance_tiers = [
        ("Arjun Mehta",  0.85),    # High performer
        ("Prerna Gupta", 0.70),
        ("Kiran Rao",    0.75),
        ("Fatima Sheikh",0.60),
        ("Rohan Verma",  0.45),    # Struggling
        ("Anika Patel",  0.80),
        ("Dev Bhat",     0.50),    # At-risk
        ("Sneha Iyer",   0.90),    # Top performer
        ("Kabir Khan",   0.40),    # Struggling  
        ("Meera Nair",   0.65),
    ]
    tier_map = {name: acc for name, acc in performance_tiers}

    diagnostic_questions = [q for q in questions if q.is_diagnostic]

    for student in students:
        accuracy = tier_map.get(student.full_name, 0.65)

        # ── Diagnostic Attempt ─────────────────────────────────────────────
        total_diag = len(diagnostic_questions)
        correct_diag = round(accuracy * total_diag)
        score_pct = (correct_diag / total_diag) * 100

        if score_pct < 40:
            baseline = DifficultyLevel.easy
        elif score_pct < 75:
            baseline = DifficultyLevel.medium
        else:
            baseline = DifficultyLevel.hard

        answers = {str(q.id): q.correct_answer if rng.random() < accuracy else "A" for q in diagnostic_questions}
        diag = DiagnosticAttempt(
            student_id=student.id,
            score_percentage=score_pct,
            total_questions=total_diag,
            correct_count=correct_diag,
            answers_json=answers,
            baseline_level=baseline,
            completed_at=utc_days_ago(10),
        )
        db.add(diag)

        # ── Quiz Attempts (10 days of practice) ───────────────────────────
        quiz_qs = rng.sample(questions, min(30, len(questions)))
        for i, q in enumerate(quiz_qs):
            is_correct = rng.random() < accuracy
            attempt = QuizAttempt(
                student_id=student.id,
                question_id=q.id,
                chosen_answer=q.correct_answer if is_correct else "A",
                is_correct=is_correct,
                time_taken_secs=rng.randint(15, 120),
                difficulty_when_asked=q.difficulty,
                timestamp=utc_days_ago(rng.randint(0, 9)),
            )
            db.add(attempt)

        # ── Skill Mastery (one per topic) ─────────────────────────────────
        for topic_name, topic in topics.items():
            topic_accuracy = accuracy + rng.uniform(-0.15, 0.15)
            topic_accuracy = max(0.1, min(0.98, topic_accuracy))
            mastery_score = topic_accuracy * 100
            total_att = rng.randint(8, 20)
            correct_c = round(topic_accuracy * total_att)

            if mastery_score < 40:
                level = DifficultyLevel.easy
            elif mastery_score < 75:
                level = DifficultyLevel.medium
            else:
                level = DifficultyLevel.hard

            mastery = SkillMastery(
                student_id=student.id,
                topic_id=topic.id,
                mastery_score=round(mastery_score, 1),
                current_level=level,
                correct_streak=rng.randint(0, 4),
                total_attempts=total_att,
                correct_count=correct_c,
            )
            db.add(mastery)

        # ── Learning Events ────────────────────────────────────────────────
        for day in range(10):
            event = LearningEvent(
                user_id=student.id,
                event_type=LearningEventType.session_start,
                payload={"day": day, "subject": rng.choice(["Mathematics", "Science"])},
                xp_earned=rng.randint(5, 20),
                timestamp=utc_days_ago(day),
            )
            db.add(event)

            if accuracy > 0.7 and day % 3 == 0:
                db.add(LearningEvent(
                    user_id=student.id,
                    event_type=LearningEventType.streak_achieved,
                    payload={"streak_days": rng.randint(3, 10)},
                    xp_earned=50,
                    timestamp=utc_days_ago(day),
                ))

    db.flush()
    print(f"    ✓ Learning performance seeded for {len(students)} students")


def seed_documents(db: Session, subjects: dict) -> None:
    print("  ➤ Seeding knowledge documents...")
    math_subject = subjects["Mathematics"]
    science_subject = subjects["Science"]

    # ── Document 1: Mathematics - Algebra & Linear Equations ──────────
    doc_alg = Document(
        title="NCERT Mathematics Class 8/9 — Algebra & Polynomial Factoring",
        subject_id=math_subject.id,
        grade_level=8,
        source_url="https://ncert.nic.in/textbook.php?gemh1=2",
        author="NCERT Educational Repository",
    )
    db.add(doc_alg)
    db.flush()
    alg_chunks = [
        "Algebraic Expressions & Terms: An algebraic expression is formed from variables (like x, y, z) and constants combined using operations (+, -, ×, ÷). Like terms contain the exact same variables raised to the same powers, for example 3x and -5x. Only like terms can be added or subtracted.",
        "Solving Linear Equations in One Variable: A linear equation has an equality sign (=) and degree 1. To solve 2x + 3 = 11, isolate the variable x by performing identical inverse operations on both sides: 2x = 11 - 3 = 8, so x = 8/2 = 4.",
        "Polynomial Factoring & Identities: Important algebraic identities include: (1) (a+b)² = a² + 2ab + b²; (2) (a-b)² = a² - 2ab + b²; (3) Difference of Squares: a² - b² = (a+b)(a-b). To factorize x² - 9y², recognize it as x² - (3y)² = (x + 3y)(x - 3y)."
    ]
    for i, ctext in enumerate(alg_chunks):
        db.add(DocumentChunk(document_id=doc_alg.id, chunk_index=i, chunk_text=ctext))

    # ── Document 2: Mathematics - Quadratic Equations ─────────────────
    doc_quad = Document(
        title="NCERT Mathematics Class 10 — Chapter 4: Quadratic Equations",
        subject_id=math_subject.id,
        grade_level=10,
        source_url="https://ncert.nic.in/textbook.php?jemh1=4",
        author="NCERT Educational Repository",
    )
    db.add(doc_quad)
    db.flush()
    quad_chunks = [
        "Quadratic Equations Standard Form: A quadratic equation in variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0. The values of x that satisfy the equation are called the roots or zeros.",
        "Solving by Factorization & Quadratic Formula: Roots can be found by middle-term splitting or using the Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a). For example, for x² - 5x + 6 = 0, a=1, b=-5, c=6 → x = (5 ± √(25 - 24))/2 = (5 ± 1)/2 → x = 3 or x = 2.",
        "Discriminant and Nature of Roots: The expression D = b² - 4ac is called the Discriminant. (1) If D > 0, the equation has two distinct real roots. (2) If D = 0, the equation has two equal real roots: x = -b/(2a). (3) If D < 0, the equation has no real roots (complex roots)."
    ]
    for i, ctext in enumerate(quad_chunks):
        db.add(DocumentChunk(document_id=doc_quad.id, chunk_index=i, chunk_text=ctext))

    # ── Document 3: Mathematics - Trigonometry ────────────────────────
    doc_trig = Document(
        title="NCERT Mathematics Class 10 — Chapter 8: Introduction to Trigonometry",
        subject_id=math_subject.id,
        grade_level=10,
        source_url="https://ncert.nic.in/textbook.php?jemh1=8",
        author="NCERT Educational Repository",
    )
    db.add(doc_trig)
    db.flush()
    trig_chunks = [
        "Trigonometric Ratios in Right Triangles: For an acute angle θ in a right-angled triangle: sin(θ) = Opposite/Hypotenuse, cos(θ) = Adjacent/Hypotenuse, tan(θ) = Opposite/Adjacent = sin(θ)/cos(θ). Reciprocals are cosec(θ) = 1/sin(θ), sec(θ) = 1/cos(θ), cot(θ) = 1/tan(θ).",
        "Fundamental Pythagorean Identity: In any right triangle with hypotenuse c and legs a, b: a² + b² = c². Dividing by c² yields the core identity: sin²(θ) + cos²(θ) = 1. Other key identities include 1 + tan²(θ) = sec²(θ) and 1 + cot²(θ) = cosec²(θ).",
        "Trigonometric Values for Specific Angles: Key values include: sin(30°) = 1/2, sin(45°) = 1/√2, sin(60°) = √3/2, sin(90°) = 1. Cosine values run in reverse: cos(30°) = √3/2, cos(45°) = 1/√2, cos(60°) = 1/2, cos(90°) = 0. tan(45°) = 1."
    ]
    for i, ctext in enumerate(trig_chunks):
        db.add(DocumentChunk(document_id=doc_trig.id, chunk_index=i, chunk_text=ctext))

    # ── Document 4: Mathematics - Geometry & Triangles ───────────────
    doc_geo = Document(
        title="NCERT Mathematics Class 9/10 — Geometry, Triangles & Circles",
        subject_id=math_subject.id,
        grade_level=9,
        source_url="https://ncert.nic.in/textbook.php?iemh1=6",
        author="NCERT Educational Repository",
    )
    db.add(doc_geo)
    db.flush()
    geo_chunks = [
        "Triangle Properties & Angle Sum Theorem: The sum of the interior angles of any triangle is always 180 degrees (∠A + ∠B + ∠C = 180°). An exterior angle of a triangle equals the sum of its two opposite interior angles.",
        "Pythagorean Theorem: In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides: c² = a² + b². If legs are 6 cm and 8 cm, hypotenuse c = √(36 + 64) = √100 = 10 cm.",
        "Circle Formulas & Tangents: For a circle of radius r: Circumference C = 2πr; Area A = πr². A tangent to a circle is a line that intersects the circle at exactly one point, and is perpendicular to the radius at the point of contact."
    ]
    for i, ctext in enumerate(geo_chunks):
        db.add(DocumentChunk(document_id=doc_geo.id, chunk_index=i, chunk_text=ctext))

    # ── Document 5: Mathematics - Statistics & Probability ────────────
    doc_stat = Document(
        title="NCERT Mathematics Class 9/10 — Statistics & Basic Probability",
        subject_id=math_subject.id,
        grade_level=9,
        source_url="https://ncert.nic.in/textbook.php?iemh1=14",
        author="NCERT Educational Repository",
    )
    db.add(doc_stat)
    db.flush()
    stat_chunks = [
        "Measures of Central Tendency — Mean: The arithmetic mean (average) x̄ is the sum of all observations divided by the total number of observations: x̄ = (∑ x_i) / n. For data 4, 8, 12, 16, 20: Mean = 60/5 = 12.",
        "Median and Mode: The Median is the middle value when data is arranged in ascending order. If n is odd, Median is the ((n+1)/2)th term. The Mode is the value that appears most frequently in a dataset.",
        "Theoretical Probability: The probability of an event E, P(E) = (Number of outcomes favorable to E) / (Total number of possible outcomes). The probability of an event ranges between 0 and 1 (0 ≤ P(E) ≤ 1). If a bag has 3 red and 7 blue balls, P(Red) = 3/10."
    ]
    for i, ctext in enumerate(stat_chunks):
        db.add(DocumentChunk(document_id=doc_stat.id, chunk_index=i, chunk_text=ctext))

    db.flush()
    print(f"    ✓ Created 2 documents with chunks")


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def main():
    print("\n🌱 ShikshaAI — Seeding database...\n")
    db: Session = SessionLocal()
    try:
        # Safety check — don't reseed if data already exists
        existing = db.query(User).first()
        if existing:
            print("⚠️  Database already has data. Skipping seed to avoid duplicates.")
            print("   To reseed, run:  DROP DATABASE shikshaai; CREATE DATABASE shikshaai;")
            print("   Then re-run migrations and this script.\n")
            return

        teacher  = seed_teacher(db)
        students = seed_students(db)
        seed_class(db, teacher, students)
        subject_topic = seed_subjects_and_topics(db)
        questions = seed_questions(db, subject_topic["subjects"], subject_topic["topics"])
        seed_learning_performance(db, students, questions, subject_topic["topics"])
        seed_documents(db, subject_topic["subjects"])

        db.commit()
        print("\n✅ Seed complete! Here's a summary:")
        print(f"   👩‍🏫 Teacher:   {teacher.full_name} | login: priya.sharma@shikshaai.in / teacher123")
        print(f"   👨‍🎓 Students:  {len(students)} students | password: student123")
        print(f"   📚 Subjects:  {len(subject_topic['subjects'])}")
        print(f"   📖 Topics:    {len(subject_topic['topics'])}")
        print(f"   ❓ Questions: {len(questions)}")
        print(f"   📄 Documents: 2 (with knowledge chunks)\n")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
