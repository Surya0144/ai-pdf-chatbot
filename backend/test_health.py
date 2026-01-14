#!/usr/bin/env python3
"""Test script to verify health endpoint is accessible"""

import requests
import sys

def test_health():
    try:
        print("Testing health endpoint at http://localhost:8000/health...")
        response = requests.get("http://localhost:8000/health", timeout=5)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok":
                print("\n✓ Health check passed!")
                return True
            else:
                print(f"\n✗ Unexpected response: {data}")
                return False
        else:
            print(f"\n✗ Health check failed with status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n✗ Cannot connect to server. Is the backend running?")
        print("  Start it with: uvicorn server.main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False

if __name__ == "__main__":
    success = test_health()
    sys.exit(0 if success else 1)
