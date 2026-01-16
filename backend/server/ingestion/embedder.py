import os
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("uvicorn.error")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
EMBEDDING_MODEL = "openai/text-embedding-3-small"


def embed_chunks(chunks: list[str]) -> list[list[float]]:
    """
    Generate embeddings for text chunks using OpenRouter's embedding API.
    Returns a list of embedding vectors.
    """
    if not OPENROUTER_API_KEY:
        logger.error("OPENROUTER_API_KEY environment variable not set")
        raise RuntimeError("OPENROUTER_API_KEY not set")

    if not chunks:
        return []

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/embeddings",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": EMBEDDING_MODEL,
                "input": chunks
            },
            timeout=60
        )

        if response.status_code != 200:
            logger.error(f"Embedding API error: {response.status_code} - {response.text}")
            raise RuntimeError(f"Embedding API error: {response.status_code}")

        data = response.json()
        
        # Extract embeddings from response
        embeddings = [item["embedding"] for item in data["data"]]
        logger.info(f"Successfully generated {len(embeddings)} embeddings")
        
        return embeddings

    except requests.exceptions.Timeout:
        logger.error("Embedding API request timeout")
        raise RuntimeError("Embedding API request timeout")
    except requests.exceptions.RequestException as e:
        logger.error(f"Embedding API request failed: {str(e)}")
        raise RuntimeError(f"Failed to connect to embedding service: {str(e)}")
    except KeyError as e:
        logger.error(f"Unexpected embedding API response format: {str(e)}")
        raise RuntimeError("Unexpected embedding API response format")


def embed_query(query: str) -> list[float]:
    """
    Generate embedding for a single query string.
    Returns a single embedding vector.
    """
    embeddings = embed_chunks([query])
    return embeddings[0] if embeddings else []
