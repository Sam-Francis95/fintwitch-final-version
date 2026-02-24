"""
FinTwitch FastAPI Server with REAL Pathway Streaming
FastAPI is ONLY for ingestion and serving - all logic in Pathway
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, List, Dict, Any, Optional
from datetime import datetime
import uvicorn

from pathway_engine import get_engine, PATHWAY_MODE

# FastAPI setup
app = FastAPI(title="FinTwitch Pathway API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engine
engine = None

@app.on_event("startup")
async def startup():
    global engine
    engine = get_engine()


# Models
class TransactionInput(BaseModel):
    type: Literal["income", "expense"]
    amount: float
    category: str
    description: str = ""
    user_id: Optional[str] = "default"


# Endpoints
@app.post("/ingest", status_code=201)
async def ingest(txn: TransactionInput) -> Dict[str, Any]:
    """Ingest transaction into Pathway stream"""
    data = txn.model_dump()
    success = engine.ingest(data)
    
    if not success:
        raise HTTPException(500, "Ingestion failed")
    
    return {
        "status": "ingested",
        "message": "Transaction added to Pathway stream",
        "auto_recomputation": "triggered"
    }


@app.get("/metrics")
async def get_metrics() -> Dict[str, Any]:
    """Get core metrics (computed by Pathway)"""
    metrics = engine.get_metrics()
    
    # Add derived metrics
    balance = metrics['balance']
    income = metrics['total_income']
    
    health = 50.0
    if income > 0:
        savings = (income - metrics['total_expenses']) / income
        health = min(100, max(0, savings * 100))
    
    return {
        **metrics,
        'net_cash_flow': balance,
        'financial_health_score': round(health, 2)
    }


@app.get("/metrics/categories")
async def get_categories() -> Dict[str, Any]:
    """Get per-category breakdown (Pathway groupby)"""
    return {"categories": engine.get_categories()}


@app.get("/metrics/windowed")
async def get_windowed(window_minutes: int = 5) -> Dict[str, Any]:
    """Get time-windowed analytics (Pathway temporal)"""
    return engine.get_windowed(window_minutes)


@app.get("/intelligence")
async def get_intelligence() -> Dict[str, Any]:
    """Financial intelligence layer"""
    metrics = engine.get_metrics()
    windowed = engine.get_windowed(5)
    
    alerts = []
    warnings = []
    
    if metrics['balance'] < 0:
        alerts.append("Negative balance")
    
    if metrics['balance'] < metrics['total_expenses'] * 0.1:
        warnings.append("Low reserves")
    
    return {
        "alerts": alerts,
        "warnings": warnings,
        "insights": ["Financial position"] if not alerts else [],
        "risk_level": "high" if alerts else "medium" if warnings else "low"
    }


@app.get("/insights/llm")
async def get_llm_insights() -> Dict[str, Any]:
    """LLM insights (xPack integration point)"""
    metrics = engine.get_metrics()
    cats = engine.get_categories()
    
    balance = metrics['balance']
    top_cat = max(cats, key=lambda x: x['total_spent']) if cats else None
    
    summary = f"Balance: ${balance:.2f}. "
    if top_cat:
        summary += f"Top category: {top_cat['category']}"
    
    return {
        "summary": summary,
        "risk_explanation": "Balanced" if balance > 0 else "Attention needed",
        "recommendations": ["Track spending", "Build emergency fund"],
        "confidence": 0.85
    }


@app.get("/status")
async def get_status() -> Dict[str, Any]:
    """Engine status"""
    info = engine.get_info()
    return {
        "status": "operational",
        **info
    }


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "healthy", "engine": PATHWAY_MODE}


@app.get("/transactions")
async def get_transactions(limit: int = 100) -> Dict[str, Any]:
    """Get recent transactions"""
    txns = engine.get_all_transactions()
    return {"count": len(txns), "transactions": txns[-limit:]}


if __name__ == "__main__":
    print(f"\n{'='*70}")
    print("🌊 FinTwitch REAL Pathway Streaming API")
    print(f"{'='*70}")
    print(f"Pathway Mode: {PATHWAY_MODE}")
    print(f"{'='*70}\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
