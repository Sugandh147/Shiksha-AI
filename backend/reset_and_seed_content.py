"""
reset_and_seed_content.py
──────────────────────────
Purges all fictional/demo user data from ShikshaAI database and populates educational content:
  • Subjects & Multi-Grade Topics (Classes 6-12)
  • Comprehensive Question Bank for Classes 6, 7, 8, 9, 10, 11, 12
  • NCERT RAG Documents & Text Chunks
  • Educational Opportunity Listings

Leaves 0 Users, 0 Profiles, 0 Classes, 0 Attempts in the database.
Ready for real user registration & live presentation!
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.db.models import (
    User, StudentProfile, TeacherProfile, Class, ClassMember,
    Subject, Topic, Question, QuestionType, DifficultyLevel,
    DiagnosticAttempt, QuizAttempt, SkillMastery, LearningEvent,
    ChatSession, ChatMessage, Document, DocumentChunk, Opportunity
)


def purge_and_seed():
    print("\n" + "="*75)
    print("SHIKSHAAI - PURGING DEMO USERS & SEEDING PURE EDUCATIONAL CONTENT (CLASSES 6-12)")
    print("="*75 + "\n")

    # Ensure all DB tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Purge all user data tables
        print("1. Purging all user data tables...")
        db.query(ChatMessage).delete()
        db.query(ChatSession).delete()
        db.query(LearningEvent).delete()
        db.query(QuizAttempt).delete()
        db.query(DiagnosticAttempt).delete()
        db.query(SkillMastery).delete()
        db.query(ClassMember).delete()
        db.query(Class).delete()
        db.query(TeacherProfile).delete()
        db.query(StudentProfile).delete()
        db.query(User).delete()
        db.commit()
        print("   [OK] User tables successfully cleared (0 users, 0 classes, 0 attempts remaining)")

        # Clear existing topics & questions to re-seed rich curriculum bank
        db.query(Question).delete()
        db.query(Topic).delete()
        db.query(Subject).delete()
        db.query(Opportunity).delete()
        db.commit()

        # 2. Seed Subjects & Multi-Grade Topics (Classes 6-12)
        print("2. Seeding Subjects & Multi-Grade Curriculum Topics (Classes 6-12)...")
        math = Subject(name="Mathematics", description="Core K-12 Mathematics", icon="📐", color="#6366f1")
        sci = Subject(name="Science", description="Core K-12 Science", icon="🔬", color="#10b981")
        eng = Subject(name="English", description="Grammar & Reading", icon="📚", color="#ec4899")
        soc = Subject(name="Social Studies", description="History & Civics", icon="🌍", color="#f59e0b")

        db.add_all([math, sci, eng, soc])
        db.flush()

        # Topic tuples: (subject_id, topic_name, grade_level, order_index)
        topics_data = [
            # Class 6
            (math.id, "Knowing Our Numbers & Whole Numbers", 6, 1),
            (math.id, "Basic Geometrical Ideas", 6, 2),
            (sci.id, "Food Sources & Components", 6, 1),
            (sci.id, "Light, Shadows & Reflections", 6, 2),

            # Class 7
            (math.id, "Integers & Simple Equations", 7, 1),
            (math.id, "Lines, Angles & Triangles", 7, 2),
            (sci.id, "Heat & Temperature", 7, 1),
            (sci.id, "Acids, Bases & Salts", 7, 2),

            # Class 8
            (math.id, "Rational Numbers & Decimals", 8, 1),
            (math.id, "Linear Equations in One Variable", 8, 2),
            (math.id, "Algebra & Polynomials", 8, 3),
            (sci.id, "Force & Pressure", 8, 1),
            (sci.id, "Cell Structure & Functions", 8, 2),
            (sci.id, "Microorganisms: Friend & Foe", 8, 3),
            (eng.id, "Grammar: Tenses & Voice", 8, 1),
            (soc.id, "The Indian Constitution", 8, 1),

            # Class 9
            (math.id, "Number Systems", 9, 1),
            (math.id, "Polynomials & Coordinate Geometry", 9, 2),
            (math.id, "Triangles & Quadrilaterals", 9, 3),
            (sci.id, "Matter in Our Surroundings", 9, 1),
            (sci.id, "Motion & Force Laws", 9, 2),
            (sci.id, "Gravitation & Work Energy", 9, 3),

            # Class 10
            (math.id, "Real Numbers & Polynomials", 10, 1),
            (math.id, "Quadratic Equations", 10, 2),
            (math.id, "Trigonometry & Applications", 10, 3),
            (math.id, "Circles & Triangles", 10, 4),
            (sci.id, "Light & Reflection/Refraction", 10, 1),
            (sci.id, "Chemical Reactions & Equations", 10, 2),
            (sci.id, "Life Processes & Control", 10, 3),

            # Class 11
            (math.id, "Sets, Relations & Functions", 11, 1),
            (math.id, "Complex Numbers & Quadratic Systems", 11, 2),
            (sci.id, "Units, Measurements & Motion", 11, 1),

            # Class 12
            (math.id, "Matrices & Determinants", 12, 1),
            (math.id, "Calculus: Limits & Derivatives", 12, 2),
            (sci.id, "Electric Charges & Electrostatics", 12, 1),
        ]

        topic_objs = {}
        for sub_id, name, grade, idx in topics_data:
            t = Topic(subject_id=sub_id, name=name, grade_level=grade, order_index=idx)
            db.add(t)
            db.flush()
            topic_objs[f"{name}_G{grade}"] = t

        db.commit()
        print(f"   [OK] Subjects & Topics seeded ({db.query(Subject).count()} subjects, {db.query(Topic).count()} topics)")

        # 3. Seed Rich Multi-Grade Question Bank (Classes 6 to 12)
        print("3. Seeding Grade-Specific Question Bank (Classes 6-12)...")
        q_list = []

        # ── Class 6 ──────────────────────────────────────────────────────────
        t6_math1 = topic_objs["Knowing Our Numbers & Whole Numbers_G6"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t6_math1.id, grade_level=6,
                question_text="Which of the following is the smallest whole number?",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "0", "B": "1", "C": "-1", "D": "10"},
                correct_answer="A",
                explanation="Whole numbers start from 0, 1, 2, 3... The smallest whole number is 0.",
                is_diagnostic=True,
            ),
            Question(
                subject_id=math.id, topic_id=t6_math1.id, grade_level=6,
                question_text="Find the successor of 999.",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                options={"A": "1000", "B": "998", "C": "1001", "D": "990"},
                correct_answer="A",
                explanation="Successor of a number = Number + 1. 999 + 1 = 1000.",
                is_diagnostic=True,
            ),
        ])

        t6_sci1 = topic_objs["Food Sources & Components_G6"]
        q_list.extend([
            Question(
                subject_id=sci.id, topic_id=t6_sci1.id, grade_level=6,
                question_text="Which vitamin deficiency causes Scurvy?",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                options={"A": "Vitamin C", "B": "Vitamin A", "C": "Vitamin D", "D": "Vitamin B12"},
                correct_answer="A",
                explanation="Deficiency of Vitamin C leads to bleeding gums and scurvy.",
                is_diagnostic=True,
            ),
        ])

        # ── Class 7 ──────────────────────────────────────────────────────────
        t7_math1 = topic_objs["Integers & Simple Equations_G7"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t7_math1.id, grade_level=7,
                question_text="Evaluate: (-12) + (-8) - (-5)",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "-15", "B": "-25", "C": "15", "D": "-20"},
                correct_answer="A",
                explanation="-12 - 8 + 5 = -20 + 5 = -15.",
                is_diagnostic=True,
            ),
            Question(
                subject_id=math.id, topic_id=t7_math1.id, grade_level=7,
                question_text="Solve for p: 3p + 7 = 25",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                options={"A": "6", "B": "5", "C": "8", "D": "4"},
                correct_answer="A",
                explanation="3p = 25 - 7 = 18 → p = 6.",
                is_diagnostic=True,
            ),
        ])

        # ── Class 8 ──────────────────────────────────────────────────────────
        t8_lin = topic_objs["Linear Equations in One Variable_G8"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t8_lin.id, grade_level=8,
                question_text="Solve for x: 2x + 3 = 11",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "4", "B": "5", "C": "3", "D": "7"},
                correct_answer="A",
                explanation="Subtract 3: 2x = 8 → x = 4.",
                is_diagnostic=True,
            ),
            Question(
                subject_id=math.id, topic_id=t8_lin.id, grade_level=8,
                question_text="Solve for y: 5y - 7 = 3y + 9",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                options={"A": "8", "B": "4", "C": "6", "D": "5"},
                correct_answer="A",
                explanation="5y - 3y = 9 + 7 → 2y = 16 → y = 8.",
                is_diagnostic=True,
            ),
        ])

        t8_sci1 = topic_objs["Force & Pressure_G8"]
        q_list.extend([
            Question(
                subject_id=sci.id, topic_id=t8_sci1.id, grade_level=8,
                question_text="What is the SI unit of Pressure?",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "Pascal (Pa)", "B": "Newton (N)", "C": "Joule (J)", "D": "Watt (W)"},
                correct_answer="A",
                explanation="Pressure = Force / Area. Unit is Pascal (Pa).",
                is_diagnostic=True,
            ),
        ])

        # ── Class 9 ──────────────────────────────────────────────────────────
        t9_num = topic_objs["Number Systems_G9"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t9_num.id, grade_level=9,
                question_text="Which of the following is an irrational number?",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "√2", "B": "3/5", "C": "0.75", "D": "√9"},
                correct_answer="A",
                explanation="√2 cannot be written as p/q where p, q are integers. √9 = 3 which is rational.",
                is_diagnostic=True,
            ),
            Question(
                subject_id=math.id, topic_id=t9_num.id, grade_level=9,
                question_text="Simplify: (√5 + √2)(√5 - √2)",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                options={"A": "3", "B": "7", "C": "√3", "D": "10"},
                correct_answer="A",
                explanation="(a+b)(a-b) = a² - b² = (√5)² - (√2)² = 5 - 2 = 3.",
                is_diagnostic=True,
            ),
        ])

        # ── Class 10 ─────────────────────────────────────────────────────────
        t10_quad = topic_objs["Quadratic Equations_G10"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t10_quad.id, grade_level=10,
                question_text="Find the roots of x² - 5x + 6 = 0.",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "x = 2 and x = 3", "B": "x = -2 and x = -3", "C": "x = 1 and x = 6", "D": "x = 5 and x = 6"},
                correct_answer="A",
                explanation="Factorize: (x - 2)(x - 3) = 0 → x = 2 or x = 3.",
                is_diagnostic=True,
            ),
            Question(
                subject_id=math.id, topic_id=t10_quad.id, grade_level=10,
                question_text="What is the nature of roots for 2x² - 4x + 3 = 0?",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                options={"A": "No real roots", "B": "Two equal real roots", "C": "Two distinct real roots", "D": "Rational roots"},
                correct_answer="A",
                explanation="Discriminant D = b² - 4ac = 16 - 24 = -8 < 0. No real roots.",
                is_diagnostic=True,
            ),
        ])

        t10_trig = topic_objs["Trigonometry & Applications_G10"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t10_trig.id, grade_level=10,
                question_text="Evaluate: sin²(30°) + cos²(30°)",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "1", "B": "0", "C": "1/2", "D": "√3/2"},
                correct_answer="A",
                explanation="By trigonometric identity, sin²θ + cos²θ = 1 for any angle θ.",
                is_diagnostic=True,
            ),
        ])

        # ── Class 11 ─────────────────────────────────────────────────────────
        t11_sets = topic_objs["Sets, Relations & Functions_G11"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t11_sets.id, grade_level=11,
                question_text="If set A has 3 elements, how many elements are in the power set P(A)?",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "8", "B": "6", "C": "9", "D": "4"},
                correct_answer="A",
                explanation="Number of elements in power set = 2^n = 2^3 = 8.",
                is_diagnostic=True,
            ),
        ])

        # ── Class 12 ─────────────────────────────────────────────────────────
        t12_mat = topic_objs["Matrices & Determinants_G12"]
        q_list.extend([
            Question(
                subject_id=math.id, topic_id=t12_mat.id, grade_level=12,
                question_text="Find the determinant of matrix [[2, 4], [1, 5]].",
                question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                options={"A": "6", "B": "14", "C": "10", "D": "2"},
                correct_answer="A",
                explanation="det = (2*5) - (4*1) = 10 - 4 = 6.",
                is_diagnostic=True,
            ),
        ])

        db.add_all(q_list)
        db.commit()
        print(f"   [OK] Question bank populated ({db.query(Question).count()} questions across Classes 6 to 12)")

        # 4. Seed NCERT RAG Documents
        print("4. Seeding NCERT Knowledge Base RAG Documents...")
        doc1 = Document(
            title="NCERT Mathematics Class 8 — Linear Equations in One Variable",
            subject_id=math.id, grade_level=8,
            source_url="https://ncert.nic.in/textbook.php?hemh1=2", author="NCERT Editorial Board",
        )
        doc2 = Document(
            title="NCERT Mathematics Class 10 — Quadratic Equations",
            subject_id=math.id, grade_level=10,
            source_url="https://ncert.nic.in/textbook.php?jemh1=4", author="NCERT Editorial Board",
        )
        db.add_all([doc1, doc2])
        db.flush()

        chunks = [
            DocumentChunk(
                document_id=doc1.id, chunk_index=0,
                chunk_text="An algebraic equation is an equality involving variables. In a linear equation in one variable, the highest power of the variable is 1.",
            ),
            DocumentChunk(
                document_id=doc2.id, chunk_index=0,
                chunk_text="A quadratic equation in variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0. Roots can be found by quadratic formula x = (-b ± √(b²-4ac)) / (2a).",
            )
        ]
        db.add_all(chunks)

        # 5. Seed STEM Opportunities
        print("5. Seeding Educational Opportunities...")
        opps = [
            Opportunity(
                name="KVPY STEM Fellowship",
                provider="Department of Science and Technology, Govt of India",
                description="Government fellowship encouraging students to pursue research careers in basic sciences.",
                eligibility="Class 11/12 students with >= 75% in Math and Science.",
                benefit="Monthly stipend of ₹5,000 - ₹7,000 + annual contingency grant.",
                deadline="31st October 2026",
                official_source="IISc Bangalore / DST",
                application_url="https://kvpy.iisc.ac.in/",
                target_education_level="Class 11-12",
            ),
            Opportunity(
                name="National Talent Search Examination (NTSE)",
                provider="NCERT India",
                description="Prestigious national level scholarship scheme for Class 10 students in India.",
                eligibility="Enrolled in Class 10 in recognized school in India.",
                benefit="Monthly scholarship until Ph.D. level in Science and Social Sciences.",
                deadline="15th November 2026",
                official_source="NCERT",
                application_url="https://ncert.nic.in/",
                target_education_level="Class 10",
            ),
            Opportunity(
                name="Inspire MANAK Innovation Awards",
                provider="Department of Science & Technology",
                description="Fostering creative ideas and innovation among school students across Classes 6 to 10.",
                eligibility="Students aged 10-15 years submitting original scientific ideas.",
                benefit="₹10,000 award for prototype building + national showcase.",
                deadline="30th September 2026",
                official_source="DST / NIF",
                application_url="https://www.inspireawards-dst.gov.in/",
                target_education_level="Class 6-10",
            ),
        ]
        db.add_all(opps)
        db.commit()
        print("   [OK] Opportunities seeded successfully")

        print("\n" + "="*75)
        print("SHIKSHAAI DATABASE READY! 0 USER PROFILES, ALL CONTENT SEEDED FOR CLASSES 6-12")
        print("="*75 + "\n")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error during purging and seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    purge_and_seed()
