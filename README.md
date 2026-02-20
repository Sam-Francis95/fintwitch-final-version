<h1 align="center">FinTwitch - Intelligence Edition v2.0</h1>
<h3 align="center">🌊 Gamified Finance + Pathway Real-Time Intelligence Platform 💡</h3>

<p align="center">
  <a href="https://fintwitch-fd0ea.web.app/"><img src="https://img.shields.io/badge/Live-Demo-FF00FF?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Streaming-Pathway-FF6B6B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-LLM%20Insights-7C3AED?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</p>

---

## 🧠 What is FinTwitch?

**FinTwitch** is a **Pathway-powered real-time financial intelligence platform** wrapped in an engaging gamified experience.  
It combines **interactive learning**, **habit tracking**, **simulations**, and **streaming analytics with AI insights** in a **GTA-inspired neon UI**.

> **"Gaming generates data → Pathway provides intelligence"**

🎯 **Live Demo:** [https://fintwitch-fd0ea.web.app/](https://fintwitch-fd0ea.web.app/)  
📚 **Hackathon Docs:** [PATHWAY_HACKATHON_DOCS.md](PATHWAY_HACKATHON_DOCS.md)

---

## 🌟 Key Features

### 🎮 Game Features
- **Career Mode** – Progress through 6 financial literacy levels
- **Games Zone** – MCQ quizzes, Dream Life Planner, Pathway Stock Market
- **Finance Tools** – FIRE, Tax, SIP, Loan EMI, Inflation calculators
- **Habit Tracker** – Build daily consistency with streaks & insights
- **Achievements System** – Earn XP and unlock trophies
- **Stock Ticker** – Real-time stock updates with AI analysis

### 🌊 Pathway Intelligence Engine v2.0 (NEW)
- **Real-Time Stream Processing** – Unbounded event streams with continuous transformations
- **Time-Windowed Analytics** – Rolling windows (1-60 minutes) for recent activity analysis
- **Category Aggregations** – Grouped streaming computations by category
- **Financial Intelligence Layer** – Overspending detection, balance alerts, risk scoring
- **LLM Integration** – Natural language summaries and personalized recommendations
- **Health Scoring** – Real-time financial health calculation (0-100)
- **Behavioral Insights** – Pattern detection and velocity monitoring
- **6 Live Endpoints** – Comprehensive API for metrics, intelligence, and insights

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|---------------|
| **Game Frontend** | React 18, Zustand, Tailwind CSS, Vite, Framer Motion, Recharts |
| **Event Generator** | Python Flask (Port 5000, 5001) |
| **Pathway Intelligence** | Pathway Streaming, Time Windows, Aggregations, LLM Integration |
| **Analytics Backend** | FastAPI, Uvicorn (Port 8000) - Serves Pathway computations |
| **Database & Auth** | Firebase (Firestore, Authentication) |
| **AI Components** | LLM Mock (ready for Pathway xPack) |

### Architecture Philosophy
**Pathway-Centric Design:** All financial computations happen **inside the Pathway streaming layer**, not in application code. FastAPI serves only as an ingestion and serving interface.

---

## 🚀 Quick Start

### ⚡ One-Click Startup (Recommended)
```bash
# Run from fin_final2 folder
Start_With_Analytics.bat
```

**This launches:**
1. **Pathway Intelligence Engine** (Port 8000) - Streaming analytics
2. **Event Generators** (Port 5000, 5001) - Transaction creation
3. **React Frontend** (Port 3000) - Opens to Pathway Dashboard

**Access Points:**
- 🎮 **Game:** http://localhost:3000
- 🌊 **Pathway Dashboard:** http://localhost:3000/pathway
- 📊 **API Docs:** http://localhost:8000/docs
- 💡 **Status:** http://localhost:8000/status

### 🔧 Manual Setup

**1. Install Dependencies**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ..
npm install
```

**2. Start Pathway Intelligence Engine**
```bash
cd backend
python pathway_streaming_v2.py
# Runs on port 8000
```

**3. Start Event Generators**
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

## 🌊 Pathway Intelligence API v2.0

**Interactive Docs:** http://localhost:8000/docs

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

#### 🤖 **GET /insights/llm** - LLM-Powered Natural Language Insights
AI-generated summaries and recommendations:
```json
{
  "summary": "⚠️ High financial risk detected. Your expenses (₹32,000) exceed income (₹25,000)...",
  "risk_explanation": "Risk is HIGH because expenses represent 128% of income...",
  "recommendations": [
    "🎯 Priority: Reduce discretionary spending by 25%",
    "💰 Goal: Increase income through side projects"
  ],
  "confidence": 0.95
}
```

#### ✅ **GET /status** - Engine Capabilities
System health and feature status

---

## 💡 How It Works

### Data Flow

```
User Actions (Game/Tools/Simulations)
        ↓
Event Generator (Flask:5000) - Creates transactions
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
│   │   └── ... (game components)
│   │
│   ├── pages/
│   │   ├── PathwayDashboard.jsx         # 🌊 Enhanced Intelligence Dashboard
│   │   ├── HomePage.jsx                 # Game home
│   │   ├── CareerLevelPage.jsx          # Career mode
│   │   └── ... (other pages)
│   │
│   ├── store/
│   │   └── useGameStore.js              # Zustand state management
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

### 🤖 LLM Integration (xPack Ready)
- **Natural language summaries** - Narrative financial status
- **Risk explanations** - Why risk is at current level
- **Personalized recommendations** - Context-aware actionable advice
- **Confidence scoring** - LLM certainty indicators
- **Mock implementation ready for real LLM** - Drop-in replacement architecture

### 🎨 Production-Quality Frontend
- **4 New Intelligence Components** - Real-time auto-updating panels
- **Polished UI** - GTA-inspired cyberpunk design
- **Responsive layouts** - Grid-based intelligent dashboards
- **Auto-refresh intervals** - 2-5 second polling (demonstrates streaming)
- **Interactive visualizations** - Recharts pie charts, progress bars, health indicators

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
- **Educational platform** - Teaches financial literacy
- **Gamified engagement** - Makes learning fun
- **Actionable insights** - Not just metrics, but recommendations
- **Habit building** - Encourages positive financial behaviors
- **Scalable design** - Ready for production deployment

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
3. ✅ **Generate Transactions** - Use Career Mode or Tools
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

**FinTwitch Intelligence v2.0**  
*Where Gaming Meets Real-Time Intelligence* 🌊💡

Made with ❤️ for the Pathway Hackathon

</div>
