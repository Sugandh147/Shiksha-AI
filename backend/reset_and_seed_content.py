"""
reset_and_seed_content.py
──────────────────────────
Purges all fictional/demo user data from ShikshaAI database and populates ONLY educational content:
  • Subjects & Topics
  • Question Bank (MCQ diagnostic & practice items)
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
    print("\n" + "═"*75)
    print("🧹 SHIKSHAAI — PURGING DEMO USERS & SEEDING PURE EDUCATIONAL CONTENT")
    print("═"*75 + "\n")

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
        print("   ✓ User tables successfully cleared (0 users, 0 classes, 0 attempts remaining)")

        # 2. Seed Subjects & Topics if empty
        if db.query(Subject).count() == 0:
            print("2. Seeding Subjects & Topics...")
            math = Subject(name="Mathematics", description="Core K-12 Mathematics", icon="📐", color="#6366f1")
            sci = Subject(name="Science", description="Core K-12 Science", icon="🔬", color="#10b981")
            eng = Subject(name="English", description="Grammar & Reading", icon="📚", color="#ec4899")
            soc = Subject(name="Social Studies", description="History & Civics", icon="🌍", color="#f59e0b")

            db.add_all([math, sci, eng, soc])
            db.flush()

            topics_math = [
                Topic(subject_id=math.id, name="Fractions & Decimals", grade_level=8, order_index=1),
                Topic(subject_id=math.id, name="Linear Equations", grade_level=8, order_index=2),
                Topic(subject_id=math.id, name="Algebra & Polynomials", grade_level=8, order_index=3),
                Topic(subject_id=math.id, name="Quadratic Equations", grade_level=10, order_index=4),
                Topic(subject_id=math.id, name="Triangles & Geometry", grade_level=8, order_index=5),
            ]
            db.add_all(topics_math)
            db.commit()
            print(f"   ✓ Subjects & Topics seeded ({db.query(Subject).count()} subjects, {db.query(Topic).count()} topics)")

        # 3. Seed Question Bank if empty
        if db.query(Question).count() == 0:
            print("3. Seeding Educational Question Bank...")
            math_topics = db.query(Topic).all()
            t_frac = math_topics[0] if len(math_topics) > 0 else None
            t_alg = math_topics[1] if len(math_topics) > 1 else None

            if t_alg and t_frac:
                questions = [
                    Question(
                        subject_id=t_alg.subject_id,
                        topic_id=t_alg.id,
                        question_text="Solve for x: 2x + 3 = 11",
                        question_type=QuestionType.mcq,
                        difficulty=DifficultyLevel.easy,
                        options={"A": "4", "B": "5", "C": "3", "D": "7"},
                        correct_answer="A",
                        explanation="Subtract 3 from both sides: 2x = 8, so x = 4.",
                        grade_level=8,
                        is_diagnostic=True,
                    ),
                    Question(
                        subject_id=t_alg.subject_id,
                        topic_id=t_alg.id,
                        question_text="Factorize the algebraic expression: x² - 9y²",
                        question_type=QuestionType.mcq,
                        difficulty=DifficultyLevel.medium,
                        options={"A": "(x - 3y)(x + 3y)", "B": "(x - 9y)(x + y)", "C": "(x - 3y)²", "D": "(x + 3y)²"},
                        correct_answer="A",
                        explanation="Use the difference of squares identity: a² - b² = (a - b)(a + b). Here a = x and b = 3y.",
                        grade_level=8,
                        is_diagnostic=True,
                    ),
                    Question(
                        subject_id=t_frac.subject_id,
                        topic_id=t_frac.id,
                        question_text="What is 3/4 + 2/5?",
                        question_type=QuestionType.mcq,
                        difficulty=DifficultyLevel.easy,
                        options={"A": "23/20", "B": "5/9", "C": "15/20", "D": "7/20"},
                        correct_answer="A",
                        explanation="Find the common denominator (20): 15/20 + 8/20 = 23/20.",
                        grade_level=8,
                        is_diagnostic=True,
                    ),
                ]
                db.add_all(questions)
                db.commit()
                print(f"   ✓ Question bank populated ({db.query(Question).count()} questions)")

        # 4. Seed NCERT Documents & RAG Chunks if empty
        if db.query(Document).count() == 0:
            print("4. Seeding NCERT Knowledge Base RAG Documents...")
            doc1 = Document(
                title="NCERT Mathematics Class 8 — Chapter 2: Linear Equations in One Variable",
                subject_id=1,
                grade_level=8,
                source_url="https://ncert.nic.in/textbook.php?hemh1=2",
                author="NCERT Editorial Board",
            )
            db.add(doc1)
            db.flush()

            chunk1 = DocumentChunk(
                document_id=doc1.id,
                chunk_index=0,
                chunk_text="An algebraic equation is an equality involving variables. It has an equal sign '='. The expression on the left of the equal sign is the Left Hand Side (LHS). The expression on the right is the Right Hand Side (RHS). In a linear equation, the highest power of the variable appearing in the expression is 1. To solve 2x + 3 = 11, isolate the variable x by performing identical inverse operations on both sides: 2x = 11 - 3 = 8, so x = 8/2 = 4.",
                metadata={"chapter": "2", "topic": "Linear Equations"},
            )
            db.add(chunk1)
            db.commit()
            print(f"   ✓ NCERT RAG Documents seeded ({db.query(Document).count()} documents, {db.query(DocumentChunk).count()} chunks)")

        # 5. Seed Opportunities if empty
        if db.query(Opportunity).count() == 0:
            print("5. Seeding STEM Scholarships & Opportunities...")
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
            print(f"   ✓ STEM Opportunities seeded ({db.query(Opportunity).count()} listings)")

        print("\n" + "═"*75)
        print("✨ DATABASE SUCCESSFULLY PREPARED FOR REAL USERS!")
        print("   • Active Users: 0")
        print("   • Active Classes: 0")
        print("   • Educational Content (NCERT/Questions/Opportunities): READY")
        print("═"*75 + "\n")

    finally:
        db.close()


if __name__ == "__main__":
    purge_and_seed()
