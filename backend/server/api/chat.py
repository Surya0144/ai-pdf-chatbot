import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from server.rag.retriever import retrieve_context
from server.rag.generator import generate_answer
from server.vectorstore.chroma import _collection

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
        sources = []
        seen = set()
        for m in metadata:
            if m:
                source = m.get("source", "unknown")
                # Ensure source is hashable before adding to set
                if isinstance(source, (str, int, float, bool, type(None))):
                    if source not in seen:
                        seen.add(source)
                        sources.append(source)
                else:
                    # Handle unhashable types (e.g., lists, dictionaries) by converting to string
                    str_source = str(source)
                    if str_source not in seen:
                        seen.add(str_source)
                        sources.append(str_source)

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


@router.get("/uploaded-pdfs")
def get_uploaded_pdfs():
    # Simple test endpoint - return empty list for now
    return {"pdfs": []}
