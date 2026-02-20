"""
Pathway Real-Time Streaming Engine for FinTwitch
Processes financial transactions as an unbounded stream
Computes real-time metrics: balance, income, expenses, cash flow, risk
"""

# Try importing real Pathway, fallback to mock if unavailable
try:
    import pathway as pw
    # Check if it's the real Pathway by testing for key attributes
    if not hasattr(pw, 'Schema'):
        raise ImportError("Stub pathway package detected")
    USING_MOCK = False
    print("✓ Using real Pathway streaming engine")
except (ImportError, AttributeError):
    from pathway_mock import pw
    USING_MOCK = True
    print("⚠ Using mock Pathway implementation (install real Pathway for production)")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import uvicorn
from datetime import datetime

# ==================== FASTAPI SETUP ====================

app = FastAPI(title="FinTwitch Pathway Streaming Engine", version="1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== DATA MODELS ====================

class TransactionEvent(BaseModel):
    """Transaction event schema"""
    type: Literal["income", "expense"]
    amount: float
    category: str
    timestamp: str
    description: str = ""

# ==================== PATHWAY STREAMING SETUP ====================

# Create an input connector for streaming events
# Pathway schema is only needed for real Pathway, not for mock
if not USING_MOCK:
    class TransactionSchema(pw.Schema):
        type: str
        amount: float
        category: str
        timestamp: str
        description: str
else:
    # Mock doesn't need schema class
    TransactionSchema = None

# Global stream holder - will be populated when app starts
transaction_connector = None
transactions_table = None

def initialize_pathway_stream():
    """Initialize Pathway streaming engine"""
    global transaction_connector, transactions_table
    
    print("🚀 Initializing Pathway Streaming Engine...")
    
    if USING_MOCK:
        # Simple mock initialization
        from pathway_mock import ConnectorSubject
        transaction_connector = ConnectorSubject()
        transactions_table = transaction_connector.get_table()
    else:
        # Real Pathway initialization
        transaction_connector = pw.io.python.ConnectorSubject(
            schema=TransactionSchema,
            name="transactions"
        )
        transactions_table = transaction_connector.to_table()
    
    print("✅ Pathway Stream Initialized")
    print(f"   - Engine: {'Mock (Development)' if USING_MOCK else 'Real Pathway'}")
    print("   - Real-time transaction processing: ACTIVE")
    print("   - Metrics computation: ACTIVE")
    print("   - Risk assessment: ACTIVE")
    
    return transaction_connector, transactions_table

def compute_metrics_from_table():
    """Compute metrics from transaction table - works with mock"""
    if transactions_table is None:
        return None
    
    try:
        # Get all transactions
        if USING_MOCK:
            all_transactions = transactions_table.data
        else:
            all_transactions = pw.debug.table_to_dicts(transactions_table)
        
        if not all_transactions:
            return None
        
        # Compute metrics
        total_income = sum(t['amount'] for t in all_transactions if t['type'] == 'income')
        total_expenses = sum(t['amount'] for t in all_transactions if t['type'] == 'expense')
        balance = total_income - total_expenses
        transaction_count = len(all_transactions)
        risk = "HIGH" if total_expenses > total_income else "LOW"
        
        return {
            "balance": balance,
            "total_income": total_income,
            "total_expenses": total_expenses,
            "net_cash_flow": balance,
            "transaction_count": transaction_count,
            "risk": risk
        }
    except Exception as e:
        print(f"Error computing metrics: {e}")
        return None

# ==================== FASTAPI ENDPOINTS ====================

@app.on_event("startup")
async def startup_event():
    """Initialize Pathway on app startup"""
    initialize_pathway_stream()

@app.post("/ingest")
async def ingest_transaction(event: TransactionEvent):
    """
    Ingest a transaction event into Pathway stream
    This is the entry point for all financial transactions
    """
    if transaction_connector is None:
        raise HTTPException(status_code=500, detail="Pathway stream not initialized")
    
    try:
        # Forward event to Pathway stream
        transaction_connector.next(
            type=event.type,
            amount=event.amount,
            category=event.category,
            timestamp=event.timestamp,
            description=event.description
        )
        
        return {
            "status": "success",
            "message": "Transaction ingested into Pathway stream",
            "event": event.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest event: {str(e)}")

@app.get("/metrics")
async def get_metrics():
    """
    Get real-time financial metrics computed by Pathway
    Returns current balance, income, expenses, cash flow, and risk
    """
    default_metrics = {
        "balance": 0.0,
        "total_income": 0.0,
        "total_expenses": 0.0,
        "net_cash_flow": 0.0,
        "transaction_count": 0,
        "risk": "LOW",
        "message": "No transactions processed yet"
    }
    
    if transactions_table is None:
        return default_metrics
    
    try:
        metrics = compute_metrics_from_table()
        if metrics is None:
            return default_metrics
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute metrics: {str(e)}")

@app.get("/status")
async def status():
    """Check if Pathway streaming engine is running"""
    return {
        "status": "running",
        "engine": "Pathway Real-Time Streaming",
        "using_mock": USING_MOCK,
        "stream_active": transaction_connector is not None,
        "metrics_active": transactions_table is not None
    }

@app.get("/")
async def root():
    """API documentation"""
    return {
        "service": "FinTwitch Pathway Streaming Engine",
        "version": "1.0",
        "description": "Real-time financial transaction processing using Pathway",
        "endpoints": {
            "POST /ingest": "Ingest transaction events into stream",
            "GET /metrics": "Get real-time computed metrics",
            "GET /status": "Check engine status",
            "GET /docs": "Interactive API documentation"
        },
        "streaming_features": [
            "Unbounded event stream processing",
            "Real-time metric computation",
            "Automatic balance tracking",
            "Dynamic risk assessment",
            "Zero-latency updates"
        ]
    }

# ==================== MAIN ====================

if __name__ == "__main__":
    print("=" * 60)
    print("🌊 PATHWAY REAL-TIME STREAMING ENGINE")
    print("=" * 60)
    print("Port: 8000")
    print("Endpoints:")
    print("  - POST http://localhost:8000/ingest")
    print("  - GET  http://localhost:8000/metrics")
    print("  - GET  http://localhost:8000/status")
    print("  - GET  http://localhost:8000/docs")
    print("=" * 60)
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
