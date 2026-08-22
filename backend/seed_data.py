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
            school_name="Delhi Public School, Sector 12",
            learning_style=style,
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
                ("Rational Numbers",         "Properties and operations on rational numbers", 0),
                ("Linear Equations",         "Solving linear equations in one variable",       1),
                ("Mensuration",              "Area and volume of 2D and 3D shapes",            2),
                ("Data Handling",            "Graphs, mean, median, mode and probability",     3),
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
        # ── Mathematics: Rational Numbers ─────────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Rational Numbers",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "Which of the following is a rational number?",
            "options": {"A": "√2", "B": "π", "C": "3/4", "D": "√3"},
            "correct_answer": "C",
            "explanation": "3/4 can be expressed as p/q where both p=3 and q=4 are integers and q≠0. √2, π, and √3 are irrational numbers."
        },
        {
            "subject": "Mathematics", "topic": "Rational Numbers",
            "difficulty": DifficultyLevel.medium,
            "question_text": "What is the sum of -3/7 and 2/7?",
            "options": {"A": "5/7", "B": "-1/7", "C": "1/7", "D": "-5/7"},
            "correct_answer": "B",
            "explanation": "-3/7 + 2/7 = (-3+2)/7 = -1/7. When adding fractions with the same denominator, simply add the numerators."
        },
        {
            "subject": "Mathematics", "topic": "Rational Numbers",
            "difficulty": DifficultyLevel.hard,
            "question_text": "Find the rational number between 1/4 and 1/2 using the mean method.",
            "options": {"A": "1/3", "B": "3/8", "C": "5/8", "D": "2/3"},
            "correct_answer": "B",
            "explanation": "Mean method: (1/4 + 1/2) / 2 = (1/4 + 2/4) / 2 = (3/4) / 2 = 3/8. So 3/8 lies between 1/4 and 1/2."
        },
        # ── Mathematics: Linear Equations ─────────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Linear Equations",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "Solve for x: 2x + 3 = 7",
            "options": {"A": "x = 1", "B": "x = 2", "C": "x = 3", "D": "x = 5"},
            "correct_answer": "B",
            "explanation": "2x + 3 = 7 → 2x = 7 - 3 = 4 → x = 4/2 = 2. Always perform the same operation on both sides."
        },
        {
            "subject": "Mathematics", "topic": "Linear Equations",
            "difficulty": DifficultyLevel.medium,
            "question_text": "If 5(x-2) = 3(x+4), what is x?",
            "options": {"A": "x = 7", "B": "x = 9", "C": "x = 11", "D": "x = 13"},
            "correct_answer": "C",
            "explanation": "5x - 10 = 3x + 12 → 5x - 3x = 12 + 10 → 2x = 22 → x = 11. Expand brackets, then collect like terms."
        },
        {
            "subject": "Mathematics", "topic": "Linear Equations",
            "difficulty": DifficultyLevel.hard,
            "question_text": "The sum of two consecutive even integers is 46. What is the larger integer?",
            "options": {"A": "20", "B": "22", "C": "24", "D": "26"},
            "correct_answer": "C",
            "explanation": "Let n and n+2 be the even integers. n + (n+2) = 46 → 2n + 2 = 46 → n = 22. Larger integer = 22 + 2 = 24."
        },
        # ── Mathematics: Mensuration ───────────────────────────────────────────
        {
            "subject": "Mathematics", "topic": "Mensuration",
            "difficulty": DifficultyLevel.easy, "is_diagnostic": True,
            "question_text": "What is the area of a rectangle with length 8 cm and breadth 5 cm?",
            "options": {"A": "13 cm²", "B": "26 cm²", "C": "40 cm²", "D": "80 cm²"},
            "correct_answer": "C",
            "explanation": "Area of rectangle = length × breadth = 8 × 5 = 40 cm²."
        },
        {
            "subject": "Mathematics", "topic": "Mensuration",
            "difficulty": DifficultyLevel.medium,
            "question_text": "The area of a circle with radius 7 cm is (use π = 22/7):",
            "options": {"A": "44 cm²", "B": "154 cm²", "C": "176 cm²", "D": "308 cm²"},
            "correct_answer": "B",
            "explanation": "Area = πr² = (22/7) × 7² = (22/7) × 49 = 22 × 7 = 154 cm²."
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

    doc1 = Document(
        title="NCERT Mathematics Class 8 — Chapter 1: Rational Numbers",
        subject_id=math_subject.id,
        grade_level=8,
        source_url="https://ncert.nic.in/textbook.php?hemh1=1-1",
        author="NCERT",
    )
    db.add(doc1)
    db.flush()

    math_chunks = [
        "A rational number is defined as a number that can be expressed in the form p/q, where p and q are integers and q is not equal to zero. Examples include 1/2, -3/4, 7/1 (which equals 7), and 0/5 (which equals 0). All integers are rational numbers because any integer n can be written as n/1.",
        "Rational numbers are closed under addition, subtraction, and multiplication. This means if you add, subtract, or multiply any two rational numbers, the result is always a rational number. However, division by zero is not defined and is excluded.",
        "The number line representation: Rational numbers can be located on a number line. Between any two rational numbers, there exist infinitely many rational numbers. This property is called density of rational numbers.",
        "Properties of rational numbers include: Commutativity (a+b = b+a), Associativity ((a+b)+c = a+(b+c)), Distributivity (a×(b+c) = a×b + a×c), and the existence of additive identity (0) and multiplicative identity (1).",
    ]
    for i, chunk_text in enumerate(math_chunks):
        db.add(DocumentChunk(document_id=doc1.id, chunk_index=i, chunk_text=chunk_text))

    doc2 = Document(
        title="NCERT Science Class 8 — Chapter 11: Force and Pressure",
        subject_id=science_subject.id,
        grade_level=8,
        source_url="https://ncert.nic.in/textbook.php?hesc1=11-1",
        author="NCERT",
    )
    db.add(doc2)
    db.flush()

    science_chunks = [
        "A force is a push or a pull acting on an object. Forces arise due to interaction between objects. When two objects interact, they exert forces on each other. A force can change the state of motion of an object, its direction, or its shape.",
        "Pressure is defined as the force acting per unit area. The formula is: Pressure = Force / Area (P = F/A). The SI unit of pressure is Pascal (Pa), where 1 Pa = 1 N/m². Pressure increases when force increases or when area decreases.",
        "Atmospheric pressure: The air around us exerts pressure on all objects. At sea level, atmospheric pressure is approximately 101,325 Pa (1 atm). This pressure decreases with altitude. We don't feel this pressure because our bodies are adapted to it.",
        "Applications of pressure in daily life: Knife blades are sharp (small area → high pressure for cutting). Dam walls are thicker at the bottom (water pressure increases with depth). Camels have flat broad feet (large area → less pressure on soft sand).",
    ]
    for i, chunk_text in enumerate(science_chunks):
        db.add(DocumentChunk(document_id=doc2.id, chunk_index=i, chunk_text=chunk_text))

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
