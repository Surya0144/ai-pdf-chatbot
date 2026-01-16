import os
import uuid
from typing import Any
import chromadb
from chromadb.config import Settings

# Ensure chroma_db directory exists
os.makedirs("chroma_db", exist_ok=True)

_client = chromadb.PersistentClient(
    path="chroma_db",
    settings=Settings(anonymized_telemetry=False)
)

_collection = _client.get_or_create_collection(name="documents")


def clear_collection() -> None:
    """
    Clear all documents from the vector database.
    """
    global _collection
    _client.delete_collection(name="documents")
    _collection = _client.get_or_create_collection(name="documents")


def store_chunks(chunks: list[str], embeddings: Any, metadata: list[dict[str, Any]]) -> None:
    """
    Store document chunks with their embeddings in the vector database.
    
    Args:
        chunks: List of text chunks
        embeddings: List of embedding vectors (can be list or numpy array)
        metadata: List of metadata dictionaries for each chunk
    """
    # Generate unique IDs to avoid collisions
    ids = [f"doc_{uuid.uuid4().hex}" for _ in range(len(chunks))]

    # Convert embeddings to list if it's a numpy array
    if hasattr(embeddings, 'tolist'):
        embeddings_list = embeddings.tolist()
    else:
        embeddings_list = embeddings

    _collection.add(
        documents=chunks,
        embeddings=embeddings_list,  # type: ignore
        metadatas=metadata,  # type: ignore
        ids=ids
    )
