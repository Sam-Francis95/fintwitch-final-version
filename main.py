# import pathway as pw  # Comment out for now - can be integrated later
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import List, Optional
from datetime import datetime

# FastAPI app
app = FastAPI(title="Fintwitch Transaction API")

# CORS middleware to allow React app to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:3004"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for transactions
transactions: List[dict] = []

# Pydantic model for transaction data
class Transaction(BaseModel):
    amount: float
    category: str
    description: Optional[str] = ""
    type: str  # "income" or "expense"
    date: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "🚀 Pathway + FastAPI backend is ready!", "transactions_count": len(transactions)}

@app.post("/transaction")
async def create_transaction(transaction: Transaction):
    """Receive and store a financial transaction"""
    transaction_data = transaction.dict()
    
    # Add timestamp if not provided
    if not transaction_data.get("date"):
        transaction_data["date"] = datetime.now().isoformat()
    
    # Add unique ID
    transaction_data["id"] = len(transactions) + 1
    
    # Store in memory
    transactions.append(transaction_data)
    
    print(f"📝 New transaction received: {transaction_data}")
    
    return {
        "status": "success",
        "message": "Transaction stored successfully",
        "transaction": transaction_data,
        "total_transactions": len(transactions)
    }

@app.get("/transactions")
async def get_transactions():
    """Get all stored transactions"""
    return {
        "transactions": transactions,
        "count": len(transactions)
    }

@app.delete("/transactions")
async def clear_transactions():
    """Clear all transactions"""
    transactions.clear()
    return {"status": "success", "message": "All transactions cleared"}

if __name__ == "__main__":
    print("🚀 Starting Pathway + FastAPI server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)

