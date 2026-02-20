import os
from pathlib import Path

print("="*60)
print("Environment Debug")
print("="*60)

# Check current directory
print(f"Current Dir: {os.getcwd()}")
print(f"Script Dir: {Path(__file__).parent}")

# Check for .env files
backend_env = Path('backend') / '.env'
root_env = Path('.env')

print(f"\nBackend .env exists: {backend_env.exists()}")
if backend_env.exists():
    content = backend_env.read_text()
    for line in content.split('\n'):
        if 'GEMINI_API_KEY' in line and not line.strip().startswith('#'):
            print(f"  -> {line[:50]}...")

print(f"Root .env exists: {root_env.exists()}")
if root_env.exists():
    content = root_env.read_text()
    for line in content.split('\n'):
        if 'GEMINI_API_KEY' in line and not line.strip().startswith('#'):
            print(f"  -> {line[:50]}...")

# Test loading
from dotenv import load_dotenv
load_dotenv(backend_env, override=True)

api_key = os.getenv('GEMINI_API_KEY', '')
print(f"\nLoaded API Key: {api_key[:20]}... (length: {len(api_key)})")
print(f"Is placeholder: {'your_gemini' in api_key}")
print(f"Starts with AI: {api_key.startswith('AI')}")

print("="*60)
