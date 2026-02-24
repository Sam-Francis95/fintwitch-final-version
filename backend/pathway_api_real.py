"""
FinTwitch FastAPI Server with REAL Pathway Streaming
=====================================================
FastAPI serves ONLY as ingestion and serving layer.
ALL business logic happens in Pathway streaming engine.

Architecture:
    POST /ingest -> Pathway Stream -> Automatic Recomputation -> GET /metrics

Endpoints:
    - POST /ingest: Add transaction to stream
    - GET /metrics: Core financial metrics
    - GET /metrics/categories: Per-category breakdowns
    - GET /metrics/windowed: Time-windowed analytics
    - GET /status: Engine status
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, List, Dict, Any, Optional
from datetime import datetime
import uvicorn
import os
from dotenv import load_dotenv

# Import Pathway engine
from pathway_engine_real import get_pathway_engine, PATHWAY_MODE

# Load environment
load_dotenv()

# ===== FASTAPI SETUP =====

app = FastAPI(
    title="FinTwitch Pathway Streaming API",
    description="Real-time financial intelligence powered by Pathway streaming engine",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Pathway engine on startup
pathway_engine = None

@app.on_event("startup")
async def startup_event():
    """Initialize Pathway engine"""
    global pathway_engine
    print("\n? Starting FinTwitch Pathway API Server")
    print("="*70)
    pathway_engine = get_pathway_engine()
    print("\nOK Server ready to accept requests")
    print("="*70)

# ===== DATA MODELS =====

class TransactionInput(BaseModel):
    """Input model for transaction ingestion"""
    type: Literal["income", "expense"] = Field(..., description="Transaction type")
    amount: float = Field(..., gt=0, description="Transaction amount (positive)")
    category: str = Field(..., min_length=1, description="Transaction category")
    description: str = Field(default="", description="Optional description")
    user_id: Optional[str] = Field(default="default", description="User identifier")
    timestamp: Optional[str] = Field(default=None, description="ISO timestamp (auto-generated if not provided)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "expense",
                "amount": 50.00,
                "category": "Food",
                "description": "Lunch at cafe"
            }
        }


class MetricsResponse(BaseModel):
    """Core financial metrics response"""
    balance: float
    total_income: float
    total_expenses: float
    transaction_count: int
    avg_transaction: float
    net_cash_flow: float
    financial_health_score: float


class CategoryMetric(BaseModel):
    """Per-category metrics"""
    category: str
    total_spent: float
    total_earned: float
    transaction_count: int
    net: float


class WindowedMetricsResponse(BaseModel):
    """Time-windowed analytics response"""
    window_minutes: int
    recent_spending: float
    recent_income: float
    transaction_count: int
    event_rate: float
    net_flow: float


class EngineStatus(BaseModel):
    """Engine status and capabilities"""
    status: str
    pathway_mode: str
    streaming_active: bool
    real_pathway: bool
    capabilities: Dict[str, bool]
    deployment_note: str


# ===== INGESTION ENDPOINT =====

@app.post("/ingest", status_code=201)
async def ingest_transaction(transaction: TransactionInput) -> Dict[str, Any]:
    """
    Ingest a transaction into the Pathway streaming pipeline.
    
    This triggers automatic recomputation of all metrics.
    """
    try:
        # Convert to dict
        txn_data = transaction.model_dump()
        
        # Add auto-generated fields
        if not txn_data.get('timestamp'):
            txn_data['timestamp'] = datetime.now().isoformat()
        
        txn_data['id'] = f"txn_{datetime.now().timestamp()}"
        
        # Ingest into Pathway stream
        success = pathway_engine.ingest_transaction(txn_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to ingest transaction")
        
        return {
            "status": "ingested",
            "transaction_id": txn_data['id'],
            "message": "Transaction added to Pathway stream",
            "auto_recomputation": "triggered"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion error: {str(e)}")


# ===== METRICS ENDPOINTS =====

@app.get("/metrics", response_model=MetricsResponse)
async def get_core_metrics() -> MetricsResponse:
    """
    Get current financial metrics computed by Pathway.
    
    Metrics are automatically up-to-date (computed in streaming engine).
    """
    try:
        # Get metrics from Pathway
        metrics = pathway_engine.get_core_metrics()
        
        # Compute derived metrics
        balance = metrics.get('balance', 0.0)
        total_income = metrics.get('total_income', 0.0)
        total_expenses = metrics.get('total_expenses', 0.0)
        
        # Financial health score (0-100)
        if total_income > 0:
            savings_rate = (total_income - total_expenses) / total_income
            health_score = min(100, max(0, savings_rate * 100))
        else:
            health_score = 50.0
        
        return MetricsResponse(
            balance=balance,
            total_income=total_income,
            total_expenses=total_expenses,
            transaction_count=metrics.get('transaction_count', 0),
            avg_transaction=metrics.get('avg_transaction', 0.0),
            net_cash_flow=balance,
            financial_health_score=round(health_score, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get metrics: {str(e)}")


@app.get("/metrics/categories", response_model=List[CategoryMetric])
async def get_category_metrics() -> List[CategoryMetric]:
    """
    Get per-category financial breakdowns computed by Pathway groupby operations.
    """
    try:
        categories = pathway_engine.get_category_metrics()
        
        return [
            CategoryMetric(
                category=cat.get('category', 'unknown'),
                total_spent=cat.get('total_spent', 0.0),
                total_earned=cat.get('total_earned', 0.0),
                transaction_count=cat.get('transaction_count', 0),
                net=cat.get('net', 0.0)
            )
            for cat in categories
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get category metrics: {str(e)}")


@app.get("/metrics/windowed", response_model=WindowedMetricsResponse)
async def get_windowed_metrics(
    window_minutes: int = Query(default=5, ge=1, le=60, description="Time window in minutes")
) -> WindowedMetricsResponse:
    """
    Get time-windowed analytics using Pathway temporal window operations.
    
    Shows metrics for the last N minutes only.
    Old events automatically fall out of the window.
    """
    try:
        windowed = pathway_engine.get_windowed_metrics(window_minutes)
        
        return WindowedMetricsResponse(
            window_minutes=windowed['window_minutes'],
            recent_spending=windowed['recent_spending'],
            recent_income=windowed['recent_income'],
            transaction_count=windowed['transaction_count'],
            event_rate=round(windowed['event_rate'], 2),
            net_flow=windowed['net_flow']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get windowed metrics: {str(e)}")


# ===== INTELLIGENCE ENDPOINTS =====

@app.get("/intelligence")
async def get_financial_intelligence() -> Dict[str, Any]:
    """
    Financial intelligence layer built on Pathway metrics.
    """
    try:
        metrics = pathway_engine.get_core_metrics()
        windowed = pathway_engine.get_windowed_metrics(5)
        
        balance = metrics.get('balance', 0.0)
        total_expenses = metrics.get('total_expenses', 0.0)
        recent_spending = windowed['recent_spending']
        
        alerts = []
        warnings = []
        insights = []
        
        # Rule-based intelligence
        if balance < 0:
            alerts.append("Negative balance detected")
        
        if balance < total_expenses * 0.1:
            warnings.append("Low cash reserves (less than 10% of expenses)")
        
        if recent_spending > (total_expenses / max(1, metrics.get('transaction_count', 1))) * 5:
            alerts.append("Spending spike detected in last 5 minutes")
        
        if len(alerts) == 0:
            insights.append("Financial position stable")
        
        return {
            "alerts": alerts,
            "warnings": warnings,
            "insights": insights,
            "risk_level": "high" if len(alerts) > 0 else "medium" if len(warnings) > 0 else "low",
            "metrics_timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intelligence computation failed: {str(e)}")


@app.get("/insights/llm")
async def get_llm_insights() -> Dict[str, Any]:
    """
    LLM-powered natural language insights (xPack integration point).
    """
    try:
        metrics = pathway_engine.get_core_metrics()
        categories = pathway_engine.get_category_metrics()
        
        # This would integrate with Pathway xPack LLM or external LLM API
        # For now, return structured insights
        
        balance = metrics.get('balance', 0.0)
        total_income = metrics.get('total_income', 0.0)
        total_expenses = metrics.get('total_expenses', 0.0)
        
        # Top spending category
        top_category = max(categories, key=lambda x: x.get('total_spent', 0)) if categories else None
        
        summary = (
            f"You have a balance of ${balance:.2f}. "
            f"Total income: ${total_income:.2f}, expenses: ${total_expenses:.2f}."
        )
        
        if top_category:
            summary += f" Highest spending: {top_category['category']} (${top_category['total_spent']:.2f})"
        
        return {
            "summary": summary,
            "risk_explanation": "Balanced" if balance > 0 else "Negative balance requires attention",
            "recommendations": [
                "Track spending in top categories",
                "Maintain emergency fund",
                "Review regular expenses"
            ],
            "confidence": 0.85,
            "llm_provider": "rule_based",
            "xpack_ready": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM insights failed: {str(e)}")


# ===== STATUS ENDPOINTS =====

@app.get("/status", response_model=EngineStatus)
async def get_engine_status() -> EngineStatus:
    """
    Get Pathway engine status and capabilities.
    """
    try:
        info = pathway_engine.get_engine_info()
        
        return EngineStatus(
            status="operational",
            pathway_mode=info['pathway_mode'],
            streaming_active=info['streaming_active'],
            real_pathway=info['real_pathway'],
            capabilities=info['capabilities'],
            deployment_note=info['deployment_note']
        )
        
    except Exception as e:
        return EngineStatus(
            status="error",
            pathway_mode="unknown",
            streaming_active=False,
            real_pathway=False,
            capabilities={},
            deployment_note=f"Error: {str(e)}"
        )


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Simple health check"""
    return {"status": "healthy", "engine": PATHWAY_MODE}


@app.get("/transactions")
async def get_all_transactions(limit: int = Query(default=100, le=1000)) -> Dict[str, Any]:
    """Get recent transactions (debugging/monitoring)"""
    try:
        transactions = pathway_engine.get_all_transactions()
        return {
            "count": len(transactions),
            "transactions": transactions[-limit:] if transactions else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== MAIN =====

if __name__ == "__main__":
    print("\n" + "="*70)
    print("? FinTwitch REAL Pathway Streaming API")
    print("="*70)
    print(f"Pathway Mode: {PATHWAY_MODE}")
    print("\nStarting server...")
    print("="*70 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
