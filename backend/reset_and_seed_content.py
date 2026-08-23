"""
reset_and_seed_content.py
──────────────────────────
Purges all fictional/demo user data from ShikshaAI database and populates educational content:
  • Subjects & Multi-Grade Topics (Classes 4-12)
  • Comprehensive Grade-Specific Question Bank (Classes 4-12)
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
from app.core.question_bank import GRADE_CURRICULUM_QUESTIONS


def purge_and_seed():
    print("\n" + "="*75)
    print("SHIKSHAAI - PURGING DEMO USERS & SEEDING PURE EDUCATIONAL CONTENT (CLASSES 4-12)")
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

        # 2. Seed Subjects & Multi-Grade Topics (Classes 4-12)
        print("2. Seeding Subjects & Multi-Grade Curriculum Topics (Classes 4-12)...")
        math = Subject(name="Mathematics", description="Core K-12 Mathematics", icon="📐", color="#6366f1")
        sci = Subject(name="Science", description="Core K-12 Science", icon="🔬", color="#10b981")
        eng = Subject(name="English", description="Grammar & Reading", icon="📚", color="#ec4899")
        soc = Subject(name="Social Studies", description="History & Civics", icon="🌍", color="#f59e0b")

        db.add_all([math, sci, eng, soc])
        db.flush()

        subjects_map = {
            "Mathematics": math,
            "Science": sci,
            "English": eng,
            "Social Studies": soc,
        }

        # Dynamically seed Topics and Questions for Classes 4 through 12
        print("3. Seeding Grade-Specific Question Bank (Classes 4-12)...")
        question_count = 0
        topic_map = {}

        for grade, q_list in GRADE_CURRICULUM_QUESTIONS.items():
            for item in q_list:
                sub_name = item.get("subject_name", "Mathematics")
                subj = subjects_map.get(sub_name, math)
                top_name = item.get("topic_name", "Core Concepts")

                top_key = f"{top_name}_G{grade}"
                if top_key not in topic_map:
                    t = Topic(
                        subject_id=subj.id,
                        name=top_name,
                        grade_level=grade,
                        order_index=len(topic_map) + 1,
                    )
                    db.add(t)
                    db.flush()
                    topic_map[top_key] = t

                target_topic = topic_map[top_key]

                diff_enum = DifficultyLevel.easy
                d_str = item.get("difficulty", "easy").lower()
                if d_str == "medium":
                    diff_enum = DifficultyLevel.medium
                elif d_str == "hard":
                    diff_enum = DifficultyLevel.hard

                q = Question(
                    subject_id=subj.id,
                    topic_id=target_topic.id,
                    question_text=item["question_text"],
                    question_type=QuestionType.mcq,
                    difficulty=diff_enum,
                    options=item["options"],
                    correct_answer=item["correct_answer"],
                    explanation=item["explanation"],
                    grade_level=grade,
                    is_diagnostic=True,
                )
                db.add(q)
                question_count += 1

        db.commit()
        print(f"   [OK] Subjects, Topics ({len(topic_map)}) & Questions ({question_count}) seeded across Classes 4 to 12")

        # 4. Seed NCERT RAG Documents
        print("4. Seeding NCERT Knowledge Base RAG Documents...")
        t10_quad = db.query(Topic).filter(Topic.name == "Quadratic Equations", Topic.grade_level == 10).first()
        t8_lin = db.query(Topic).filter(Topic.grade_level == 8).first()

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
                benefit="Monthly stipend of Rs 5,000 - Rs 7,000 + annual contingency grant.",
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
                benefit="Rs 10,000 award for prototype building + national showcase.",
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
        print("SHIKSHAAI DATABASE READY! 0 USER PROFILES, ALL CONTENT SEEDED FOR CLASSES 4-12")
        print("="*75 + "\n")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error during purging and seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    purge_and_seed()
