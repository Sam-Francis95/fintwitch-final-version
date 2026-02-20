# 🌟 Google Gemini Setup for FinTwitch

**Official Quickstart:** https://ai.google.dev/gemini-api/docs/quickstart

## Why Gemini?

✅ **100% FREE** - No billing required to start  
✅ **Generous Limits** - 15 requests/min, 1M tokens/day  
✅ **Fast** - Sub-second response times  
✅ **Smart** - Excellent at financial analysis  
✅ **Easy** - 5-minute setup  
✅ **Modern SDK** - Latest `google-genai` package

## MLH Gemini Resources

Learn more about building with Google Gemini:

- 🚀 **Quickstart Guide:** [mlh.link/gemini-quickstart](https://mlh.link/gemini-quickstart)
- 📚 **API Documentation:** [mlh.link/gemini-docs](https://mlh.link/gemini-docs)
- 💻 **Code Cookbook:** [mlh.link/gemini-cookbook](https://mlh.link/gemini-cookbook)
- 🏗️ **Building with Gemini:** [mlh.link/gemini](https://mlh.link/gemini)
- 📖 **Official Docs:** https://ai.google.dev/gemini-api/docs

## Setup Steps (Official Method)

### 1. Get Your FREE API Key

**From the official quickstart:**

> Using the Gemini API requires an API key, you can create one for free to get started.

1. Go to **Google AI Studio**: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"** button
4. Copy your API key (starts with `AI...`)

**No billing required!** The free tier is perfect for this project.

### 2. Install the SDK

**Official method:**
```bash
pip install -U google-genai
```

**For FinTwitch (already done if you ran Setup-Windows.ps1):**
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure FinTwitch

Edit `backend/.env` file:

```env
# Google Gemini Configuration
LLM_PROVIDER=gemini
GEMINI_API_KEY=AI...your-actual-key-here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_TOKENS=500
ENABLE_LLM_INSIGHTS=true
```

### 4. Verify Installation

Test the modern SDK:
```bash
python -c "from google import genai; print('✅ Google GenAI SDK installed:', genai.__version__)"
```

### 5. Start the System

```bash
# Option 1: Docker (Recommended)
docker-compose up -d

# Option 2: Windows Batch
.\Start_With_Analytics.bat

# Option 3: Manual
cd backend
python pathway_streaming_real.py
```

Look for this in the console:
```
✓ LLM Provider: Google Gemini (gemini-1.5-flash)
```

## Testing Your Setup

### Check Status
```bash
curl http://localhost:8000/status
```

Should show:
```json
{
  "status": "healthy",
  "llm_provider": "gemini",
  "llm_model": "gemini-1.5-flash"
}
```

### Get AI Insights
```bash
curl http://localhost:8000/insights/llm
```

Should return real AI-generated financial insights!

## Available Models

### gemini-1.5-flash (Recommended)
- **Speed:** Very fast (~1 second)
- **Quality:** Excellent
- **Best for:** Real-time insights (like FinTwitch)
- **Free Tier:** 15 req/min, 1M tokens/day

### gemini-1.5-pro
- **Speed:** Fast (~2 seconds)
- **Quality:** Best available
- **Best for:** Complex analysis
- **Free Tier:** 2 req/min, 50K tokens/day

### gemini-pro
- **Speed:** Fast
- **Quality:** Good
- **Best for:** General purpose
- **Note:** Legacy model

## Free Tier Limits

**Gemini 1.5 Flash:**
- 15 requests per minute
- 1 million tokens per day
- More than enough for dev/testing!

**For FinTwitch:**
- Each insight = ~1 request
- Typical day = ~100-500 insights
- **You won't hit limits** 🎉

## Troubleshooting

### "401 Unauthorized"
- Check your API key is correct
- Make sure it starts with `AI...`
- No spaces or quotes in `.env` file

### "Import error: google.generativeai"
```bash
pip install google-generativeai
```

### "Model not found"
- Use `gemini-1.5-flash` (not `gemini-flash`)
- Check spelling in `.env`

### "Rate limit exceeded"
- Free tier: 15 req/min
- Add delay between requests
- Or upgrade to paid tier (still very cheap!)

## Cost Comparison

| Provider | Cost | Setup Time |
|----------|------|------------|
| **Gemini** | **FREE** | **5 minutes** |
| OpenAI | $0.50/day | 10 minutes |
| Ollama | FREE (local) | 30 minutes |

## Next Steps

1. ✅ Get your key: https://aistudio.google.com/app/apikey
2. ✅ Add to `backend/.env`
3. ✅ Start the system
4. ✅ Watch the AI-powered insights! 🚀

---

**Questions?** Check the MLH resources above or see [REAL_PATHWAY_LLM_SETUP.md](REAL_PATHWAY_LLM_SETUP.md)
