# 🐳 Docker + Real Pathway Setup for Windows

## Overview

This guide helps you set up:
1. **Docker Desktop** for Windows - Required for real Pathway
2. **Real Pathway Installation** - Production streaming engine
3. **Full System Verification**

---

## Part 1: Docker Setup (Windows)

### Step 1: Install Docker Desktop

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - File size: ~500MB

2. **System Requirements:**
   - Windows 11 64-bit (or Windows 10 Pro/Enterprise/Education)
   - WSL 2 feature enabled
   - Hardware virtualization enabled in BIOS
   - At least 4GB RAM

3. **Run Installer:**
   - Double-click `Docker Desktop Installer.exe`
   - Follow installation wizard
   - **Important:** Check "Use WSL 2 instead of Hyper-V" option
   - Restart computer when prompted

4. **Start Docker Desktop:**
   - Launch Docker Desktop from Start menu
   - Wait for "Docker Desktop is running" in system tray
   - Accept license agreement

### Step 2: Enable WSL 2 (if not already enabled)

```powershell
# Run PowerShell as Administrator
wsl --install

# Or if WSL is installed but not WSL 2:
wsl --set-default-version 2

# Verify WSL 2
wsl --list --verbose
```

### Step 3: Verify Docker Installation

```powershell
# Test Docker
docker --version
# Should show: Docker version 24.x.x or higher

# Run test container
docker run hello-world
# Should download and run successfully
```

---

## Part 2: Real Pathway Installation

### Option A: Docker-based Pathway (Recommended for Windows)

1. **Create Dockerfile:**

Create `backend/Dockerfile.pathway`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir pathway openai python-dotenv httpx google-generativeai fastapi uvicorn

# Copy application files
COPY pathway_streaming_real.py .
COPY llm_service.py .
COPY financial_event_generator.py .
COPY .env .env

EXPOSE 8000

CMD ["python", "pathway_streaming_real.py"]
```

2. **Build and Run:**

```powershell
cd backend

# Build Docker image
docker build -f Dockerfile.pathway -t fintwitch-pathway .

# Run container
docker run -p 8000:8000 --env-file .env fintwitch-pathway
```

3. **Verify:**
```powershell
curl http://localhost:8000/status
```

### Option B: Native WSL Installation

1. **Enter WSL:**
```powershell
wsl
```

2. **Install Pathway in WSL:**
```bash
# Update package manager
sudo apt update

# Install dependencies
sudo apt install -y python3-pip python3-dev build-essential

# Install Pathway
pip install -U pathway

# Install other requirements
cd /mnt/c/Users/lenovo/Desktop/fin_final2/backend
pip install -r requirements.txt
```

3. **Run from WSL:**
```bash
python pathway_streaming_real.py
```

### Option C: Python Native (May have limitations on Windows)

```powershell
# Try direct installation
pip install -U pathway

# If it fails, Pathway may not support Windows natively
# Use Option A or B instead
```

---

## Part 3: Complete Setup Verification

### 1. Check Docker Status
```powershell
docker ps
# Should show running containers
```

### 2. Check Pathway Engine
```powershell
curl http://localhost:8000/status | jq
```

Expected output:
```json
{
  "status": "healthy",
  "engine": "real",
  "pathway_version": "0.x.x",
  "llm_provider": "gemini",
  "llm_model": "gemini-1.5-flash"
}
```

### 3. Test Transaction Ingestion
```powershell
curl -X POST http://localhost:8000/ingest `
  -H "Content-Type: application/json" `
  -d '{\"type\": \"expense\", \"amount\": 50, \"category\": \"food\", \"description\": \"Lunch\"}'
```

### 4. Test LLM Insights
```powershell
curl http://localhost:8000/insights/llm | jq
```

Should return real Gemini-generated insights!

---

## Troubleshooting

### Docker Issues

**"Docker Desktop is not running"**
- Open Docker Desktop from Start menu
- Wait for green "Running" status

**"WSL 2 installation is incomplete"**
```powershell
wsl --update
wsl --set-default-version 2
```

**"Hardware assisted virtualization is not enabled"**
- Restart computer
- Enter BIOS (usually F2, F10, or DEL during boot)
- Enable VT-x (Intel) or AMD-V (AMD)
- Save and restart

### Pathway Issues

**"Import pathway failed"**
- Use Docker setup (Option A) if native install fails
- Pathway has limited Windows support

**"Real Pathway not loading"**
- Check `http://localhost:8000/status`
- If `"engine": "fallback"`, system is using in-memory mode
- This still works, but without true streaming

**"Port 8000 already in use"**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Gemini API Issues

**"401 Unauthorized"**
- Check API key in `backend/.env`
- Verify key starts with `AI...`
- No spaces or quotes around key

**"Import google.generativeai failed"**
```powershell
pip install google-generativeai
```

---

## Quick Reference

### Docker Commands
```powershell
# Start Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# View running containers
docker ps

# Stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -a -q)

# View logs
docker logs <container-id>
```

### Pathway Commands
```powershell
# Check if real Pathway is working
curl http://localhost:8000/status

# View metrics
curl http://localhost:8000/metrics

# View windowed analytics
curl http://localhost:8000/metrics/windowed
```

---

## Performance Tips

1. **Docker Resource Allocation:**
   - Open Docker Desktop → Settings → Resources
   - Allocate at least 4GB RAM
   - Allocate 2+ CPU cores

2. **WSL 2 Memory Limit:**
   
   Create `C:\Users\<YourUsername>\.wslconfig`:
   ```ini
   [wsl2]
   memory=4GB
   processors=2
   ```

3. **Pathway Optimization:**
   - Use windowed operations instead of full history
   - Limit time window sizes in configuration
   - Monitor memory usage

---

## Next Steps

1. ✅ Install Docker Desktop
2. ✅ Enable WSL 2
3. ✅ Choose Pathway installation method (Docker recommended)
4. ✅ Configure Gemini API in `.env`
5. ✅ Start system with `Start_With_Analytics.bat`
6. ✅ Verify real Pathway is running
7. ✅ Test LLM insights

**Questions?** See [REAL_PATHWAY_LLM_SETUP.md](REAL_PATHWAY_LLM_SETUP.md) or [GEMINI_SETUP.md](GEMINI_SETUP.md)
