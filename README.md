# AI Document Search

A modern, full-stack web application that enables intelligent document search and Q&A using Retrieval-Augmented Generation (RAG). Upload PDF documents and chat with them to get accurate, context-aware answers powered by advanced AI models.

## 🚀 Features

- **PDF Document Upload**: Securely upload and process PDF files
- **Intelligent Chunking**: Automatic text segmentation for optimal retrieval
- **Vector Embeddings**: State-of-the-art embeddings using OpenAI's text-embedding-3-small
- **Semantic Search**: Find relevant information using vector similarity
- **AI-Powered Q&A**: Get precise answers using Meta's Llama 3.1 8B model
- **Source Citations**: Every answer includes references to source documents
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Real-time Chat**: Interactive conversation interface
- **CORS Support**: Configurable cross-origin resource sharing
- **Production Ready**: Deployed on Render with persistent storage

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion for smooth interactions
- **HTTP Client**: Axios for API communication
- **Components**: Modular, reusable React components

### Backend (FastAPI + Python)

- **Framework**: FastAPI for high-performance APIs
- **Language**: Python 3.10+
- **Vector Database**: ChromaDB for efficient similarity search
- **LLM Integration**: OpenRouter API for AI model access
- **PDF Processing**: PyPDF for text extraction
- **Embeddings**: OpenAI embeddings via OpenRouter
- **CORS**: Configurable cross-origin middleware

## 🔄 Workflow

1. **Document Upload**

   - User uploads PDF file through web interface
   - Backend validates file type and extracts text
   - Text is chunked into manageable segments

2. **Processing Pipeline**

   - Each chunk is converted to vector embeddings
   - Embeddings stored in ChromaDB with metadata
   - Documents indexed for fast retrieval

3. **Query Processing**

   - User submits natural language question
   - Query converted to embedding vector
   - Semantic search finds relevant document chunks

4. **Answer Generation**
   - Retrieved context sent to LLM with question
   - AI generates accurate, contextual response
   - Source citations included in response

## 📋 Prerequisites

- **Backend**:

  - Python 3.10 or higher
  - OpenRouter API key with credits
  - Internet connection for API calls

- **Frontend**:

  - Node.js 18 or higher
  - npm or yarn package manager

- **Deployment**:
  - Render account for backend hosting
  - Vercel account for frontend hosting (optional)

## 🚀 Deployment

### Backend Deployment (Render)

1. **Fork/Clone Repository**

   ```bash
   git clone <your-repo-url>
   cd llm-pdf-search/backend
   ```

2. **Environment Setup**

   - Create account at [OpenRouter.ai](https://openrouter.ai)
   - Generate API key with sufficient credits
   - Set environment variable: `OPENROUTER_API_KEY=your_api_key_here`

3. **Deploy to Render**

   - Connect GitHub repository to Render
   - Use `render.yaml` blueprint for automatic deployment
   - Set environment variables in Render dashboard:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs
     - `PYTHON_VERSION`: 3.10

4. **Verify Deployment**
   - Check `/health` endpoint returns `{"status": "up"}`
   - Test `/docs` for API documentation

### Frontend Deployment (Vercel)

1. **Navigate to Frontend**

   ```bash
   cd ../frontend
   ```

2. **Environment Configuration**

   ```bash
   # Create .env.local
   NEXT_PUBLIC_API_BASE_URL=https://your-render-app.onrender.com/api
   ```

3. **Deploy to Vercel**
   - Connect GitHub repository
   - Set environment variable: `NEXT_PUBLIC_API_BASE_URL`
   - Deploy automatically on push

## ⚙️ Configuration

### Environment Variables

**Backend (.env)**

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://another-domain.com
```

**Frontend (.env.local)**

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api
```

### Model Configuration

- **Embedding Model**: `openai/text-embedding-3-small`
- **Chat Model**: `meta-llama/llama-3.1-8b-instruct:free`
- **Chunk Size**: Configurable in `chunker.py`
- **Top-K Retrieval**: Default 5 chunks per query

## 📁 Project Structure

```
├── backend/
│   ├── server/
│   │   ├── main.py              # FastAPI application
│   │   ├── api/
│   │   │   ├── chat.py          # Chat endpoint
│   │   │   └── upload.py        # File upload endpoint
│   │   ├── rag/
│   │   │   ├── generator.py     # LLM integration
│   │   │   └── retriever.py     # Vector search
│   │   ├── ingestion/
│   │   │   ├── embedder.py      # Embedding generation
│   │   │   ├── loader.py        # PDF text extraction
│   │   │   └── chunker.py       # Text chunking
│   │   └── vectorstore/
│   │       └── chroma.py        # Vector database
│   ├── requirements.txt         # Python dependencies
│   ├── render.yaml             # Render deployment config
│   └── chroma_db/              # Vector database storage
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Home page
│   │   ├── upload/
│   │   │   └── page.tsx        # Upload interface
│   │   └── chat/
│   │       └── page.tsx        # Chat interface
│   ├── components/
│   │   ├── FloatingLines.jsx   # Animated background
│   │   └── Aurora.jsx          # Aurora effect
│   ├── services/
│   │   └── api.ts              # API client
│   └── package.json            # Node dependencies
└── README.md
```

## 🔒 Security & Performance

- **API Key Protection**: Keys stored as environment variables
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: File type and content validation
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Handled by OpenRouter API
- **Timeout Management**: Reasonable timeouts for all operations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenRouter** for AI model access
- **ChromaDB** for vector database
- **FastAPI** for backend framework
- **Next.js** for frontend framework
- **Tailwind CSS** for styling
- **Framer Motion** for animations

## 📞 Support

For issues and questions:

- Check existing GitHub issues
- Create new issue with detailed description
- Include error logs and reproduction steps

---

Built with ❤️ using modern web technologies and AI
