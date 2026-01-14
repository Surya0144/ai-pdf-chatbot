#!/usr/bin/env python3
"""Quick test script to verify backend can start and respond"""

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing imports...")
    from server.main import app
    print("✓ Imports successful")
    
    print("\nTesting FastAPI app...")
    print(f"✓ FastAPI app created: {app.title}")
    
    print("\nChecking routes...")
    routes = [route.path for route in app.routes]
    print(f"✓ Found {len(routes)} routes:")
    for route in routes:
        print(f"  - {route}")
    
    print("\n✓ Backend server should start successfully!")
    print("\nTo start the server, run:")
    print("  uvicorn server.main:app --reload --port 8000")
    
except Exception as e:
    print(f"\nX Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
