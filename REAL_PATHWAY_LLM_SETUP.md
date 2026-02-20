# 🚀 FinTwitch Real Pathway + LLM Setup Guide

## Overview

You've upgraded to **REAL Pathway streaming** and **REAL LLM integration**. This guide will help you configure the production-grade intelligence engine.

---

## Step 1: Install Required Packages

```bash
cd backend
pip install -r requirements.txt
```

**Key packages being installed:**
- `pathway` - Real streaming engine (may need special installation)
- `openai>=1.0.0` - OpenAI API client
- `python-dotenv` - Environment variable management
- `httpx` - HTTP client for Ollama (optional)

### Pathway Installation Notes

**Windows Users:**
- Pathway may require WSL (Windows Subsystem for Linux) or Docker
- Visit: https://pathway.com/developers/user-guide/deployment/
- Alternative: Use the fallback mode (works without real Pathway)

**Linux/Mac Users:**
```bash
pip install -U pathway
```

---

## Step 2: Configure LLM Provider

### Option A: Google Gemini (Recommended - FREE! 🌟)

**Why Gemini?**
- ✅ **FREE Tier:** 15 requests/min, 1M tokens/day
- ✅ **Fast:** Sub-second responses
- ✅ **Smart:** Excellent at financial analysis
- ✅ **No billing required** to get started

**MLH Gemini Resources:**
- 🚀 **Quickstart:** [mlh.link/gemini-quickstart](https://mlh.link/gemini-quickstart)
- 📚 **API Docs:** [mlh.link/gemini-docs](https://mlh.link/gemini-docs)
- 💻 **Code Examples:** [mlh.link/gemini-cookbook](https://mlh.link/gemini-cookbook)
- 🏗️ **Build Guide:** [mlh.link/gemini](https://mlh.link/gemini)

1. **Get FREE API Key:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key" (no billing required!)
   - Copy your key

2. **Create `.env` file:**
```bash
cd backend
cp .env.example .env
```

3. **Edit `.env` file:**
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-actual-gemini-key-here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_TOKENS=500
ENABLE_LLM_INSIGHTS=true
```

**Models Available:**
- `gemini-1.5-flash` - Fast & efficient (recommended)
- `gemini-1.5-pro` - More powerful, higher quality
- `gemini-pro` - Original model

### Option B: OpenAI (Paid - High Quality)

1. **Get API Key:**
   - Visit: https://platform.openai.com/api-keys
   - Create new API key
   - Copy the key (starts with `sk-...`)

2. **Edit `.env` file:**
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=500
ENABLE_LLM_INSIGHTS=true
```

**Cost:** ~$0.15 per 1M tokens

### Option C: Ollama (Free - Runs Locally)

1. **Install Ollama:**
   - Visit: https://ollama.ai/
   - Download and install for your OS
   - Start Ollama service

2. **Pull a model:**
```bash
ollama pull llama3.2
# or
ollama pull mistral
```

3. **Configure `.env`:**
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
ENABLE_LLM_INSIGHTS=true
```

**Pros:** Free, private, no API limits  
**Cons:** Requires local compute, slower than cloud APIs

### Option D: Mock (Fallback)

If you don't configure an LLM, the system uses intelligent rule-based insights (still very good!).

```env
LLM_PROVIDER=mock
ENABLE_LLM_INSIGHTS=true
```

---

## Step 3: Start the System

### Quick Start
```bash
Start_With_Analytics.bat
```

This launches:
1. **Real Pathway Engine** (Port 8000) - Streaming analytics
2. **Event Generator** (Port 5000) - Transaction creation
3. **Budget System** (Port 5001) - Budget API
4. **Frontend** (Port 3000) - React UI

### Manual Start (For Debugging)

**Terminal 1 - Real Pathway Engine:**
```bash
cd backend
python pathway_streaming_real.py
```

**Terminal 2 - Event Generator:**
```bash
cd backend
python financial_event_generator.py
```

**Terminal 3 - Budget System:**
```bash
cd backend
python budget_system.py
```

**Terminal 4 - Frontend:**
```bash
npm run dev
```

---

## Step 4: Verify Installation

### Check Engine Status
```bash
curl http://localhost:8000/status
```

**Expected Response:**
```json
{
  "engine": "real",  // or "fallback" if Pathway not installed
  "pathway_version": "0.x.x",
  "llm_provider": "openai",  // or "ollama" or "mock"
  "llm_enabled": true,
  "features": {
    "real_streaming": true,
    "time_windows": true,
    "category_aggregations": true,
    "financial_intelligence": true,
    "llm_insights": true
  }
}
```

### Test LLM Insights
```bash
curl http://localhost:8000/insights/llm
```

**Should return:**
- Natural language financial summary
- Risk analysis
- Personalized recommendations
- Provider info (openai/ollama/mock)

---

## Step 5: Use the Dashboard

1. **Open Browser:** http://localhost:3000/pathway

2. **Generate Transactions:**
   - Use Career Mode
   - Use Financial Tools
   - Use Games/Simulations

3. **Watch Real-Time Intelligence:**
   - Core metrics update instantly
   - LLM insights refresh every 5-10 seconds
   - Time windows show recent activity
   - Financial intelligence alerts appear automatically

---

## Architecture

```
User Actions
    ↓
Transaction Events (FastAPI POST /ingest)
    ↓
┌─────────────────────────────────────────┐
│   REAL PATHWAY STREAMING ENGINE         │
│                                         │
│  [1] Python ConnectorSubject            │
│      • Continuous event ingestion       │
│                                         │
│  [2] Streaming Transformations          │
│      • with_columns (signed amounts)    │
│      • Real-time enrichment             │
│                                         │
│  [3] Stateful Aggregations              │
│      • reduce() operations              │
│      • Running totals                   │
│      • Balance computation              │
│                                         │
│  [4] Category GroupBy                   │
│      • groupby('category')              │
│      • Per-category aggregations        │
│                                         │
│  [5] Time Windows                       │
│      • window_by(timestamp)             │
│      • Rolling 5-minute windows         │
│      • Recent activity tracking         │
│                                         │
│  [6] Output Callbacks                   │
│      • on_change listeners              │
│      • Update global state              │
│                                         │
└─────────────────────────────────────────┘
    ↓
Intelligence Rules Engine
    ↓
┌─────────────────────────────────────────┐
│   REAL LLM INTEGRATION SERVICE          │
│                                         │
│  • Construct context prompt             │
│  • Call OpenAI/Ollama API               │
│  • Parse structured response            │
│  • Generate natural language insights   │
│                                         │
└─────────────────────────────────────────┘
    ↓
FastAPI API Endpoints
    ↓
Frontend React Components
```

---

## Features

### ✅ Real Pathway Streaming
- **Unbounded event streams** - Continuous ingestion via ConnectorSubject
- **Streaming transformations** - with_columns(), signed amounts
- **Stateful aggregations** - reduce() with running totals
- **Group by operations** - Category-wise aggregations
- **Time-windowed analytics** - window_by() with temporal logic
- **Automatic recomputation** - Updates on every new event

### ✅ Real LLM Integration
- **Context-aware prompts** - Built from live financial metrics
- **Natural language summaries** - "Your expenses exceed income by ₹5,000..."
- **Risk explanations** - Why risk is HIGH/MEDIUM/LOW
- **Personalized recommendations** - Based on spending patterns
- **Multiple providers** - OpenAI, Ollama, or intelligent mock

### ✅ Financial Intelligence
- Overspending detection
- Balance monitoring (negative/low)
- Emergency fund risk assessment
- Rapid spending alerts
- Category-based insights
- Risk level classification
- Health score (0-100)
- Behavioral pattern analysis

---

## API Endpoints

### POST /ingest
Ingest transaction into Pathway stream
```json
{
  "type": "expense",
  "amount": 1500,
  "category": "food",
  "timestamp": "2026-02-20T15:30:00",
  "description": "Groceries"
}
```

### GET /metrics
Core financial metrics (real-time)

### GET /metrics/categories
Category-wise aggregations (groupby)

### GET /metrics/windowed?window_minutes=5
Time-windowed analytics (rolling windows)

### GET /intelligence
Financial intelligence (alerts, warnings, insights)

### GET /insights/llm ⭐
**REAL LLM-powered natural language insights**
```json
{
  "summary": "Your expenses (₹12,000) are approaching your income...",
  "risk_analysis": "Risk is HIGH because expense ratio is 95%...",
  "recommendations": [
    "Reduce discretionary spending by 20%",
    "Focus on 'entertainment' category (40% of total)"
  ],
  "confidence": 0.92,
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

### GET /status
Engine capabilities and health

---

## Troubleshooting

### Pathway Not Loading
**Symptom:** Engine shows "fallback" mode

**Solution:**
- Windows: Install WSL or use Docker
- Linux/Mac: `pip install -U pathway`
- Alternative: Fallback mode works well for demos

### LLM Returning Mock Data
**Symptom:** Provider shows "mock" in /insights/llm

**Checklist:**
1. Is `.env` file created? (not just .env.example)
2. Is `OPENAI_API_KEY` set correctly?
3. Is API key valid? (test at platform.openai.com)
4. Is `LLM_PROVIDER=openai` set?
5. Is `openai` package installed? (`pip install openai`)

### OpenAI API Errors
**Error:** "Invalid API key"
- Verify key starts with `sk-`
- Check for extra spaces/quotes in .env
- Regenerate key at platform.openai.com

**Error:** "Rate limit exceeded"
- Wait a few seconds
- Add `LLM_CACHE_SECONDS=10` to .env
- Reduce request frequency

**Error:** "Model not found"
- Try `OPENAI_MODEL=gpt-3.5-turbo` instead
- Check available models in OpenAI dashboard

### Ollama Connection Failed
**Error:** "Connection refused"
- Is Ollama running? (`ollama serve`)
- Is model pulled? (`ollama pull llama3.2`)
- Check port: `OLLAMA_BASE_URL=http://localhost:11434`

---

## Performance Tips

1. **LLM Caching:** Insights are cached for 10 seconds by default
2. **Async Calls:** LLM requests run asynchronously (non-blocking)
3. **Pathway Threading:** Runs in background daemon thread
4. **Rate Limits:** Frontend polls every 2-5 seconds (adjustable)

---

## Cost Estimates

### OpenAI (gpt-4o-mini)
- **Input:** $0.15 per 1M tokens
- **Output:** $0.60 per 1M tokens
- **Typical insight:** ~300 tokens (~300 words)
- **Cost per insight:** ~$0.0003 (0.03 cents)
- **100 insights:** ~$0.03
- **Very affordable for demos/personal use**

### Ollama
- **Cost:** Free (runs locally)
- **Requirement:** 4GB+ RAM, modern CPU
- **Models:** llama3.2, mistral, phi, etc.

---

## Next Steps

1. ✅ **Install dependencies:** `pip install -r requirements.txt`
2. ✅ **Configure LLM:** Create `.env` with API key
3. ✅ **Start system:** Run `Start_With_Analytics.bat`
4. ✅ **Test insights:** Visit http://localhost:3000/pathway
5. ✅ **Generate transactions:** Use Career Mode or Tools
6. ✅ **Watch intelligence:** See real AI insights in dashboard

---

## Support

- **Pathway Docs:** https://pathway.com/developers/
- **OpenAI API:** https://platform.openai.com/docs
- **Ollama:** https://ollama.ai/
- **Project README:** See README.md in project root

---

**You now have a production-grade real-time financial intelligence system powered by genuine Pathway streaming and real LLM AI! 🚀**
