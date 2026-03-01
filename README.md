<h1 align="center">FinTwitch - Real-Time Financial Intelligence System v3.0</h1>
<h3 align="center">🌊 Continuous Data Streaming via Pathway · Real-Time Analytics · LLM-Powered Financial Advisory 🤖</h3>

<p align="center">
  <a href="https://fintwitch-fd0ea.web.app/"><img src="https://img.shields.io/badge/Live-Demo-FF00FF?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Streaming-REAL%20Pathway-FF6B6B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-REAL%20LLM-7C3AED?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</p>

---

## 🚀 **NEW in v3.0: Production-Grade Intelligence**

### ✅ **REAL Pathway Streaming Engine**
- Genuine Pathway library (not mock)
- Real `ConnectorSubject` for continuous ingestion
- Actual streaming operators: `with_columns()`, `groupby()`, `reduce()`
- True time-windowed analytics with `window_by()`
- Stateful aggregations with automatic recomputation

### ✅ **REAL LLM Integration**
- **OpenAI GPT-4/GPT-3.5** - Best quality AI insights
- **Ollama (Local)** - Free, private, runs on your machine
- Context-aware natural language generation
- Personalized financial recommendations
- Risk analysis with explanations

### ✅ **Production Architecture**
- No mock implementations (optional fallback if Pathway unavailable)
- Real-time callbacks from Pathway streams
- Asynchronous LLM processing
- Thread-safe state management
- Enterprise-grade error handling

📚 **Setup Guide:** [REAL_PATHWAY_LLM_SETUP.md](REAL_PATHWAY_LLM_SETUP.md)

---

## 🧠 What is FinTwitch?

**FinTwitch** is a **production-grade real-time financial intelligence and decision-support system** powered by genuine Pathway streaming and real LLM AI.  
It performs **continuous financial analysis** by ingesting live data streams — generated from user actions, financial events, and external market signals — and processing them in real time through **Pathway, the core streaming engine**, to deliver practical financial insights, risk assessments, and personalized recommendations.

> **"User actions, financial events, and external signals generate continuous data streams → Pathway ingests, transforms, and aggregates in real time → AI advisor delivers personalized insights"**

🎯 **Live Demo:** [https://fintwitch-fd0ea.web.app/](https://fintwitch-fd0ea.web.app/)  
📚 **Hackathon Docs:** [PATHWAY_HACKATHON_DOCS.md](PATHWAY_HACKATHON_DOCS.md)  
🔧 **Setup Real Intelligence:** [REAL_PATHWAY_LLM_SETUP.md](REAL_PATHWAY_LLM_SETUP.md)

---

## 🌟 Key Features

### 🖥️ Core Platform Features
- **Career Progression Module** – Structured financial literacy pathway across 6 competency levels
- **Financial Decision Simulation Lab** – Scenario-based modules (MCQ assessments, Finance IQ Challenge, Stock Market Simulator) for exploring the consequences of financial choices
- **Finance Tools Suite** – FIRE, Tax, SIP, Loan EMI, Inflation calculators for real-world analysis
- **Habit Tracker** – Monitor daily financial discipline with consistency metrics and behavioral insights
- **Progress & Achievement System** – Track user progress milestones and unlock competency indicators
- **Stock Ticker** – Real-time stock updates with AI-driven analysis

### 🌊 Real Pathway Intelligence Engine v3.0 ⭐
- **REAL Pathway Streaming** – Genuine Pathway library with `ConnectorSubject`, not mock
- **Real Streaming Operators** – `with_columns()`, `groupby()`, `reduce()`, `window_by()`
- **Time-Windowed Analytics** – Actual temporal operations with rolling windows (1-60 min)
- **Stateful Aggregations** – True streaming aggregations with automatic recomputation
- **Category GroupBy** – Real `groupby('category').reduce()` operations
- **REAL LLM AI** – OpenAI GPT-4/GPT-3.5 or local Ollama for genuine intelligence
- **Context-Aware Prompts** – AI receives live financial metrics for personalized advice
- **Natural Language Insights** – Real AI-generated summaries, risk analysis, recommendations
- **Financial Intelligence** – 8 rule-based checks (overspending, balance, risk, patterns)
- **Production Architecture** – Thread-safe, async LLM calls, Pathway callbacks
- **7 Live Endpoints** – `/ingest`, `/metrics`, `/categories`, `/windowed`, `/intelligence`, `/insights/llm`, `/status`

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|---------------|
| **Application Frontend** | React 18, Zustand, Tailwind CSS, Vite, Framer Motion, Recharts |
| **Event Generator** | Python Flask (Port 5000, 5001) |
| **Pathway Intelligence** | Pathway Streaming, Time Windows, Aggregations, LLM Integration |
| **Analytics Backend** | FastAPI, Uvicorn (Port 8000) - Serves Pathway computations |
| **Database & Auth** | Firebase (Firestore, Authentication) |
| **AI Components** | LLM Mock (ready for Pathway xPack) |

### Architecture Philosophy
**Pathway-Centric Design:** All financial computations happen **inside the Pathway streaming layer**, not in application code. FastAPI serves only as an ingestion and serving interface.

---

## 🚀 Quick Start

### ⚡ One-Click Startup
```bash
# Run from fin_final2 folder
Start_With_Analytics.bat
```

**This launches:**
1. **REAL Pathway Intelligence** (Port 8000) - Production streaming engine
2. **Event Generators** (Port 5000, 5001) - Transaction creation
3. **React Frontend** (Port 3000) - Opens to Pathway Dashboard

**Access Points:**
- 🖥️ **Application:** http://localhost:3000
- 🌊 **Pathway Dashboard:** http://localhost:3000/pathway
- 📊 **API Docs:** http://localhost:8000/docs
- 🤖 **LLM Insights:** http://localhost:8000/insights/llm
- 💡 **Status:** http://localhost:8000/status

### 🔧 Setup for Real Intelligence

**1. Install Dependencies**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ..
npm install
```

**2. Configure LLM (Optional but Recommended)**

Create `backend/.env` file:
```env
# Option A: Google Gemini (Recommended - FREE!)
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-1.5-flash

# Option B: OpenAI (Paid)
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Option C: Ollama (Free, Local)
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2

# Option D: Mock (Fallback)
LLM_PROVIDER=mock
```

**Get Gemini Key (FREE):** https://aistudio.google.com/app/apikey  
**MLH Resources:** [mlh.link/gemini-quickstart](https://mlh.link/gemini-quickstart)  
**Get OpenAI Key:** https://platform.openai.com/api-keys  
**Install Ollama:** https://ollama.ai/

📚 **Gemini Setup Guide:** [GEMINI_SETUP.md](GEMINI_SETUP.md) ⭐ Start here!  
📚 **Full Setup Guide:** [REAL_PATHWAY_LLM_SETUP.md](REAL_PATHWAY_LLM_SETUP.md)

**3. Start REAL Pathway Engine**
```bash
cd backend
python pathway_streaming_real.py
# Runs on port 8000 with real Pathway (if installed)
```

**4. Start Event Generators**
```bash
# Terminal 1
python financial_event_generator.py  # Port 5000

# Terminal 2
python budget_system.py  # Port 5001
```

**4. Start Frontend**
```bash
npm run dev  # Port 3000
```

---

## 🌊 Real Pathway Intelligence API v3.0

**Interactive Docs:** http://localhost:8000/docs

**NEW:** All computations use genuine Pathway streaming + Real LLM AI

### Core Endpoints

#### 📥 **POST /ingest** - Ingest Transaction Stream
```json
{
  "type": "expense",
  "amount": 1500,
  "category": "food",
  "timestamp": "2026-02-20T15:30:00",
  "description": "Groceries"
}
```

#### 📊 **GET /metrics** - Real-Time Financial Metrics
Returns:
```json
{
  "total_income": 50000,
  "total_expenses": 32000,
  "balance": 18000,
  "transaction_count": 145,
  "financial_health_score": 68.5
}
```

#### 🏷️ **GET /metrics/categories** - Category Breakdown
Streaming aggregations grouped by category:
```json
{
  "food": {"income": 0, "expenses": 8500, "net": -8500, "count": 34},
  "salary": {"income": 50000, "expenses": 0, "net": 50000, "count": 2}
}
```

#### ⏱️ **GET /metrics/windowed?window_minutes=5** - Time-Windowed Analytics
Rolling window analysis (1-60 minutes):
```json
{
  "window_minutes": 5,
  "recent_income": 0,
  "recent_expenses": 2400,
  "recent_transactions": 8,
  "spending_rate_per_minute": 480
}
```

#### 💡 **GET /intelligence** - Financial Intelligence Layer
Rule-based alerts, warnings, and insights:
```json
{
  "alerts": ["🚨 OVERSPENDING: Expenses exceed income"],
  "warnings": ["💰 Low balance: Only ₹500 remaining"],
  "insights": ["📊 'entertainment' is 35% of spending"],
  "recommendations": ["🎯 Reduce discretionary spending by 20%"],
  "risk_level": "HIGH",
  "financial_health_score": 42.3,
  "risk_factors": {
    "overspending": true,
    "low_balance": true
  }
}
```

#### 🤖 **GET /insights/llm** - REAL LLM AI Insights ⭐
**NEW:** Genuine AI-generated insights using OpenAI GPT or Ollama
```json
{
  "summary": "⚠️ High financial risk detected. Your expenses (₹32,000) exceed income (₹25,000)...",
  "risk_analysis": "Risk is HIGH because expenses represent 128% of income. Sustainable spending should stay below 80%...",
  "recommendations": [
    "🎯 Priority 1: Reduce discretionary spending by 25%",
    "💰 Priority 2: Increase income through side projects",
    "📊 Priority 3: Focus cuts on 'entertainment' category (40% of total)"
  ],
  "confidence": 0.92,
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

#### ✅ **GET /status** - Engine Capabilities
System health and feature status

---

## 💡 How It Works

### Data Flow

```
User Actions (Financial Tools / Scenario Simulations / External Market Signals)
        ↓
Event Generator (Flask:5000) - Creates transaction events
        ↓
POST /ingest → Pathway Streaming Engine (Port 8000)
        ↓
[All Computations Happen in Pathway Layer]
├─ Stream transformations (signed amounts)
├─ Running aggregations (totals, balance)
├─ Category grouping (groupby operations)
├─ Time windows (rolling 1-60 min)
├─ Intelligence rules (alerts, risk scoring)
└─ LLM processing (natural language)
        ↓
API Serving Layer (FastAPI endpoints)
        ↓
Frontend Auto-Refresh (2-5 second intervals)
        ↓
Real-Time UI Updates (no manual refresh)
```

### Key Principles

1. **Pathway-Centric:** All financial logic lives in streaming layer
2. **Continuous Computation:** Automatic recomputation on every event
3. **Time-Aware:** Rolling windows understand "recency" and "velocity"
4. **Intelligent:** Rule-based reasoning detects patterns and risks
5. **AI-Enhanced:** LLM generates natural language insights

---

## 🏗️ Project Structure

```
fin_final2/
├── backend/
│   ├── pathway_streaming_v2.py          # 🌊 Pathway Intelligence Engine (NEW)
│   ├── pathway_mock_advanced.py         # 🔧 Advanced Pathway Mock (NEW)
│   ├── financial_event_generator.py     # Event creation (Port 5000)
│   ├── budget_system.py                 # Budget API (Port 5001)
│   └── requirements.txt
│
├── src/
│   ├── components/
│   │   ├── IntelligencePanel.jsx        # 💡 Alerts & Warnings (NEW)
│   │   ├── LLMInsightsPanel.jsx         # 🤖 AI Insights (NEW)
│   │   ├── WindowedMetrics.jsx          # ⏱️ Time Windows (NEW)
│   │   ├── CategoryBreakdown.jsx        # 🏷️ Category Aggregations (NEW)
│   │   ├── PathwayMetrics.jsx           # Core metrics display
│   │   └── ... (application components)
│   │
│   ├── pages/
│   │   ├── PathwayDashboard.jsx         # 🌊 Enhanced Intelligence Dashboard
│   │   ├── HomePage.jsx                 # Application home
│   │   ├── CareerLevelPage.jsx          # Career progression module
│   │   └── ... (other pages)
│   │
│   ├── store/
│   │   └── useGameStore.js              # Zustand application state management
│   │
│   └── ... (context, hooks, utils)
│
├── Start_With_Analytics.bat             # 🚀 One-click launcher (v2.0)
├── PATHWAY_HACKATHON_DOCS.md            # 📚 Complete hackathon documentation
├── README.md                            # This file
└── package.json                         # Frontend dependencies
```

### Key Files (v2.0)

- **pathway_streaming_v2.py** (700 lines) - Complete Pathway intelligence engine
- **pathway_mock_advanced.py** (470 lines) - Production-grade mock with time windows
- **IntelligencePanel.jsx** (200 lines) - Financial intelligence visualization
- **LLMInsightsPanel.jsx** (140 lines) - AI-powered natural language advisor
- **WindowedMetrics.jsx** (180 lines) - Time-windowed analytics display
- **CategoryBreakdown.jsx** (150 lines) - Category aggregation visualization

---

## 🏆 What Makes This Hackathon-Ready?

### ✅ Pathway-Centric Architecture
- **All computations in streaming layer** - Not just API calls to Pathway
- **FastAPI is only ingestion/serving** - Business logic lives in Pathway
- **True streaming transformations** - Continuous recomputation, not batch
- **Clean separation of concerns** - Demonstrates Pathway value proposition

### ⏱️ Advanced Streaming Features
- **Unbounded event streams** - ConnectorSubject for continuous ingestion
- **Time-windowed analytics** - Rolling windows (1-60 minutes) with configurable duration
- **Category aggregations** - GroupBy operations on streaming data
- **Stateful computations** - Running totals, balances, health scores
- **Pattern detection** - Spike detection, velocity monitoring, behavioral analysis

### 💡 Intelligence Layer
- **8 Rule-Based Checks:**
  1. Overspending detection (expenses > income)
  2. Balance decline monitoring (negative/low balance)
  3. Emergency fund risk assessment (<₹5000 threshold)
  4. Rapid spending detection (>₹100/min velocity)
  5. Category-based insights (high-spend categories)
  6. Risk level classification (CRITICAL/HIGH/MEDIUM/LOW)
  7. Behavioral pattern recognition
  8. Financial health scoring (0-100 scale)

### 🤖 Real-Time AI Financial Advisor (xPack Ready)
- **Live context-aware analysis** - AI receives live metrics and external signals before generating any response
- **Natural language risk assessments** - Explains current risk level using actual streaming data
- **Personalized recommendations** - Context-driven, actionable financial guidance and forecasts
- **Proactive warnings** - Flags deteriorating financial indicators before they become critical
- **Confidence scoring** - Transparency indicators for AI-generated outputs
- **Mock implementation ready for real LLM** - Drop-in replacement architecture

### 🎨 Production-Quality Frontend
- **4 New Intelligence Components** - Real-time auto-updating panels
- **Polished UI** - Clean, professional dashboard design optimized for data clarity
- **Responsive layouts** - Grid-based intelligent dashboards
- **Auto-refresh intervals** - 2-5 second polling driven by event-driven architecture
- **Interactive visualizations** - Recharts pie charts, progress bars, financial health indicators

### 📚 Comprehensive Documentation
- **PATHWAY_HACKATHON_DOCS.md** - Complete technical documentation
- **Demo script included** - 5-minute walkthrough for judges
- **API documentation** - Interactive Swagger UI at `/docs`
- **Architecture diagrams** - Clear data flow explanations
- **Testing instructions** - Multiple verification methods

### 🚀 One-Click Demo
- **Start_With_Analytics.bat** - Launches entire system
- **Auto-opens browser** - Direct to Pathway Dashboard
- **Pre-configured ports** - No manual configuration needed
- **Graceful error handling** - Works even with mock Pathway

### 🌍 Real-World Impact
- **Decision-support system** - Helps users understand the financial consequences of their choices
- **Risk management** - Continuously monitors risk exposure and alerts users before situations become critical
- **Actionable insights** - Produces concrete outputs: risk scores, spending projections, alerts, and financial health indicators
- **Behavioral analytics** - Tracks and reinforces positive financial habits through engagement metrics
- **Scalable design** - Event-driven architecture ready for production deployment

---

## 📖 Documentation

- **[README.md](README.md)** - This file (quick overview)
- **[PATHWAY_HACKATHON_DOCS.md](PATHWAY_HACKATHON_DOCS.md)** - Complete hackathon documentation
- **[PATHWAY_INTEGRATION.md](PATHWAY_INTEGRATION.md)** - Integration details
- **API Docs** - http://localhost:8000/docs (interactive)

---

## 🎯 Quick Demo Checklist

**For Hackathon Judges:**

1. ✅ **Launch System** - Run `Start_With_Analytics.bat`
2. ✅ **View Dashboard** - Opens to http://localhost:3000/pathway
3. ✅ **Generate Transactions** - Use Financial Tools or Scenario Simulation modules
4. ✅ **Watch Real-Time Updates** - Metrics update automatically
5. ✅ **Test Time Windows** - Change window duration, see filtering
6. ✅ **Trigger Intelligence** - Make expenses > income, see alerts
7. ✅ **Check LLM Insights** - View natural language recommendations
8. ✅ **Explore API** - Open http://localhost:8000/docs
9. ✅ **Test Endpoints** - Try POST /ingest, GET /intelligence
10. ✅ **Review Code** - Check pathway_streaming_v2.py architecture

**Demo Duration:** 5-10 minutes  
**Wow Factor:** Real-time intelligence + LLM + Time windows + Clean UI

---

## 🔗 Links

- 🌐 **Live Demo:** https://fintwitch-fd0ea.web.app/
- 📚 **Docs:** http://localhost:8000/docs (when running locally)
- 💬 **Status:** http://localhost:8000/status (engine capabilities)

---

## 🙏 Acknowledgments

Built with:
- **Pathway** - Real-time streaming data framework
- **React** - Frontend framework
- **FastAPI** - Python web framework
- **Firebase** - Authentication and database
- **Tailwind CSS** - Styling

---

<div align="center">

**FinTwitch Financial Intelligence System v3.0**  
*Continuous Streaming Analytics · Real-Time Risk Assessment · AI-Powered Financial Advisory* 🌊💡

Made with ❤️ for the Pathway Hackathon

</div>
