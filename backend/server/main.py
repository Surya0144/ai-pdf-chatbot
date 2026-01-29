import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.upload import router as upload_router
from server.api.chat import router as chat_router

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="AI Document Search Backend")

# CORS configuration - support multiple Vercel preview URLs and production
# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://ai-pdf-chatbot-hzbda1731-suryas-projects-3abf6578.vercel.app"
).split(",")

# Also allow all Vercel preview deployments for this project
VERCEL_PREVIEW_PATTERN = "https://*.vercel.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "AI Document Search Backend API", "docs": "/docs"}

@app.api_route("/health", methods=["GET", "HEAD"], tags=["Health"])
async def health_check():
    return {"status": "up", "details": "All systems functional"}
