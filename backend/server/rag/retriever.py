import logging
from server.vectorstore.chroma import get_collection
from server.ingestion.embedder import embed_query

logger = logging.getLogger("uvicorn.error")


def retrieve_context(query: str, top_k: int = 5):
    """
    Retrieve relevant context chunks from the vector store based on the query.
    Returns documents and their metadata.
    """
    try:
        # Get the current collection
        collection = get_collection()

        # Check if collection has any documents
        try:
            count = collection.count()
            if count == 0:
                logger.info("No documents in collection")
                return [], []
        except Exception as count_error:
            logger.warning(f"Could not get collection count: {str(count_error)}")
            return [], []

        # Generate embedding for the query using the API-based embedder
        query_embedding = embed_query(query)

        if not query_embedding:
            logger.warning("Empty query embedding returned")
            return [], []

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        docs_result = results.get("documents") if results else None
        meta_result = results.get("metadatas") if results else None

        documents = (docs_result[0] if docs_result and len(docs_result) > 0 else []) or []
        metadatas = (meta_result[0] if meta_result and len(meta_result) > 0 else []) or []

        # Ensure metadata list matches documents list length
        if len(metadatas) < len(documents):
            metadatas.extend([{}] * (len(documents) - len(metadatas)))

        logger.info(f"Retrieved {len(documents)} context chunks for query")
        return documents, metadatas

    except Exception as e:
        logger.error(f"Error retrieving context: {str(e)}", exc_info=True)
        return [], []
