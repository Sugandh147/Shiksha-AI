"""
app/routers/tutor.py
────────────────────
AI Tutor API router handling grounded RAG chat interactions.
Endpoint: POST /tutor/chat
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, SkillMastery, Topic, ChatSession, ChatMessage
from app.dependencies import require_student
from app.core.rag_engine import RAGEngine
from app.schemas.tutor import TutorChatRequest, TutorChatResponse, SourceCitation

router = APIRouter(prefix="/tutor", tags=["AI Tutor (RAG)"])


from app.core.languages import get_supported_languages_list


@router.get("/languages")
def get_languages():
    """Get active supported languages registry for AI Tutor explanation selection."""
    return get_supported_languages_list()


@router.post("/chat", response_model=TutorChatResponse)
def chat_with_ai_tutor(
    payload: TutorChatRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    POST /tutor/chat
    Process student question using Retrieval-Augmented Generation (RAG):
      1. Fetch student's weak topics (< 70% mastery).
      2. Perform vector search over educational knowledge base document chunks.
      3. Adapt explanation language dynamically based on student preference (English, Hindi, Hinglish).
      4. Ground response with step-by-step reasoning, example, follow-up, and citations.
      5. Persist conversation in ChatSession & ChatMessage DB records.
    """
    if not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty.",
        )

    # Update preferred language in student user record if provided
    if payload.language:
        current_user.preferred_language = payload.language
        if current_user.student_profile:
            current_user.student_profile.preferred_language = payload.language
        db.commit()

    target_lang = payload.language or current_user.preferred_language or "en"

    # 1. Fetch student's weak topics (< 70% mastery)
    weak_masteries = (
        db.query(Topic.name)
        .join(SkillMastery, SkillMastery.topic_id == Topic.id)
        .filter(SkillMastery.student_id == current_user.id, SkillMastery.mastery_score < 70.0)
        .all()
    )
    weak_topic_names = [wm[0] for wm in weak_masteries]

    # 2. Get or create ChatSession
    session = None
    if payload.session_id:
        session = (
            db.query(ChatSession)
            .filter(ChatSession.id == payload.session_id, ChatSession.student_id == current_user.id)
            .first()
        )

    if not session:
        session = ChatSession(
            student_id=current_user.id,
            topic_name=payload.topic_name or "Mathematics General",
        )
        db.add(session)
        db.flush()

    # 3. Generate grounded RAG response
    rag_result = RAGEngine.generate_tutor_response(
        db=db,
        student=current_user,
        weak_topics=weak_topic_names,
        user_message=payload.message,
        modifier=payload.modifier,
        language=target_lang,
    )

    # 4. Save user message to database
    user_msg = ChatMessage(
        session_id=session.id,
        sender="user",
        content=payload.message,
    )
    db.add(user_msg)

    # 5. Save assistant response to database
    ai_msg = ChatMessage(
        session_id=session.id,
        sender="assistant",
        content=rag_result["explanation"],
        sources=rag_result["sources"],
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    # Format sources for response payload
    sources_payload = [
        SourceCitation(
            title=s["title"],
            source_url=s["source_url"],
            chunk_text=s["chunk_text"],
            relevance_score=s["relevance_score"],
        )
        for s in rag_result["sources"]
    ]

    from app.schemas.tutor import VideoResource
    video_payload = [
        VideoResource(
            title=v["title"],
            channel_name=v["channel_name"],
            video_url=v["video_url"],
            thumbnail_url=v.get("thumbnail_url"),
        )
        for v in rag_result.get("video_resources", [])
    ]

    return TutorChatResponse(
        session_id=session.id,
        message_id=ai_msg.id,
        explanation=rag_result["explanation"],
        step_by_step=rag_result["step_by_step"],
        example=rag_result["example"],
        follow_up=rag_result["follow_up"],
        sources=sources_payload,
        video_resources=video_payload,
    )


from fastapi import File, Form, UploadFile
from app.core.vision_engine import VisionEngine
from app.schemas.tutor import ImageQuestionSolverResponse


@router.post("/scan-question", response_model=ImageQuestionSolverResponse)
async def scan_and_solve_question_image(
    file: UploadFile = File(...),
    topic_name: str = Form(None),
    language: str = Form("en"),
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    POST /tutor/scan-question
    Upload printed or handwritten mathematics question image:
      1. Extract question text & formulas using Vision AI model.
      2. Perform RAG vector context retrieval over NCERT knowledge base.
      3. Return structured solution: Problem, Concept, Steps, Answer, Verification, Similar Question.
    """
    # Security: File type & size validation
    ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/pjpeg"}
    MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

    if file.content_type and file.content_type.lower() not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PNG, JPEG, and WebP images are allowed.",
        )

    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum limit of 5 MB.",
        )

    # Fetch weak topics
    weak_masteries = (
        db.query(Topic.name)
        .join(SkillMastery, SkillMastery.topic_id == Topic.id)
        .filter(SkillMastery.student_id == current_user.id, SkillMastery.mastery_score < 70.0)
        .all()
    )
    weak_topic_names = [wm[0] for wm in weak_masteries]

    target_lang = language or current_user.preferred_language or "en"

    result = VisionEngine.process_question_image(
        image_bytes=image_bytes,
        content_type=file.content_type or "image/jpeg",
        db=db,
        student=current_user,
        weak_topics=weak_topic_names,
        topic_name=topic_name,
        language=target_lang,
    )

    sources_payload = [
        SourceCitation(
            title=s["title"],
            source_url=s["source_url"],
            chunk_text=s["chunk_text"],
            relevance_score=s["relevance_score"],
        )
        for s in result["sources"]
    ]

    return ImageQuestionSolverResponse(
        extracted_question=result["extracted_question"],
        problem=result["problem"],
        concept=result["concept"],
        steps=result["steps"],
        answer=result["answer"],
        verification=result["verification"],
        similar_question=result["similar_question"],
        sources=sources_payload,
    )

