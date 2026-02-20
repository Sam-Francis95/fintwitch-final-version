import os
import sys
sys.path.insert(0, 'backend')

from llm_service import get_llm_service

print("="*50)
print("Testing LLM Service Configuration")
print("="*50)

service = get_llm_service()

print(f"✅ LLM Provider: {service.provider}")
print(f"✅ API Key Loaded: {bool(os.getenv('GEMINI_API_KEY'))}")
print(f"✅ API Key Value (first 10 chars): {os.getenv('GEMINI_API_KEY', '')[:10]}...")
print("="*50)

if service.provider == "gemini":
    print("🎉 SUCCESS! Gemini is configured properly!")
else:
    print("⚠️  WARNING: Provider is", service.provider)
    print("    Check backend/.env file")
