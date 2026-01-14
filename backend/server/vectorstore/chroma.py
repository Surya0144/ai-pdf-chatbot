import os
import uuid
import chromadb
from chromadb.config import Settings

# Ensure chroma_db directory exists
os.makedirs("chroma_db", exist_ok=True)

_client = chromadb.PersistentClient(
    path="chroma_db",
    settings=Settings(anonymized_telemetry=False)
)

_collection = _client.get_or_create_collection(name="documents")


def store_chunks(chunks, embeddings, metadata):
    # Generate unique IDs to avoid collisions
    ids = [f"doc_{uuid.uuid4().hex}" for _ in range(len(chunks))]

    _collection.add(
        documents=chunks,
        embeddings=embeddings.tolist(),
        metadatas=metadata,
        ids=ids
    )
