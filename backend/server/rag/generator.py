import os
import logging
import requests
from requests.exceptions import RequestException, Timeout
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger("uvicorn.error")

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Use a reliable free model from OpenRouter
MODEL_NAME = "google/gemini-3-flash-preview"


def generate_answer(question: str, context_chunks: list[str]) -> str:
    if not OPENROUTER_API_KEY:
        logger.error("OPENROUTER_API_KEY environment variable not set")
        raise RuntimeError("OPENROUTER_API_KEY not set")

    if not context_chunks:
        logger.warning("No context chunks provided for question")
        return "I don't know. No relevant information was found in the uploaded documents."

    context = "\n\n".join(context_chunks)

    prompt = f"""You are a helpful assistant that answers questions based ONLY on the provided context.

IMPORTANT RULES:
1. Answer the question using ONLY the information from the context below.
2. If the answer is not present in the context, respond with "I don't know. The information is not available in the uploaded documents."
3. Do not make up information or use knowledge outside the provided context.
4. Be concise and accurate.

Context:
{context}

Question: {question}

Answer:"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "AI Document Search"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "max_tokens": 500
    }

    try:
        logger.info(f"Sending request to OpenRouter for question: {question[:50]}...")
        response = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )

        status_code = response.status_code
        logger.info(f"OpenRouter response status: {status_code}")
        
        # Log response content for debugging
        logger.debug(f"OpenRouter response content: {response.text}")

        if status_code == 401:
            logger.error("OpenRouter API: Unauthorized - Check API key")
            raise RuntimeError("Invalid API key. Please check OPENROUTER_API_KEY.")
        elif status_code == 403:
            logger.error("OpenRouter API: Forbidden - Check API permissions")
            raise RuntimeError("API access forbidden. Please check your OpenRouter account.")
        elif status_code == 429:
            logger.error("OpenRouter API: Rate limit exceeded")
            raise RuntimeError("Rate limit exceeded. Please try again later.")
        elif status_code == 404:
            logger.error(f"OpenRouter API: Not Found - Check endpoint URL or model availability: {OPENROUTER_API_URL}")
            raise RuntimeError("API endpoint not found. The service might be unavailable or the model might have been removed.")
        elif status_code >= 500:
            logger.error(f"OpenRouter API: Server error {status_code}")
            raise RuntimeError(f"OpenRouter service error: {status_code}")
        elif status_code != 200:
            logger.error(f"OpenRouter API: Unexpected status code {status_code}")
            raise RuntimeError(f"Unexpected API response: {status_code}")

        try:
            data = response.json()
        except Exception as e:
            logger.error(f"Failed to parse OpenRouter response: {str(e)}")
            raise RuntimeError("Failed to parse response from LLM service")

        if "choices" not in data or len(data["choices"]) == 0:
            logger.error(f"Unexpected response format: {data}")
            raise RuntimeError("Unexpected response format from OpenRouter")

        answer = data["choices"][0]["message"]["content"]
        logger.info(f"Successfully generated answer (length: {len(answer)})")
        return answer.strip()

    except Timeout:
        logger.error("OpenRouter API: Request timeout")
        raise RuntimeError("Request timeout. The LLM service took too long to respond.")
    except RequestException as e:
        logger.error(f"OpenRouter API request failed: {str(e)}")
        raise RuntimeError(f"Failed to connect to LLM service: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in generate_answer: {str(e)}", exc_info=True)
        raise
