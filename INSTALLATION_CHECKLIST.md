# ✅ FinTwitch v3.0 Installation Checklist

## Before You Start

Check off each step as you complete it:

---

## Phase 1: Backend Setup

### Step 1: Install Python Dependencies ⏱️ 2 minutes
```bash
cd backend
pip install -r requirements.txt
```

Expected output:
```
Successfully installed:
  - flask
  - fastapi
  - uvicorn
  - openai        ← NEW for real LLM
  - python-dotenv ← NEW for config
  - httpx         ← NEW for Ollama
  - pydantic
  ...
```

**Troubleshooting:**
- If `pathway` fails on Windows, that's OK - system has fallback mode
- If you want real Pathway on Windows: Install WSL then `pip install pathway`

---

### Step 2: Configure LLM (Optional) ⏱️ 5 minutes

**Choose ONE option:**

#### ✅ Option A: OpenAI (Recommended - Best Quality)

**2a. Get API Key:**
1. Visit https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)

**2b. Create `.env` file:**
```bash
cd backend
cp .env.example .env
```

**2c. Edit `backend/.env`:**
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=500
ENABLE_LLM_INSIGHTS=true
```

**Cost:** ~$0.50/day for typical use

---

#### ✅ Option B: Ollama (Free - Runs Locally)

**2a. Install Ollama:**
- Visit: https://ollama.ai/
- Download for your OS
- Install and start Ollama

**2b. Pull a model:**
```bash
ollama pull llama3.2
# Or: ollama pull mistral
```

**2c. Create `.env` file:**
```bash
cd backend
cp .env.example .env
```

**2d. Edit `backend/.env`:**
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
ENABLE_LLM_INSIGHTS=true
```

**Requirements:** 4GB+ RAM, modern CPU

---

#### ✅ Option C: Skip LLM Setup (Use Mock)

**Just skip this step!**
- System auto-detects and uses intelligent fallback
- Still provides great insights (rule-based)
- Upgrade to real LLM anytime later

---

## Phase 2: Frontend Setup

### Step 3: Install Node Dependencies ⏱️ 3 minutes
```bash
cd ..  # Back to project root
npm install
```

Expected packages:
```
+ react@18.2.0
+ zustand
+ tailwind-css
+ recharts
+ lucide-react
+ vite
...
```

---

## Phase 3: First Run

### Step 4: Start the System ⏱️ 30 seconds
```bash
Start_With_Analytics.bat
```

Should open 4 windows:
1. **REAL Pathway Intelligence** (Port 8000)
2. **Event Generator** (Port 5000)
3. **Budget System** (Port 5001)
4. **Frontend** (Port 3000) - Opens in browser

---

### Step 5: Verify Installation ⏱️ 1 minute

#### Check Pathway Engine
Open: http://localhost:8000/status

**Look for:**
```json
{
  "engine": "real",  // ✅ Real Pathway working!
  // OR
  "engine": "fallback",  // ⚠️ Using compatibility mode (still works great)
  
  "llm_provider": "openai",  // ✅ Real AI!
  // OR
  "llm_provider": "mock"  // ⚠️ Using intelligent fallback
}
```

#### Check LLM Insights
Open: http://localhost:8000/insights/llm

**Look for:**
```json
{
  "provider": "openai",  // ✅ Real OpenAI
  "model": "gpt-4o-mini",
  "summary": "[Unique AI text]",
  "confidence": 0.92
}
```

#### Check Dashboard
Open: http://localhost:3000/pathway

**Should see:**
- Core metrics updating
- Financial intelligence panel
- LLM insights panel (with AI-generated text)
- Time windows
- Category breakdown

---

## Phase 4: Test Real Intelligence

### Step 6: Generate Transactions ⏱️ 2 minutes

**Option A: Use the Game**
1. Go to http://localhost:3000
2. Click "Career Mode"
3. Complete activities (generates transactions)

**Option B: Use API**
```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 5000,
    "category": "entertainment",
    "description": "Concert tickets"
  }'
```

---

### Step 7: Watch Intelligence Update ⏱️ 1 minute

1. Go to http://localhost:3000/pathway
2. Watch panels update automatically:
   - Balance changes immediately
   - LLM insights refresh every 5-10 seconds
   - Financial intelligence alerts appear
   - Time windows show recent activity

**🎉 If everything updates - YOU'RE DONE!**

---

## Verification Checklist

Mark each when confirmed:

### Backend
- [ ] `pip install` completed without errors
- [ ] (Optional) `.env` file created with API key
- [ ] `Start_With_Analytics.bat` opens 4 terminal windows
- [ ] Port 8000 shows "REAL Pathway Intelligence" running
- [ ] No red errors in console (warnings OK)

### API
- [ ] http://localhost:8000/status returns JSON
- [ ] `"engine"` shows "real" or "fallback"
- [ ] `"llm_provider"` shows "openai", "ollama", or "mock"
- [ ] http://localhost:8000/docs shows interactive API docs

### Frontend
- [ ] http://localhost:3000 loads without errors
- [ ] Can navigate to Career Mode, Tools, Games
- [ ] http://localhost:3000/pathway shows dashboard
- [ ] All 5 panels are visible

### Intelligence
- [ ] Making transactions updates balance immediately
- [ ] LLM insights panel shows text (check provider info)
- [ ] Financial intelligence shows alerts/warnings/insights
- [ ] Time windows show recent activity
- [ ] Category breakdown updates

---

## Troubleshooting

### ❌ "Import openai could not be resolved"
**Fix:** Run `pip install openai`

### ❌ "Real Pathway not available"
**Fix:** 
- Windows: Requires WSL or Docker (complicated)
- **OR:** Just use fallback mode (works great!)
- Linux/Mac: `pip install -U pathway`

### ❌ LLM returning mock data
**Fix:**
1. Check `.env` file exists (not `.env.example`)
2. Check `OPENAI_API_KEY` is valid
3. Test at https://platform.openai.com

### ❌ "Port 8000 already in use"
**Fix:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use:
Stop_All_Servers.bat
```

### ❌ Frontend shows "Failed to fetch"
**Fix:**
1. Check backend is running (port 8000)
2. Check no firewall blocking localhost
3. Restart `Start_With_Analytics.bat`

---

## Success Criteria

You've successfully installed v3.0 if:

✅ System starts without errors  
✅ Dashboard shows live metrics  
✅ Transactions update immediately  
✅ LLM insights appear (even if using mock)  
✅ Financial intelligence shows recommendations  

---

## What's Next?

### If Using Mock LLM
- Consider adding OpenAI API key for real AI
- Only ~$0.50/day for typical use
- Much better quality insights

### If Everything Working
- Read [PATHWAY_HACKATHON_DOCS.md](PATHWAY_HACKATHON_DOCS.md) for architecture
- Explore API at http://localhost:8000/docs
- Try different time windows
- Generate various transaction patterns

### If Issues Persist
1. Check [REAL_PATHWAY_LLM_SETUP.md](REAL_PATHWAY_LLM_SETUP.md) troubleshooting section
2. Review console output for specific errors
3. Verify all dependencies installed: `pip freeze`

---

## Quick Commands Reference

```bash
# Start system
Start_With_Analytics.bat

# Stop all
Stop_All_Servers.bat

# Reinstall dependencies
pip install -r backend/requirements.txt

# Test API
curl http://localhost:8000/status

# Test LLM
curl http://localhost:8000/insights/llm

# View logs
# Check terminal windows opened by Start_With_Analytics.bat
```

---

## Installation Time Estimate

| Step | Time | Can Skip? |
|------|------|-----------|
| Install Python deps | 2 min | No |
| Configure LLM | 5 min | Yes (uses mock) |
| Install Node deps | 3 min | No |
| First run | 30 sec | No |
| Verify | 2 min | No |
| **Total** | **12 min** | **7 min minimum** |

---

**Ready to experience real-time intelligence? Start with Step 1! 🚀**

See [QUICK_START_v3.md](QUICK_START_v3.md) for command reference.
