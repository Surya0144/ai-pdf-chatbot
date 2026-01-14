import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.upload import router as upload_router
from server.api.chat import router as chat_router

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="AI Document Search Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ai-pdf-chatbot-hzbda1731-suryas-projects-3abf6578.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AI Document Search Backend API", "docs": "/docs"}

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "up", "details": "All systems functional"}
