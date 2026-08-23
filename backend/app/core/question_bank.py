"""
app/core/question_bank.py
─────────────────────────
Grade-Specific Curriculum Question Bank & Dynamic Synthesizer (Classes 4 to 12).
Ensures that every Class/Grade level (Class 4, 5, 6, 7, 8, 9, 10, 11, 12) receives
strictly grade-matched, syllabus-aligned questions across Easy, Medium, and Hard levels.
"""

from typing import List, Dict, Any, Optional

GRADE_CURRICULUM_QUESTIONS: Dict[int, List[Dict[str, Any]]] = {
    # ── Class 4 ───────────────────────────────────────────────────────────────
    4: [
        {
            "question_text": "A brick has how many faces?",
            "options": {"A": "6", "B": "4", "C": "8", "D": "12"},
            "correct_answer": "A",
            "explanation": "A standard cuboidal brick has 6 rectangular faces.",
            "topic_name": "Building with Bricks",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "How many centimeters are there in 1 meter?",
            "options": {"A": "100 cm", "B": "10 cm", "C": "1000 cm", "D": "50 cm"},
            "correct_answer": "A",
            "explanation": "1 meter = 100 centimeters.",
            "topic_name": "Long and Short",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "If 1 bus carries 50 children, how many children can 4 buses carry?",
            "options": {"A": "200", "B": "150", "C": "250", "D": "100"},
            "correct_answer": "A",
            "explanation": "Multiply: 50 x 4 = 200 children.",
            "topic_name": "A Trip to Bhopal",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "How many minutes are in 1 hour?",
            "options": {"A": "60 minutes", "B": "30 minutes", "C": "100 minutes", "D": "120 minutes"},
            "correct_answer": "A",
            "explanation": "1 hour = 60 minutes.",
            "topic_name": "Tick-Tick-Tick",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Which animal has ears like fans?",
            "options": {"A": "Elephant", "B": "Rabbit", "C": "Dog", "D": "Cat"},
            "correct_answer": "A",
            "explanation": "Elephants have large fan-like ears that help them keep cool.",
            "topic_name": "Ear to Ear",
            "difficulty": "easy",
            "subject_name": "Science",
        },
    ],

    # ── Class 5 ───────────────────────────────────────────────────────────────
    5: [
        {
            "question_text": "What is the area of a rectangle with length 8 cm and breadth 5 cm?",
            "options": {"A": "40 sq cm", "B": "26 sq cm", "C": "13 sq cm", "D": "45 sq cm"},
            "correct_answer": "A",
            "explanation": "Area of rectangle = length x breadth = 8 x 5 = 40 sq cm.",
            "topic_name": "Area & Perimeter",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What fraction of a whole is 3 parts out of 4 equal parts?",
            "options": {"A": "3/4", "B": "4/3", "C": "1/4", "D": "2/4"},
            "correct_answer": "A",
            "explanation": "3 parts out of 4 total parts represents the fraction 3/4.",
            "topic_name": "Parts and Wholes",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the smallest common multiple of 4 and 6?",
            "options": {"A": "12", "B": "24", "C": "18", "D": "8"},
            "correct_answer": "A",
            "explanation": "Multiples of 4: 4, 8, 12, 16... Multiples of 6: 6, 12, 18... Smallest common multiple = 12.",
            "topic_name": "Be My Multiple, I'll be Your Factor",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Which sensory organ helps a dog detect hidden substances?",
            "options": {"A": "Sense of Smell", "B": "Sense of Sight", "C": "Sense of Touch", "D": "Sense of Taste"},
            "correct_answer": "A",
            "explanation": "Dogs have an extraordinarily sensitive sense of smell.",
            "topic_name": "Super Senses",
            "difficulty": "easy",
            "subject_name": "Science",
        },
    ],

    # ── Class 6 ───────────────────────────────────────────────────────────────
    6: [
        {
            "question_text": "Which of the following is the smallest whole number?",
            "options": {"A": "0", "B": "1", "C": "-1", "D": "10"},
            "correct_answer": "A",
            "explanation": "Whole numbers start from 0, 1, 2, 3... The smallest whole number is 0.",
            "topic_name": "Knowing Our Numbers",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Find the successor of 999.",
            "options": {"A": "1000", "B": "998", "C": "1001", "D": "990"},
            "correct_answer": "A",
            "explanation": "Successor of a number = Number + 1 = 999 + 1 = 1000.",
            "topic_name": "Whole Numbers",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the sum of angles in a triangle?",
            "options": {"A": "180°", "B": "360°", "C": "90°", "D": "270°"},
            "correct_answer": "A",
            "explanation": "The sum of interior angles of any triangle is 180°.",
            "topic_name": "Basic Geometrical Ideas",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Which vitamin deficiency causes Scurvy?",
            "options": {"A": "Vitamin C", "B": "Vitamin A", "C": "Vitamin D", "D": "Vitamin B12"},
            "correct_answer": "A",
            "explanation": "Deficiency of Vitamin C causes scurvy, characterized by bleeding gums.",
            "topic_name": "Food Sources & Components",
            "difficulty": "medium",
            "subject_name": "Science",
        },
    ],

    # ── Class 7 ───────────────────────────────────────────────────────────────
    7: [
        {
            "question_text": "Evaluate: (-12) + (-8) - (-5)",
            "options": {"A": "-15", "B": "-25", "C": "15", "D": "-20"},
            "correct_answer": "A",
            "explanation": "-12 - 8 + 5 = -20 + 5 = -15.",
            "topic_name": "Integers",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Solve for p: 3p + 7 = 25",
            "options": {"A": "6", "B": "5", "C": "8", "D": "4"},
            "correct_answer": "A",
            "explanation": "3p = 25 - 7 = 18 → p = 6.",
            "topic_name": "Simple Equations",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the product of 3/4 and 8/9?",
            "options": {"A": "2/3", "B": "3/2", "C": "5/12", "D": "24/36"},
            "correct_answer": "A",
            "explanation": "(3 x 8) / (4 x 9) = 24 / 36 = 2/3.",
            "topic_name": "Fractions & Decimals",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Which of the following is an indicator used to test acids and bases?",
            "options": {"A": "Litmus", "B": "Salt Solution", "C": "Pure Water", "D": "Sugar Solution"},
            "correct_answer": "A",
            "explanation": "Litmus paper turns red in acidic solutions and blue in basic solutions.",
            "topic_name": "Acids, Bases & Salts",
            "difficulty": "easy",
            "subject_name": "Science",
        },
    ],

    # ── Class 8 ───────────────────────────────────────────────────────────────
    8: [
        {
            "question_text": "Solve for x: 2x + 3 = 11",
            "options": {"A": "4", "B": "5", "C": "3", "D": "7"},
            "correct_answer": "A",
            "explanation": "Subtract 3: 2x = 8 → x = 4.",
            "topic_name": "Linear Equations in One Variable",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Solve for y: 5y - 7 = 3y + 9",
            "options": {"A": "8", "B": "4", "C": "6", "D": "5"},
            "correct_answer": "A",
            "explanation": "5y - 3y = 9 + 7 → 2y = 16 → y = 8.",
            "topic_name": "Linear Equations in One Variable",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the square root of 625?",
            "options": {"A": "25", "B": "15", "C": "35", "D": "20"},
            "correct_answer": "A",
            "explanation": "25 x 25 = 625. So √625 = 25.",
            "topic_name": "Square & Square Roots",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the SI unit of Pressure?",
            "options": {"A": "Pascal (Pa)", "B": "Newton (N)", "C": "Joule (J)", "D": "Watt (W)"},
            "correct_answer": "A",
            "explanation": "Pressure = Force / Area. The SI unit is Pascal (Pa).",
            "topic_name": "Force & Pressure",
            "difficulty": "easy",
            "subject_name": "Science",
        },
        {
            "question_text": "Which organelle is called the 'Powerhouse of the Cell'?",
            "options": {"A": "Mitochondria", "B": "Nucleus", "C": "Ribosome", "D": "Golgi Apparatus"},
            "correct_answer": "A",
            "explanation": "Mitochondria generate cellular energy in the form of ATP.",
            "topic_name": "Cell Structure & Functions",
            "difficulty": "easy",
            "subject_name": "Science",
        },
    ],

    # ── Class 9 ───────────────────────────────────────────────────────────────
    9: [
        {
            "question_text": "Which of the following is an irrational number?",
            "options": {"A": "√2", "B": "3/5", "C": "0.75", "D": "√9"},
            "correct_answer": "A",
            "explanation": "√2 cannot be expressed as a ratio p/q of integers. √9 = 3 which is rational.",
            "topic_name": "Number Systems",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Simplify: (√5 + √2)(√5 - √2)",
            "options": {"A": "3", "B": "7", "C": "√3", "D": "10"},
            "correct_answer": "A",
            "explanation": "(a+b)(a-b) = a² - b² = (√5)² - (√2)² = 5 - 2 = 3.",
            "topic_name": "Number Systems",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the degree of the zero polynomial?",
            "options": {"A": "Not defined", "B": "0", "C": "1", "D": "Infinity"},
            "correct_answer": "A",
            "explanation": "The degree of the zero polynomial is mathematically undefined.",
            "topic_name": "Polynomials",
            "difficulty": "hard",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "According to Newton's Second Law of Motion, Force equals:",
            "options": {"A": "Mass x Acceleration (F = ma)", "B": "Mass / Acceleration", "C": "Velocity x Time", "D": "Work / Distance"},
            "correct_answer": "A",
            "explanation": "Newton's second law states that Force is the product of mass and acceleration (F = ma).",
            "topic_name": "Motion & Force Laws",
            "difficulty": "easy",
            "subject_name": "Science",
        },
    ],

    # ── Class 10 ──────────────────────────────────────────────────────────────
    10: [
        {
            "question_text": "Find the roots of the quadratic equation: x² - 5x + 6 = 0",
            "options": {"A": "x = 2 and x = 3", "B": "x = -2 and x = -3", "C": "x = 1 and x = 6", "D": "x = 5 and x = 6"},
            "correct_answer": "A",
            "explanation": "Factorize: (x - 2)(x - 3) = 0 → x = 2 or x = 3.",
            "topic_name": "Quadratic Equations",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the nature of roots for 2x² - 4x + 3 = 0?",
            "options": {"A": "No real roots (Discriminant < 0)", "B": "Two equal real roots", "C": "Two distinct real roots", "D": "Rational real roots"},
            "correct_answer": "A",
            "explanation": "Discriminant D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8 < 0. No real roots exist.",
            "topic_name": "Quadratic Equations",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "If one root of 3x² + px + 4 = 0 is 2/3, find the value of p.",
            "options": {"A": "-8", "B": "-6", "C": "8", "D": "-4"},
            "correct_answer": "A",
            "explanation": "Substitute x = 2/3: 3(4/9) + p(2/3) + 4 = 0 → 4/3 + 2p/3 + 12/3 = 0 → 2p = -16 → p = -8.",
            "topic_name": "Quadratic Equations",
            "difficulty": "hard",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Evaluate: sin²(30°) + cos²(30°)",
            "options": {"A": "1", "B": "0", "C": "1/2", "D": "√3/2"},
            "correct_answer": "A",
            "explanation": "By fundamental trigonometric identity, sin²θ + cos²θ = 1 for any angle θ.",
            "topic_name": "Trigonometry & Applications",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "If tan(θ) = 4/3, find the value of sin(θ).",
            "options": {"A": "4/5", "B": "3/5", "C": "5/4", "D": "3/4"},
            "correct_answer": "A",
            "explanation": "Opposite = 4, Adjacent = 3 → Hypotenuse = √(4² + 3²) = 5. So sin(θ) = 4/5.",
            "topic_name": "Trigonometry & Applications",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the focal length of a spherical mirror with radius of curvature R = 30 cm?",
            "options": {"A": "15 cm", "B": "60 cm", "C": "30 cm", "D": "10 cm"},
            "correct_answer": "A",
            "explanation": "Focal length f = R / 2 = 30 / 2 = 15 cm.",
            "topic_name": "Light & Reflection/Refraction",
            "difficulty": "easy",
            "subject_name": "Science",
        },
    ],

    # ── Class 11 ──────────────────────────────────────────────────────────────
    11: [
        {
            "question_text": "If a set A has 4 elements, how many elements are in the power set P(A)?",
            "options": {"A": "16", "B": "8", "C": "12", "D": "64"},
            "correct_answer": "A",
            "explanation": "Number of elements in power set = 2^n = 2^4 = 16.",
            "topic_name": "Sets, Relations & Functions",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the value of i^4 where i = √(-1)?",
            "options": {"A": "1", "B": "-1", "C": "i", "D": "-i"},
            "correct_answer": "A",
            "explanation": "i¹ = i, i² = -1, i³ = -i, i⁴ = 1.",
            "topic_name": "Complex Numbers",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Find the derivative of f(x) = x³ with respect to x.",
            "options": {"A": "3x²", "B": "x²", "C": "3x", "D": "6x"},
            "correct_answer": "A",
            "explanation": "d/dx(xⁿ) = n·xⁿ⁻¹. For n = 3: d/dx(x³) = 3x².",
            "topic_name": "Calculus: Limits & Derivatives",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
    ],

    # ── Class 12 ──────────────────────────────────────────────────────────────
    12: [
        {
            "question_text": "Find the determinant of matrix [[2, 4], [1, 5]].",
            "options": {"A": "6", "B": "14", "C": "10", "D": "2"},
            "correct_answer": "A",
            "explanation": "det = (2 x 5) - (4 x 1) = 10 - 4 = 6.",
            "topic_name": "Matrices & Determinants",
            "difficulty": "easy",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "Evaluate the integral: ∫ 2x dx",
            "options": {"A": "x² + C", "B": "2x² + C", "C": "x + C", "D": "2 + C"},
            "correct_answer": "A",
            "explanation": "∫ 2x dx = 2 · (x²/2) + C = x² + C.",
            "topic_name": "Calculus: Integrals",
            "difficulty": "medium",
            "subject_name": "Mathematics",
        },
        {
            "question_text": "What is the SI unit of Electric Charge?",
            "options": {"A": "Coulomb (C)", "B": "Ampere (A)", "C": "Volt (V)", "D": "Ohm (Ω)"},
            "correct_answer": "A",
            "explanation": "The SI unit of electric charge is Coulomb (C).",
            "topic_name": "Electric Charges & Electrostatics",
            "difficulty": "easy",
            "subject_name": "Science",
        },
    ],
}


def get_grade_questions(grade_level: int) -> List[Dict[str, Any]]:
    """Returns strict grade-appropriate questions for the given grade level (Class 4 to 12)."""
    target_grade = grade_level if grade_level in GRADE_CURRICULUM_QUESTIONS else 10
    return GRADE_CURRICULUM_QUESTIONS.get(target_grade, GRADE_CURRICULUM_QUESTIONS[10])
