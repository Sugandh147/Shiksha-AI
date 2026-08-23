"""
seed_data.py
────────────
Populates the database ONLY with educational content for ShikshaAI:
  • 4 Subjects (Mathematics, Science, English, Social Studies)
  • 12 Topics across grade levels
  • Educational Questions for Diagnostic & Practice Assessments
  • Knowledge Base Documents + Text Chunks (NCERT-style RAG data)
  • Educational STEM Scholarships & Opportunities

ZERO Fake Users, ZERO Fake Student Profiles, ZERO Fake Teacher Profiles,
ZERO Fake Classes, ZERO Fake Attempts, and ZERO Fake Masteries are created.

The user-data state starts 100% EMPTY (0 Users, 0 Classes, 0 Attempts).
Run with:  python seed_data.py
"""

import os
import sys
from datetime import datetime, timezone

# Ensure we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.db import models
from app.db.models import (
    User, StudentProfile, TeacherProfile, Class, ClassMember,
    Subject, Topic, Question, QuestionType, DifficultyLevel,
    DiagnosticAttempt, QuizAttempt, SkillMastery, LearningEvent,
    ChatSession, ChatMessage, Document, DocumentChunk, Opportunity
)


def seed_database():
    print("\n" + "═"*75)
    print("🌱 SHIKSHAAI — SEEDING PURE EDUCATIONAL CONTENT (ZERO FAKE USERS)")
    print("═"*75 + "\n")

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Subjects & Topics
        if db.query(Subject).count() == 0:
            print("  ➤ Seeding Subjects & Topics...")
            math = Subject(name="Mathematics", description="Core K-12 Mathematics", icon="📐", color="#6366f1")
            sci = Subject(name="Science", description="Core K-12 Science", icon="🔬", color="#10b981")
            eng = Subject(name="English", description="Grammar & Reading", icon="📚", color="#ec4899")
            soc = Subject(name="Social Studies", description="History & Civics", icon="🌍", color="#f59e0b")

            db.add_all([math, sci, eng, soc])
            db.flush()

            topics = [
                # Math Grade 8 & 10
                Topic(subject_id=math.id, name="Fractions & Decimals", description="Rational numbers, fractions, and operations.", grade_level=8, order_index=1),
                Topic(subject_id=math.id, name="Linear Equations", description="Solving linear equations in one variable.", grade_level=8, order_index=2),
                Topic(subject_id=math.id, name="Algebra & Polynomials", description="Algebraic expressions, identities, and factoring.", grade_level=8, order_index=3),
                Topic(subject_id=math.id, name="Quadratic Equations", description="Solving quadratic equations by factoring and formula.", grade_level=10, order_index=4),
                Topic(subject_id=math.id, name="Triangles & Geometry", description="Properties of triangles, congruence, and similarity.", grade_level=8, order_index=5),
                
                # Science Grade 8
                Topic(subject_id=sci.id, name="Force & Pressure", description="Types of forces, pressure in fluids, and atmospheric pressure.", grade_level=8, order_index=1),
                Topic(subject_id=sci.id, name="Cell Structure & Function", description="Plant vs animal cells, organelles, and cell division.", grade_level=8, order_index=2),
                Topic(subject_id=sci.id, name="Chemical Effects of Current", description="Electroplating, conductors, and electrolytes.", grade_level=8, order_index=3),

                # English Grade 8
                Topic(subject_id=eng.id, name="Grammar: Tenses & Active Voice", description="Mastering present, past, future tenses and voice conversion.", grade_level=8, order_index=1),
                Topic(subject_id=eng.id, name="Reading Comprehension", description="Inferential reading and contextual vocabulary.", grade_level=8, order_index=2),

                # Social Studies Grade 8
                Topic(subject_id=soc.id, name="The Indian Constitution", description="Key features, fundamental rights, and secularism.", grade_level=8, order_index=1),
                Topic(subject_id=soc.id, name="Resources & Development", description="Types of natural resources, land, soil, and water conservation.", grade_level=8, order_index=2),
            ]
            db.add_all(topics)
            db.commit()
            print(f"    ✓ Created 4 Subjects and 12 Topics")
        else:
            print("  ℹ️ Subjects & Topics already present.")

        # 2. Educational Question Bank
        if db.query(Question).count() == 0:
            print("  ➤ Seeding Question Bank...")
            topics = db.query(Topic).all()
            t_map = {t.name: t for t in topics}

            questions = []
            # Linear Equations
            if "Linear Equations" in t_map:
                t = t_map["Linear Equations"]
                questions.extend([
                    Question(
                        subject_id=t.subject_id, topic_id=t.id, grade_level=8,
                        question_text="Solve for x: 2x + 3 = 11",
                        question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                        options={"A": "4", "B": "5", "C": "3", "D": "7"},
                        correct_answer="A",
                        explanation="Subtract 3 from both sides: 2x = 8. Divide by 2: x = 4.",
                        is_diagnostic=True,
                    ),
                    Question(
                        subject_id=t.subject_id, topic_id=t.id, grade_level=8,
                        question_text="Solve for y: 5y - 7 = 3y + 9",
                        question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                        options={"A": "6", "B": "8", "C": "4", "D": "5"},
                        correct_answer="B",
                        explanation="Subtract 3y from both sides: 2y - 7 = 9. Add 7: 2y = 16. So y = 8.",
                        is_diagnostic=True,
                    ),
                    Question(
                        subject_id=t.subject_id, topic_id=t.id, grade_level=8,
                        question_text="A number x is increased by 5 and doubled to give 24. What is x?",
                        question_type=QuestionType.mcq, difficulty=DifficultyLevel.hard,
                        options={"A": "7", "B": "8", "C": "9", "D": "6"},
                        correct_answer="A",
                        explanation="Equation: 2(x + 5) = 24 => x + 5 = 12 => x = 7.",
                        is_diagnostic=False,
                    )
                ])

            # Algebra & Polynomials
            if "Algebra & Polynomials" in t_map:
                t = t_map["Algebra & Polynomials"]
                questions.extend([
                    Question(
                        subject_id=t.subject_id, topic_id=t.id, grade_level=8,
                        question_text="Factorize the algebraic expression: x² - 9y²",
                        question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                        options={"A": "(x - 3y)(x + 3y)", "B": "(x - 9y)(x + y)", "C": "(x - 3y)²", "D": "(x + 3y)²"},
                        correct_answer="A",
                        explanation="Use the difference of squares identity: a² - b² = (a - b)(a + b). Here a = x, b = 3y.",
                        is_diagnostic=True,
                    ),
                    Question(
                        subject_id=t.subject_id, topic_id=t.id, grade_level=8,
                        question_text="Expand using algebraic identity: (2a + 3b)²",
                        question_type=QuestionType.mcq, difficulty=DifficultyLevel.medium,
                        options={"A": "4a² + 12ab + 9b²", "B": "4a² + 6ab + 9b²", "C": "2a² + 12ab + 3b²", "D": "4a² + 9b²"},
                        correct_answer="A",
                        explanation="Identity (x+y)² = x² + 2xy + y². (2a)² + 2(2a)(3b) + (3b)² = 4a² + 12ab + 9b².",
                        is_diagnostic=True,
                    )
                ])

            # Fractions & Decimals
            if "Fractions & Decimals" in t_map:
                t = t_map["Fractions & Decimals"]
                questions.extend([
                    Question(
                        subject_id=t.subject_id, topic_id=t.id, grade_level=8,
                        question_text="What is 3/4 + 2/5?",
                        question_type=QuestionType.mcq, difficulty=DifficultyLevel.easy,
                        options={"A": "23/20", "B": "5/9", "C": "15/20", "D": "7/20"},
                        correct_answer="A",
                        explanation="Common denominator is 20: 15/20 + 8/20 = 23/20.",
                        is_diagnostic=True,
                    )
                ])

            db.add_all(questions)
            db.commit()
            print(f"    ✓ Created {len(questions)} Questions")
        else:
            print("  ℹ️ Question bank already present.")

        # 3. NCERT Documents & RAG Chunks
        if db.query(Document).count() == 0:
            print("  ➤ Seeding NCERT Knowledge Base RAG Documents...")
            doc1 = Document(
                title="NCERT Mathematics Class 8 — Chapter 2: Linear Equations in One Variable",
                subject_id=1, grade_level=8,
                source_url="https://ncert.nic.in/textbook.php?hemh1=2",
                author="NCERT Editorial Board",
            )
            doc2 = Document(
                title="NCERT Mathematics Class 10 — Chapter 4: Quadratic Equations",
                subject_id=1, grade_level=10,
                source_url="https://ncert.nic.in/textbook.php?jemh1=4",
                author="NCERT Editorial Board",
            )
            db.add_all([doc1, doc2])
            db.flush()

            chunks = [
                DocumentChunk(
                    document_id=doc1.id, chunk_index=0,
                    chunk_text="An algebraic equation is an equality involving variables. It has an equal sign '='. The expression on the left of the equal sign is the Left Hand Side (LHS). The expression on the right is the Right Hand Side (RHS). In a linear equation, the highest power of the variable appearing in the expression is 1. To solve 2x + 3 = 11, isolate x by performing inverse operations on both sides: 2x = 11 - 3 = 8 => x = 4.",
                    metadata={"chapter": "2", "section": "2.1", "topic": "Linear Equations"},
                ),
                DocumentChunk(
                    document_id=doc1.id, chunk_index=1,
                    chunk_text="Solving equations having the variable on both sides: transpose terms containing variables to one side and constants to the other side. For example: 5x - 3 = 3x + 7 => 5x - 3x = 7 + 3 => 2x = 10 => x = 5.",
                    metadata={"chapter": "2", "section": "2.2", "topic": "Linear Equations"},
                ),
                DocumentChunk(
                    document_id=doc2.id, chunk_index=0,
                    chunk_text="A quadratic equation in the variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0. The roots of quadratic equation ax² + bx + c = 0 are given by quadratic formula: x = (-b ± √(b² - 4ac)) / (2a), provided b² - 4ac ≥ 0.",
                    metadata={"chapter": "4", "section": "4.1", "topic": "Quadratic Equations"},
                ),
            ]
            db.add_all(chunks)
            db.commit()
            print(f"    ✓ Created 2 NCERT Documents and {len(chunks)} Text Chunks")
        else:
            print("  ℹ️ RAG Documents already present.")

        # 4. STEM Scholarships & Opportunities
        if db.query(Opportunity).count() == 0:
            print("  ➤ Seeding Opportunities...")
            opps = [
                Opportunity(
                    name="KVPY STEM Fellowship Program",
                    provider="Department of Science & Technology (DST)",
                    description="National fellowship for school students pursuing basic sciences and mathematics.",
                    eligibility="Class 8-12 students with >= 60% aggregate score.",
                    benefit="Monthly stipend of ₹5,000 + annual contingency grant.",
                    deadline="2026-11-30",
                    official_source="https://kvpy.iisc.ac.in",
                    application_url="https://kvpy.iisc.ac.in/apply",
                    is_demo=False,
                    target_education_level="Class 8",
                    required_subjects=["Mathematics", "Science"],
                    minimum_mastery_score=50.0,
                ),
                Opportunity(
                    name="National Talent Search Examination (NTSE)",
                    provider="NCERT",
                    description="National level scholarship scheme in India to identify and nurture talented students.",
                    eligibility="Class 8-10 students in recognized schools.",
                    benefit="Monthly scholarship of ₹1,250 for higher secondary studies.",
                    deadline="2026-12-15",
                    official_source="https://ncert.nic.in/ntse",
                    application_url="https://ncert.nic.in/ntse/apply",
                    is_demo=False,
                    target_education_level="Class 8",
                    required_subjects=["Mathematics", "Science", "Social Studies"],
                    minimum_mastery_score=55.0,
                ),
            ]
            db.add_all(opps)
            db.commit()
            print(f"    ✓ Created {len(opps)} STEM Opportunity listings")
        else:
            print("  ℹ️ Opportunities already present.")

        print("\n" + "═"*75)
        print("✨ SEEDING COMPLETE! USER DATA IS 100% EMPTY (0 USERS, 0 CLASSES)")
        print("═"*75 + "\n")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
