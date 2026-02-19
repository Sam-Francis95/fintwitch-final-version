<h1 align="center">FinTwitch - Final Version</h1>
<h3 align="center">💸 Gamified Personal Finance Web App with Analytics Backend 💰</h3>

<p align="center">
  <a href="https://fintwitch-fd0ea.web.app/"><img src="https://img.shields.io/badge/Live-Demo-FF00FF?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Python%20FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Analytics-Pathway-FF6B6B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</p>

---

## 🧠 What is FinTwitch?

**FinTwitch** is a **gamified personal finance web app** with an integrated **real-time analytics backend**.  
It combines **interactive tools**, **habit tracking**, **gaming mechanics**, and **data analytics** in a **GTA-inspired neon UI**.

🎯 **Live Demo:** [https://fintwitch-fd0ea.web.app/](https://fintwitch-fd0ea.web.app/)

---

## 🌟 Key Features

### 🎮 Game Features
- **Career Mode** – Progress through financial literacy levels
- **Games Zone** – MCQ quizzes, Dream Life Planner, Stock Market Simulator
- **Finance Tools** – FIRE, Tax, SIP, Loan EMI, Inflation calculators
- **Habit Tracker** – Build daily consistency with streaks
- **Achievements System** – Earn XP and unlock trophies
- **Stock Ticker** – Real-time stock updates and insights

### 📊 Analytics Backend (NEW)
- **Real-time Transaction Tracking** – Captures every game transaction
- **Pathway + FastAPI** – Streaming data analytics pipeline
- **Automatic Income/Expense Events** – Adaptive economy based on balance
- **REST API** – Query and analyze financial data
- **Interactive API Dashboard** – Test endpoints at `/docs`

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|---------------|
| **Game Frontend** | React.js, Tailwind CSS, Vite, Framer Motion, Recharts |
| **Event Generator** | Python Flask (Port 5000) |
| **Analytics Backend** | Python, Pathway, FastAPI, Uvicorn (Port 8000) |
| **Database & Auth** | Firebase (Firestore, Authentication) |

---

## 🚀 Quick Start

### Option 1: One-Click Startup (Recommended)
```bash
# Run the batch file in fin_final2 folder
Start_With_Analytics.bat
```
This starts all three servers:
- Game frontend (Port 3000)
- Event generator (Port 5000)  
- Analytics backend (Port 8000)

### Option 2: Manual Setup

**1. Analytics Backend**
```bash
cd "fintwitch python pathway"
python -m venv .venv
.venv\Scripts\activate
pip install pathway fastapi uvicorn pydantic
python main.py
```

**2. Event Generator**
```bash
cd fin_final2/backend
python financial_event_generator.py
```

**3. Game Frontend**
```bash
cd fin_final2
npm install
npm run dev
```

---

## 📡 Analytics API

Access the interactive API dashboard: **http://localhost:8000/docs**

### Endpoints

**GET /** - Health check and transaction count

**POST /transaction** - Add transaction
```json
{
  "amount": 100.50,
  "category": "food",
  "description": "Lunch",
  "type": "expense"
}
```

**GET /transactions** - Retrieve all transactions

**DELETE /transactions** - Clear all data

---

## 💡 How It Works

1. **Play the game** at localhost:3000
2. **Automatic events** generated every 3-10 seconds (income/expenses)
3. **All transactions** sent to analytics backend (port 8000)
4. **View data** at http://localhost:8000/transactions
5. **Adaptive economy** - More income when balance is low

---

## 🏗️ Project Structure

```
fintwitch-final-version/
├── fintwitch python pathway/    # Analytics backend
│   ├── main.py                  # FastAPI server
│   ├── .venv/                   # Python environment
│   └── README.md
│
└── fin_final2/                  # Game application
    ├── src/                     # React components
    ├── backend/                 # Event generator
    │   └── financial_event_generator.py
    └── Start_With_Analytics.bat # Launcher
