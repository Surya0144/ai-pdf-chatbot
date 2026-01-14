@echo off
REM Ensure we're in the backend directory
cd /d "%~dp0"

echo Starting Backend Server...
echo Current directory: %CD%
echo.

REM Check if virtual environment exists
if not exist ".venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv .venv
    echo.
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

@REM echo Installing/updating dependencies...
@REM pip install -r requirements.txt -q

echo.
echo Starting FastAPI server on http://localhost:8000
echo Health check: http://localhost:8000/health
echo API docs: http://localhost:8000/docs
echo Press Ctrl+C to stop the server
echo.

uvicorn server.main:app --reload --port 8000 --host 0.0.0.0
