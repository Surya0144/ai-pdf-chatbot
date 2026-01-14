import logging
from server.vectorstore.chroma import _collection
from sentence_transformers import SentenceTransformer

logger = logging.getLogger("uvicorn.error")

_model = SentenceTransformer("all-MiniLM-L6-v2")


def retrieve_context(query: str, top_k: int = 5):
    try:
        query_embedding = _model.encode(query).tolist()

        results = _collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        documents = results.get("documents", [[]])[0] or []
        metadatas = results.get("metadatas", [[]])[0] or []

        # Ensure metadata list matches documents list length
        if len(metadatas) < len(documents):
            metadatas.extend([{}] * (len(documents) - len(metadatas)))

        return documents, metadatas

    except Exception as e:
        logger.error(f"Error retrieving context: {str(e)}", exc_info=True)
        return [], []
