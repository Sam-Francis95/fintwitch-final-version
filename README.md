# Fintwitch - Financial Transaction Tracker

A full-stack financial transaction tracker using **Pathway**, **FastAPI**, and **React**.

## 🏗️ Architecture

- **Backend**: Python with Pathway + FastAPI
- **Frontend**: React with Vite
- **Communication**: REST API (POST requests)

## 🚀 Getting Started

### Backend Setup

1. Install Python dependencies:
```bash
pip install pathway fastapi uvicorn pydantic
```

2. Run the FastAPI server:
```bash
python main.py
```

The server will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm run dev
```

The React app will start on `http://localhost:3000`

## 📡 API Endpoints

### POST /transaction
Add a new transaction
```json
{
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "type": "expense"
}
```

### GET /transactions
Retrieve all stored transactions

### DELETE /transactions
Clear all transactions

### GET /
Health check and transaction count

## 💡 Usage

1. Start the backend server (port 8000)
2. Start the React frontend (port 3000)
3. Open http://localhost:3000 in your browser
4. Add transactions using the form
5. Watch them appear in real-time!

## 🔧 Technology Stack

- **Pathway**: Real-time data processing
- **FastAPI**: Modern Python web framework
- **React**: UI library
- **Vite**: Fast build tool
- **Uvicorn**: ASGI server
