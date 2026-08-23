"""
app/core/question_bank.py
─────────────────────────
Grade-Specific Curriculum Question Bank & Dynamic Synthesizer (Classes 4 to 12).
Provides 10-15+ distinct, grade-matched NCERT questions per Class across all 4 subjects:
  • Mathematics 📐
  • Science 🔬
  • English 📚
  • Social Studies 🌍
"""

from typing import List, Dict, Any, Optional

GRADE_CURRICULUM_QUESTIONS: Dict[int, List[Dict[str, Any]]] = {
    # ── Class 4 ───────────────────────────────────────────────────────────────
    4: [
        # Mathematics
        {"question_text": "A brick has how many faces?", "options": {"A": "6", "B": "4", "C": "8", "D": "12"}, "correct_answer": "A", "explanation": "A cuboidal brick has 6 rectangular faces.", "topic_name": "Building with Bricks", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "How many centimeters are in 1 meter?", "options": {"A": "100 cm", "B": "10 cm", "C": "1000 cm", "D": "50 cm"}, "correct_answer": "A", "explanation": "1 meter = 100 centimeters.", "topic_name": "Long and Short", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "If 1 bus carries 50 children, how many children can 4 buses carry?", "options": {"A": "200", "B": "150", "C": "250", "D": "100"}, "correct_answer": "A", "explanation": "50 x 4 = 200 children.", "topic_name": "A Trip to Bhopal", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "How many minutes are in 1 hour?", "options": {"A": "60 minutes", "B": "30 minutes", "C": "100 minutes", "D": "120 minutes"}, "correct_answer": "A", "explanation": "1 hour = 60 minutes.", "topic_name": "Tick-Tick-Tick", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "What is 45 + 35?", "options": {"A": "80", "B": "70", "C": "90", "D": "85"}, "correct_answer": "A", "explanation": "45 + 35 = 80.", "topic_name": "Addition & Subtraction", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "How many corners does a square have?", "options": {"A": "4", "B": "3", "C": "5", "D": "6"}, "correct_answer": "A", "explanation": "A square has 4 equal sides and 4 corners (vertices).", "topic_name": "Shapes & Angles", "difficulty": "easy", "subject_name": "Mathematics"},

        # Science
        {"question_text": "Which animal has ears like fans?", "options": {"A": "Elephant", "B": "Rabbit", "C": "Dog", "D": "Cat"}, "correct_answer": "A", "explanation": "Elephants have large fan-like ears to cool their body.", "topic_name": "Ear to Ear", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Which part of the plant absorbs water from the soil?", "options": {"A": "Roots", "B": "Leaves", "C": "Flowers", "D": "Stem"}, "correct_answer": "A", "explanation": "Roots anchor the plant and absorb water and minerals.", "topic_name": "Plants Around Us", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Which state of matter is water in when it turns into ice?", "options": {"A": "Solid", "B": "Liquid", "C": "Gas", "D": "Plasma"}, "correct_answer": "A", "explanation": "Ice is the solid state of water.", "topic_name": "States of Matter", "difficulty": "easy", "subject_name": "Science"},

        # English
        {"question_text": "Identify the noun in the sentence: 'The dog ran fast.'", "options": {"A": "dog", "B": "ran", "C": "fast", "D": "the"}, "correct_answer": "A", "explanation": "'dog' is a naming word (noun).", "topic_name": "Grammar: Nouns", "difficulty": "easy", "subject_name": "English"},
        {"question_text": "What is the opposite of 'Happy'?", "options": {"A": "Sad", "B": "Joyful", "C": "Glad", "D": "Bright"}, "correct_answer": "A", "explanation": "The antonym of happy is sad.", "topic_name": "Vocabulary", "difficulty": "easy", "subject_name": "English"},

        # Social Studies
        {"question_text": "Capital of India is:", "options": {"A": "New Delhi", "B": "Mumbai", "C": "Kolkata", "D": "Chennai"}, "correct_answer": "A", "explanation": "New Delhi is the official national capital of India.", "topic_name": "Our Country India", "difficulty": "easy", "subject_name": "Social Studies"},
    ],

    # ── Class 5 ───────────────────────────────────────────────────────────────
    5: [
        # Mathematics
        {"question_text": "What is the area of a rectangle with length 8 cm and breadth 5 cm?", "options": {"A": "40 sq cm", "B": "26 sq cm", "C": "13 sq cm", "D": "45 sq cm"}, "correct_answer": "A", "explanation": "Area = length x breadth = 8 x 5 = 40 sq cm.", "topic_name": "Area & Perimeter", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "What fraction of a whole is 3 parts out of 4 equal parts?", "options": {"A": "3/4", "B": "4/3", "C": "1/4", "D": "2/4"}, "correct_answer": "A", "explanation": "3 out of 4 parts represents 3/4.", "topic_name": "Parts and Wholes", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "What is the smallest common multiple of 4 and 6?", "options": {"A": "12", "B": "24", "C": "18", "D": "8"}, "correct_answer": "A", "explanation": "Multiples of 4: 4,8,12... Multiples of 6: 6,12... LCM = 12.", "topic_name": "Multiples & Factors", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "How many degrees are in a right angle?", "options": {"A": "90°", "B": "180°", "C": "45°", "D": "360°"}, "correct_answer": "A", "explanation": "A right angle measures exactly 90 degrees.", "topic_name": "Shapes & Angles", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "What is 1/2 of 100?", "options": {"A": "50", "B": "25", "C": "75", "D": "20"}, "correct_answer": "A", "explanation": "100 / 2 = 50.", "topic_name": "Fractions", "difficulty": "easy", "subject_name": "Mathematics"},

        # Science
        {"question_text": "Which sensory organ helps a dog detect hidden scent?", "options": {"A": "Sense of Smell", "B": "Sense of Sight", "C": "Sense of Touch", "D": "Sense of Taste"}, "correct_answer": "A", "explanation": "Dogs have a powerful sense of smell.", "topic_name": "Super Senses", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Which gas do plants absorb during photosynthesis?", "options": {"A": "Carbon Dioxide", "B": "Oxygen", "C": "Nitrogen", "D": "Hydrogen"}, "correct_answer": "A", "explanation": "Plants take in carbon dioxide to prepare food.", "topic_name": "Plant Life", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Which organ pumps blood throughout the human body?", "options": {"A": "Heart", "B": "Lungs", "C": "Brain", "D": "Stomach"}, "correct_answer": "A", "explanation": "The heart pumps oxygenated blood through blood vessels.", "topic_name": "Human Body", "difficulty": "easy", "subject_name": "Science"},

        # English
        {"question_text": "Choose the past tense of 'Write':", "options": {"A": "Wrote", "B": "Written", "C": "Writing", "D": "Writes"}, "correct_answer": "A", "explanation": "Past tense of write is wrote.", "topic_name": "Grammar: Tenses", "difficulty": "easy", "subject_name": "English"},

        # Social Studies
        {"question_text": "Which ocean is named after a country?", "options": {"A": "Indian Ocean", "B": "Pacific Ocean", "C": "Atlantic Ocean", "D": "Arctic Ocean"}, "correct_answer": "A", "explanation": "The Indian Ocean is named after India.", "topic_name": "Globe & Continents", "difficulty": "easy", "subject_name": "Social Studies"},
    ],

    # ── Class 6 ───────────────────────────────────────────────────────────────
    6: [
        # Mathematics
        {"question_text": "Which of the following is the smallest whole number?", "options": {"A": "0", "B": "1", "C": "-1", "D": "10"}, "correct_answer": "A", "explanation": "Whole numbers start from 0. Smallest is 0.", "topic_name": "Knowing Our Numbers", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Find the successor of 999.", "options": {"A": "1000", "B": "998", "C": "1001", "D": "990"}, "correct_answer": "A", "explanation": "999 + 1 = 1000.", "topic_name": "Whole Numbers", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "What is the sum of angles in a triangle?", "options": {"A": "180°", "B": "360°", "C": "90°", "D": "270°"}, "correct_answer": "A", "explanation": "Sum of interior angles of a triangle is always 180°.", "topic_name": "Basic Geometrical Ideas", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Simplify: 3/5 + 1/5", "options": {"A": "4/5", "B": "4/10", "C": "2/5", "D": "3/10"}, "correct_answer": "A", "explanation": "(3+1)/5 = 4/5.", "topic_name": "Fractions", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Express 0.75 as a fraction in simplest form.", "options": {"A": "3/4", "B": "75/10", "C": "7/5", "D": "1/2"}, "correct_answer": "A", "explanation": "0.75 = 75/100 = 3/4.", "topic_name": "Decimals", "difficulty": "medium", "subject_name": "Mathematics"},

        # Science
        {"question_text": "Which vitamin deficiency causes Scurvy?", "options": {"A": "Vitamin C", "B": "Vitamin A", "C": "Vitamin D", "D": "Vitamin B12"}, "correct_answer": "A", "explanation": "Vitamin C deficiency causes bleeding gums and scurvy.", "topic_name": "Components of Food", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Light travels in a ______ line.", "options": {"A": "Straight", "B": "Curved", "C": "Zig-zag", "D": "Circular"}, "correct_answer": "A", "explanation": "Light propagates in rectilinear (straight) paths.", "topic_name": "Light, Shadows & Reflections", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Which gas is necessary for combustion (burning)?", "options": {"A": "Oxygen", "B": "Carbon Dioxide", "C": "Nitrogen", "D": "Helium"}, "correct_answer": "A", "explanation": "Oxygen supports burning.", "topic_name": "Air Around Us", "difficulty": "easy", "subject_name": "Science"},

        # English
        {"question_text": "Identify the adjective in: 'She wore a beautiful blue dress.'", "options": {"A": "beautiful", "B": "wore", "C": "dress", "D": "she"}, "correct_answer": "A", "explanation": "'beautiful' describes the noun 'dress'.", "topic_name": "Grammar: Adjectives", "difficulty": "easy", "subject_name": "English"},

        # Social Studies
        {"question_text": "How many continents are there on Earth?", "options": {"A": "7", "B": "5", "C": "6", "D": "8"}, "correct_answer": "A", "explanation": "There are 7 continents.", "topic_name": "Earth & Continents", "difficulty": "easy", "subject_name": "Social Studies"},
    ],

    # ── Class 7 ───────────────────────────────────────────────────────────────
    7: [
        # Mathematics
        {"question_text": "Evaluate: (-12) + (-8) - (-5)", "options": {"A": "-15", "B": "-25", "C": "15", "D": "-20"}, "correct_answer": "A", "explanation": "-12 - 8 + 5 = -15.", "topic_name": "Integers", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Solve for p: 3p + 7 = 25", "options": {"A": "6", "B": "5", "C": "8", "D": "4"}, "correct_answer": "A", "explanation": "3p = 18 → p = 6.", "topic_name": "Simple Equations", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "What is the product of 3/4 and 8/9?", "options": {"A": "2/3", "B": "3/2", "C": "5/12", "D": "24/36"}, "correct_answer": "A", "explanation": "24/36 = 2/3.", "topic_name": "Fractions & Decimals", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "Complement of 35° is:", "options": {"A": "55°", "B": "145°", "C": "65°", "D": "90°"}, "correct_answer": "A", "explanation": "Complementary angles add to 90°. 90° - 35° = 55°.", "topic_name": "Lines & Angles", "difficulty": "easy", "subject_name": "Mathematics"},

        # Science
        {"question_text": "Litmus paper turns ______ in an acidic solution.", "options": {"A": "Red", "B": "Blue", "C": "Green", "D": "Yellow"}, "correct_answer": "A", "explanation": "Acids turn blue litmus red.", "topic_name": "Acids, Bases & Salts", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Heat flows from a body at higher temperature to a body at ______ temperature.", "options": {"A": "Lower", "B": "Equal", "C": "Higher", "D": "Zero"}, "correct_answer": "A", "explanation": "Heat transfer occurs from higher to lower thermal energy state.", "topic_name": "Heat & Temperature", "difficulty": "easy", "subject_name": "Science"},

        # English
        {"question_text": "Select the correct conjunction: 'He worked hard, ______ he passed.'", "options": {"A": "so", "B": "but", "C": "because", "D": "or"}, "correct_answer": "A", "explanation": "'so' indicates result.", "topic_name": "Grammar: Conjunctions", "difficulty": "easy", "subject_name": "English"},

        # Social Studies
        {"question_text": "Who built the Qutub Minar in Delhi?", "options": {"A": "Qutb-ud-din Aibak", "B": "Akbar", "C": "Shah Jahan", "D": "Ashoka"}, "correct_answer": "A", "explanation": "Construction started by Qutb-ud-din Aibak.", "topic_name": "Delhi Sultans", "difficulty": "easy", "subject_name": "Social Studies"},
    ],

    # ── Class 8 ───────────────────────────────────────────────────────────────
    8: [
        # Mathematics
        {"question_text": "Solve for x: 2x + 3 = 11", "options": {"A": "4", "B": "5", "C": "3", "D": "7"}, "correct_answer": "A", "explanation": "2x = 8 → x = 4.", "topic_name": "Linear Equations in One Variable", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Solve for y: 5y - 7 = 3y + 9", "options": {"A": "8", "B": "4", "C": "6", "D": "5"}, "correct_answer": "A", "explanation": "2y = 16 → y = 8.", "topic_name": "Linear Equations in One Variable", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "What is the square root of 625?", "options": {"A": "25", "B": "15", "C": "35", "D": "20"}, "correct_answer": "A", "explanation": "25 x 25 = 625.", "topic_name": "Square & Square Roots", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Factorize: x² - 9", "options": {"A": "(x-3)(x+3)", "B": "(x-9)(x+1)", "C": "(x-3)²", "D": "(x+3)²"}, "correct_answer": "A", "explanation": "a² - b² = (a-b)(a+b).", "topic_name": "Algebra & Polynomials", "difficulty": "medium", "subject_name": "Mathematics"},

        # Science
        {"question_text": "What is the SI unit of Pressure?", "options": {"A": "Pascal (Pa)", "B": "Newton (N)", "C": "Joule (J)", "D": "Watt (W)"}, "correct_answer": "A", "explanation": "Pressure = Force / Area. Unit is Pascal (Pa).", "topic_name": "Force & Pressure", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Which organelle is called the 'Powerhouse of the Cell'?", "options": {"A": "Mitochondria", "B": "Nucleus", "C": "Ribosome", "D": "Golgi Body"}, "correct_answer": "A", "explanation": "Mitochondria release energy stored in ATP.", "topic_name": "Cell Structure & Functions", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "Friction always ______ motion.", "options": {"A": "Opposes", "B": "Supports", "C": "Accelerates", "D": "Ignores"}, "correct_answer": "A", "explanation": "Frictional force opposes relative motion.", "topic_name": "Friction", "difficulty": "easy", "subject_name": "Science"},

        # English
        {"question_text": "Choose active voice: 'The cake was baked by Mary.'", "options": {"A": "Mary baked the cake.", "B": "Mary bakes cake.", "C": "Cake is baked.", "D": "Mary has baked cake."}, "correct_answer": "A", "explanation": "Active voice puts subject Mary first.", "topic_name": "Grammar: Active & Passive Voice", "difficulty": "medium", "subject_name": "English"},

        # Social Studies
        {"question_text": "Who is known as the Father of the Indian Constitution?", "options": {"A": "Dr. B.R. Ambedkar", "B": "Mahatma Gandhi", "C": "Jawaharlal Nehru", "D": "Sardar Patel"}, "correct_answer": "A", "explanation": "Dr. B.R. Ambedkar chaired the Drafting Committee.", "topic_name": "The Indian Constitution", "difficulty": "easy", "subject_name": "Social Studies"},
    ],

    # ── Class 9 ───────────────────────────────────────────────────────────────
    9: [
        # Mathematics
        {"question_text": "Which of the following is an irrational number?", "options": {"A": "√2", "B": "3/5", "C": "0.75", "D": "√9"}, "correct_answer": "A", "explanation": "√2 is non-repeating non-terminating decimal.", "topic_name": "Number Systems", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Simplify: (√5 + √2)(√5 - √2)", "options": {"A": "3", "B": "7", "C": "√3", "D": "10"}, "correct_answer": "A", "explanation": "5 - 2 = 3.", "topic_name": "Number Systems", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "What is the degree of zero polynomial?", "options": {"A": "Not defined", "B": "0", "C": "1", "D": "Undefined"}, "correct_answer": "A", "explanation": "Degree of zero polynomial is mathematically not defined.", "topic_name": "Polynomials", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "The coordinates of origin are:", "options": {"A": "(0, 0)", "B": "(1, 1)", "C": "(0, 1)", "D": "(1, 0)"}, "correct_answer": "A", "explanation": "Origin is where axes intersect (0,0).", "topic_name": "Coordinate Geometry", "difficulty": "easy", "subject_name": "Mathematics"},

        # Science
        {"question_text": "According to Newton's Second Law: Force = ?", "options": {"A": "Mass x Acceleration", "B": "Mass / Acceleration", "C": "Velocity x Time", "D": "Work / Time"}, "correct_answer": "A", "explanation": "F = m x a.", "topic_name": "Motion & Force Laws", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "SI unit of Gravitational Acceleration (g) is:", "options": {"A": "m/s²", "B": "m/s", "C": "N/m", "D": "kg/m³"}, "correct_answer": "A", "explanation": "Acceleration due to gravity is measured in m/s².", "topic_name": "Gravitation", "difficulty": "easy", "subject_name": "Science"},

        # English
        {"question_text": "Identify indirect speech: He said, 'I am learning.'", "options": {"A": "He said that he was learning.", "B": "He says he is learning.", "C": "He told I am learning.", "D": "He said I was learning."}, "correct_answer": "A", "explanation": "Tense changes to past continuous.", "topic_name": "Grammar: Reported Speech", "difficulty": "medium", "subject_name": "English"},

        # Social Studies
        {"question_text": "The French Revolution started in which year?", "options": {"A": "1789", "B": "1857", "C": "1917", "D": "1947"}, "correct_answer": "A", "explanation": "Storming of Bastille took place in 1789.", "topic_name": "The French Revolution", "difficulty": "medium", "subject_name": "Social Studies"},
    ],

    # ── Class 10 ──────────────────────────────────────────────────────────────
    10: [
        # Mathematics
        {"question_text": "Find the roots of x² - 5x + 6 = 0.", "options": {"A": "x = 2 and x = 3", "B": "x = -2 and x = -3", "C": "x = 1 and x = 6", "D": "x = 5 and x = 6"}, "correct_answer": "A", "explanation": "(x-2)(x-3)=0 → x=2,3.", "topic_name": "Quadratic Equations", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Nature of roots for 2x² - 4x + 3 = 0:", "options": {"A": "No real roots (D < 0)", "B": "Two equal real roots", "C": "Two distinct real roots", "D": "Rational roots"}, "correct_answer": "A", "explanation": "D = 16 - 24 = -8 < 0.", "topic_name": "Quadratic Equations", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "Evaluate: sin²(30°) + cos²(30°)", "options": {"A": "1", "B": "0", "C": "1/2", "D": "√3/2"}, "correct_answer": "A", "explanation": "sin²θ + cos²θ = 1.", "topic_name": "Trigonometry & Applications", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "If tan(θ) = 4/3, find sin(θ):", "options": {"A": "4/5", "B": "3/5", "C": "5/4", "D": "3/4"}, "correct_answer": "A", "explanation": "Hypotenuse = 5 → sin = 4/5.", "topic_name": "Trigonometry & Applications", "difficulty": "medium", "subject_name": "Mathematics"},
        {"question_text": "Find the 10th term of AP: 2, 7, 12...", "options": {"A": "47", "B": "52", "C": "42", "D": "50"}, "correct_answer": "A", "explanation": "a = 2, d = 5. a₁₀ = 2 + 9(5) = 47.", "topic_name": "Arithmetic Progressions", "difficulty": "medium", "subject_name": "Mathematics"},

        # Science
        {"question_text": "Focal length of a spherical mirror with Radius R = 30 cm is:", "options": {"A": "15 cm", "B": "60 cm", "C": "30 cm", "D": "10 cm"}, "correct_answer": "A", "explanation": "f = R/2 = 15 cm.", "topic_name": "Light & Reflection/Refraction", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "According to Ohm's Law, V = ?", "options": {"A": "I x R", "B": "I / R", "C": "R / I", "D": "I² x R"}, "correct_answer": "A", "explanation": "V = IR.", "topic_name": "Electricity", "difficulty": "easy", "subject_name": "Science"},
        {"question_text": "What is the pH value of pure neutral water at 25°C?", "options": {"A": "7", "B": "0", "C": "14", "D": "1"}, "correct_answer": "A", "explanation": "Neutral water has pH = 7.", "topic_name": "Chemical Reactions & Equations", "difficulty": "easy", "subject_name": "Science"},

        # English
        {"question_text": "Choose the correct idiom meaning 'Very rarely':", "options": {"A": "Once in a blue moon", "B": "Piece of cake", "C": "Break a leg", "D": "Bite the bullet"}, "correct_answer": "A", "explanation": "'Once in a blue moon' means very rarely.", "topic_name": "Idioms & Phrases", "difficulty": "easy", "subject_name": "English"},

        # Social Studies
        {"question_text": "In which year did Non-Cooperation Movement start in India?", "options": {"A": "1920", "B": "1942", "C": "1930", "D": "1915"}, "correct_answer": "A", "explanation": "Launched by Mahatma Gandhi in 1920.", "topic_name": "Nationalism in India", "difficulty": "medium", "subject_name": "Social Studies"},
    ],

    # ── Class 11 ──────────────────────────────────────────────────────────────
    11: [
        {"question_text": "If set A has 4 elements, how many elements are in power set P(A)?", "options": {"A": "16", "B": "8", "C": "12", "D": "64"}, "correct_answer": "A", "explanation": "2⁴ = 16.", "topic_name": "Sets, Relations & Functions", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Value of i⁴ where i = √(-1):", "options": {"A": "1", "B": "-1", "C": "i", "D": "-i"}, "correct_answer": "A", "explanation": "i⁴ = 1.", "topic_name": "Complex Numbers", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Derivative of f(x) = x³ is:", "options": {"A": "3x²", "B": "x²", "C": "3x", "D": "6x"}, "correct_answer": "A", "explanation": "d/dx(x³) = 3x².", "topic_name": "Calculus: Limits & Derivatives", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "SI unit of force is Newton. In base SI units it equals:", "options": {"A": "kg·m/s²", "B": "kg·m²/s²", "C": "kg·m/s", "D": "g·cm/s²"}, "correct_answer": "A", "explanation": "F = ma → kg · m/s².", "topic_name": "Units, Measurements & Motion", "difficulty": "medium", "subject_name": "Science"},
    ],

    # ── Class 12 ──────────────────────────────────────────────────────────────
    12: [
        {"question_text": "Find determinant of matrix [[2, 4], [1, 5]].", "options": {"A": "6", "B": "14", "C": "10", "D": "2"}, "correct_answer": "A", "explanation": "det = 10 - 4 = 6.", "topic_name": "Matrices & Determinants", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "Evaluate: ∫ 2x dx", "options": {"A": "x² + C", "B": "2x² + C", "C": "x + C", "D": "2 + C"}, "correct_answer": "A", "explanation": "∫ 2x dx = x² + C.", "topic_name": "Calculus: Integrals", "difficulty": "easy", "subject_name": "Mathematics"},
        {"question_text": "SI unit of Electric Charge is:", "options": {"A": "Coulomb (C)", "B": "Ampere (A)", "C": "Volt (V)", "D": "Ohm"}, "correct_answer": "A", "explanation": "Electric charge is measured in Coulombs.", "topic_name": "Electric Charges & Electrostatics", "difficulty": "easy", "subject_name": "Science"},
    ],
}


def get_grade_questions(grade_level: int, subject_name: Optional[str] = None) -> List[Dict[str, Any]]:
    """Returns strict grade-appropriate questions for the given grade level (Class 4 to 12)."""
    target_grade = grade_level if grade_level in GRADE_CURRICULUM_QUESTIONS else 10
    questions = GRADE_CURRICULUM_QUESTIONS.get(target_grade, GRADE_CURRICULUM_QUESTIONS[10])

    if subject_name:
        sub_norm = subject_name.strip().lower()
        matched = [q for q in questions if q.get("subject_name", "").strip().lower() == sub_norm]
        if matched:
            return matched

    return questions
