import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from server.rag.retriever import retrieve_context
from server.rag.generator import generate_answer

logger = logging.getLogger("uvicorn.error")

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):
    try:
        question = request.question.strip()
        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        logger.info(f"Received question: {question}")

        # Retrieve relevant context
        docs, metadata = retrieve_context(question)
        logger.info(f"Retrieved {len(docs)} relevant chunks")

        if not docs:
            logger.warning("No relevant documents found for question")
            return {
                "question": question,
                "answer": "I don't know. No relevant information was found in the uploaded documents.",
                "sources": []
            }

        # Generate answer
        answer = generate_answer(question, docs)

        # Extract unique sources
        sources = list({m.get("source", "unknown") for m in metadata if m})

        logger.info(f"Generated answer with {len(sources)} source(s)")

        return {
            "question": question,
            "answer": answer,
            "sources": sources
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate answer: {str(e)}")
