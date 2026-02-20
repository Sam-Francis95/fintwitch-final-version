# 🚀 Quick Start - Run This First!

## Automated Setup (Recommended)

### For Windows:
```powershell
# Run the automated setup script (Administrator recommended)
.\Setup-Windows.ps1
```

This script will:
1. ✅ Check Python, Docker, and WSL 2
2. ✅ Install all dependencies
3. ✅ Help you configure Gemini API key
4. ✅ Build Docker images
5. ✅ Start the system automatically

---

## Manual Setup (If needed)

### 1. Get Your FREE Gemini API Key

🔑 **Get it in 2 minutes:**
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy your key (starts with `AI...`)

**MLH Resources:**
- Quickstart: [mlh.link/gemini-quickstart](https://mlh.link/gemini-quickstart)
- Docs: [mlh.link/gemini-docs](https://mlh.link/gemini-docs)
- Examples: [mlh.link/gemini-cookbook](https://mlh.link/gemini-cookbook)

### 2. Configure Your Environment

Edit `backend/.env`:
```env
GEMINI_API_KEY=AI...your-actual-key-here
GEMINI_MODEL=gemini-1.5-flash
LLM_PROVIDER=gemini
```

### 3. Choose Your Startup Method

#### Option A: Docker (Recommended - Real Pathway)
```bash
# Start everything with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

#### Option B: Windows Batch (Quick Start)
```bash
# One-click startup
Start_With_Analytics.bat
```

#### Option C: Manual (Development)
```bash
# Terminal 1: Backend
cd backend
python pathway_streaming_real.py

# Terminal 2: Frontend
npm run dev
```

---

## Access Your Application

Once started, visit:

| Service | URL | Description |
|---------|-----|-------------|
| 🎮 **Game** | http://localhost:3000 | Main application |
| 🌊 **Dashboard** | http://localhost:3000/pathway | Intelligence dashboard |
| 📊 **API** | http://localhost:8000/docs | Interactive API docs |
| 🤖 **AI Insights** | http://localhost:8000/insights/llm | Real AI insights |
| 💡 **Status** | http://localhost:8000/status | System health |

---

## Verify Everything Works

### Check System Status
```bash
curl http://localhost:8000/status
```

Expected output:
```json
{
  "status": "healthy",
  "engine": "real",
  "llm_provider": "gemini",
  "llm_model": "gemini-1.5-flash"
}
```

### Test AI Insights
```bash
curl http://localhost:8000/insights/llm
```

Should return real AI-generated financial advice!

---

## Troubleshooting

### "Gemini API key not configured"
- Edit `backend/.env` with your API key
- Make sure it starts with `AI...`
- No spaces or quotes around the key

### "Docker is not running"
- Start Docker Desktop from Windows Start menu
- Wait for "Docker Desktop is running" in system tray

### "Port already in use"
- Check what's using the port: `netstat -ano | findstr :8000`
- Kill the process or use different ports

### Need Help?
- **Gemini Setup:** See [GEMINI_SETUP.md](GEMINI_SETUP.md)
- **Docker Setup:** See [DOCKER_PATHWAY_SETUP.md](DOCKER_PATHWAY_SETUP.md)
- **Full Docs:** See [REAL_PATHWAY_LLM_SETUP.md](REAL_PATHWAY_LLM_SETUP.md)

---

## What You Get

✅ **Real-Time Streaming** - Pathway processes transactions instantly  
✅ **AI-Powered Insights** - Gemini generates personalized advice  
✅ **Live Analytics** - Time-windowed metrics and trends  
✅ **Production Ready** - Docker containers for deployment  
✅ **100% FREE** - Gemini free tier is generous!

---

## Quick Commands

```bash
# Setup
.\Setup-Windows.ps1                  # Automated setup

# Start
docker-compose up -d                 # Docker start
.\Start_With_Analytics.bat           # Batch start

# Check
curl http://localhost:8000/status    # System status
docker ps                            # View containers
docker-compose logs -f               # View logs

# Stop
docker-compose down                  # Stop Docker
Stop_All_Servers.bat                 # Stop batch processes
```

---

**Ready to build?** Run `.\Setup-Windows.ps1` and you'll be up in 5 minutes! 🚀
