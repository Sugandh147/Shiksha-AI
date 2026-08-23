"""
scripts/ingest_knowledge.py
────────────────────────────
Standalone NCERT Knowledge Base RAG Ingestion & Content Seeding Script for ShikshaAI.

Loads:
  • Subjects & Topics (Class 8 & Class 10 NCERT Math & Science)
  • NCERT Chapter Documents & Text Chunks for RAG Vector Search
  • Diagnostic & Practice Educational Question Bank
  • Educational STEM Opportunity Listings

Leaves 0 Users, 0 Profiles, 0 Classes, and 0 Attempts in the database.

Usage:
  python scripts/ingest_knowledge.py
"""

import os
import sys

# Ensure backend app modules can be imported
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend"))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.db.models import (
    Subject, Topic, Question, QuestionType, DifficultyLevel,
    Document, DocumentChunk, Opportunity
)


def ingest_knowledge():
    print("\n" + "═"*75)
    print("📚 SHIKSHAAI — NCERT RAG KNOWLEDGE BASE INGESTION & CONTENT SEEDING")
    print("═"*75 + "\n")

    # Create tables if not present
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Ingest Subjects & Topics
        print("1. Ingesting NCERT Subjects & Topics...")
        if db.query(Subject).count() == 0:
            math = Subject(name="Mathematics", description="Core K-12 Mathematics", icon="📐", color="#6366f1")
            sci = Subject(name="Science", description="Core K-12 Science", icon="🔬", color="#10b981")
            eng = Subject(name="English", description="Grammar & Reading", icon="📚", color="#ec4899")
            soc = Subject(name="Social Studies", description="History & Civics", icon="🌍", color="#f59e0b")

            db.add_all([math, sci, eng, soc])
            db.flush()

            topics = [
                Topic(subject_id=math.id, name="Fractions & Decimals", description="Rational numbers, fractions, and operations.", grade_level=8, order_index=1),
                Topic(subject_id=math.id, name="Linear Equations", description="Solving linear equations in one variable.", grade_level=8, order_index=2),
                Topic(subject_id=math.id, name="Algebra & Polynomials", description="Algebraic expressions, identities, and factoring.", grade_level=8, order_index=3),
                Topic(subject_id=math.id, name="Quadratic Equations", description="Solving quadratic equations by factoring and formula.", grade_level=10, order_index=4),
                Topic(subject_id=math.id, name="Triangles & Geometry", description="Properties of triangles, congruence, and similarity.", grade_level=8, order_index=5),
                
                Topic(subject_id=sci.id, name="Force & Pressure", description="Types of forces, pressure in fluids, and atmospheric pressure.", grade_level=8, order_index=1),
                Topic(subject_id=sci.id, name="Cell Structure & Function", description="Plant vs animal cells, organelles, and cell division.", grade_level=8, order_index=2),
                Topic(subject_id=sci.id, name="Chemical Effects of Current", description="Electroplating, conductors, and electrolytes.", grade_level=8, order_index=3),
            ]
            db.add_all(topics)
            db.commit()
            print(f"   ✓ Ingested 4 Subjects and {len(topics)} Topics")
        else:
            print(f"   ✓ Subjects & Topics present ({db.query(Subject).count()} subjects, {db.query(Topic).count()} topics)")

        # 2. Ingest NCERT RAG Documents & Text Chunks
        print("\n2. Ingesting NCERT Textbook Chapter Documents & RAG Chunks...")
        if db.query(Document).count() == 0:
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
            print(f"   ✓ Ingested 2 Documents and {len(chunks)} Text Chunks for RAG retrieval")
        else:
            print(f"   ✓ RAG Documents present ({db.query(Document).count()} documents, {db.query(DocumentChunk).count()} text chunks)")

        # 3. Ingest Question Bank
        print("\n3. Ingesting Educational Question Bank...")
        if db.query(Question).count() == 0:
            topics = db.query(Topic).all()
            t_map = {t.name: t for t in topics}

            questions = []
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
                    )
                ])

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
                    )
                ])

            db.add_all(questions)
            db.commit()
            print(f"   ✓ Ingested {len(questions)} Diagnostic & Practice Questions")
        else:
            print(f"   ✓ Question Bank present ({db.query(Question).count()} questions)")

        # 4. Ingest STEM Opportunities
        print("\n4. Ingesting STEM Scholarships & Opportunities...")
        if db.query(Opportunity).count() == 0:
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
            print(f"   ✓ Ingested {len(opps)} STEM Opportunities")
        else:
            print(f"   ✓ Opportunities present ({db.query(Opportunity).count()} listings)")

        print("\n" + "═"*75)
        print("✨ KNOWLEDGE INGESTION COMPLETE! READY FOR REAL USER REGISTRATION.")
        print("═"*75 + "\n")

    finally:
        db.close()


if __name__ == "__main__":
    ingest_knowledge()
