import os
import logging
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException

from server.ingestion.loader import load_pdf
from server.ingestion.chunker import chunk_text
from server.ingestion.embedder import embed_chunks
from server.vectorstore.chroma import store_chunks

logger = logging.getLogger("uvicorn.error")

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        logger.info(f"Uploading file: {file.filename}")

        file_path = os.path.join(UPLOAD_DIR, file.filename)

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"File saved to {file_path}")

        # Extract text
        text = load_pdf(file_path)
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="PDF appears to be empty or unreadable")

        logger.info(f"Extracted {len(text)} characters from PDF")

        # Chunk text
        chunks = chunk_text(text)
        if not chunks:
            raise HTTPException(status_code=400, detail="No text chunks could be created from PDF")

        logger.info(f"Created {len(chunks)} chunks")

        # Generate embeddings
        embeddings = embed_chunks(chunks)
        logger.info(f"Generated embeddings for {len(chunks)} chunks")

        # Store in vector database
        metadata = [{"source": file.filename} for _ in chunks]
        store_chunks(chunks, embeddings, metadata)
        logger.info(f"Stored {len(chunks)} chunks in vector database")

        return {
            "filename": file.filename,
            "chunks": len(chunks),
            "status": "stored"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
