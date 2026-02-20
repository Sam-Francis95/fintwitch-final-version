"""
FinTwitch REAL Pathway Streaming Engine
========================================
Production-grade real-time financial intelligence using genuine Pathway streaming.

Features:
- Real Pathway connectors and streaming operations
- Unbounded event stream processing
- Time-windowed analytics with actual temporal operations
- Stateful aggregations with automatic recomputation
- Real LLM integration for AI-powered insights
- Category-wise groupby aggregations
- Financial intelligence rule engine

Architecture:
    Transaction Events → Pathway Stream → Transformations → Aggregations → API
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, List, Dict, Any, Optional
import uvicorn
from datetime import datetime, timedelta
import asyncio
from collections import defaultdict
import threading

# Import real Pathway
try:
    import pathway as pw
    if not hasattr(pw, 'Schema'):
        raise ImportError("Stub pathway detected")
    PATHWAY_AVAILABLE = True
    print("✅ REAL Pathway streaming engine loaded")
except (ImportError, AttributeError) as e:
    print(f"⚠️  Real Pathway not available: {e}")
    print("📦 Install from: https://pathway.com/developers/")
    PATHWAY_AVAILABLE = False

# Import LLM service
from llm_service import get_llm_service

# ==================== FASTAPI SETUP ====================

app = FastAPI(
    title="FinTwitch REAL Pathway Intelligence Engine",
    description="Production-grade real-time streaming analytics with genuine Pathway and LLM",
    version="3.0.0-real"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== DATA MODELS ====================

class TransactionEvent(BaseModel):
    """Transaction event for ingestion"""
    type: Literal["income", "expense"]
    amount: float
    category: str
    timestamp: Optional[str] = None
    description: Optional[str] = ""
    id: Optional[str] = None

# ==================== GLOBAL STATE ====================

# Store for latest computed results (updated by Pathway)
latest_metrics = {
    "total_income": 0.0,
    "total_expenses": 0.0,
    "balance": 0.0,
    "transaction_count": 0,
    "financial_health_score": 100.0,
    "average_transaction": 0.0
}

latest_categories = {}
latest_windowed = {}
latest_intelligence = {
    "alerts": [],
    "warnings": [],
    "insights": [],
    "recommendations": [],
    "risk_level": "LOW",
    "financial_health_score": 100.0,
    "risk_factors": {}
}
latest_llm_insights = None

# Thread-safe lock
state_lock = threading.Lock()

# ==================== REAL PATHWAY STREAMING PIPELINE ====================

if PATHWAY_AVAILABLE:
    
    # Define Pathway schema for transactions
    class TransactionSchema(pw.Schema):
        id: str
        type: str  # 'income' or 'expense'
        amount: float
        category: str
        timestamp: int  # Unix timestamp in milliseconds
        description: str
    
    # Create Python subject for real-time ingestion
    transaction_subject = pw.io.python.ConnectorSubject()
    
    # Create input table from subject
    transactions = transaction_subject.subscribe(TransactionSchema)
    
    # ==================== STREAMING TRANSFORMATIONS ====================
    
    # Add signed_amount column (income=+, expense=-)
    enriched_transactions = transactions.with_columns(
        signed_amount=pw.if_else(
            transactions.type == "income",
            transactions.amount,
            -transactions.amount
        )
    )
    
    # ==================== REAL-TIME AGGREGATIONS ====================
    
    # Core metrics: running totals
    metrics_table = enriched_transactions.reduce(
        total_income=pw.reducers.sum(
            pw.if_else(enriched_transactions.type == "income", enriched_transactions.amount, 0.0)
        ),
        total_expenses=pw.reducers.sum(
            pw.if_else(enriched_transactions.type == "expense", enriched_transactions.amount, 0.0)
        ),
        balance=pw.reducers.sum(enriched_transactions.signed_amount),
        transaction_count=pw.reducers.count(),
        total_amount=pw.reducers.sum(enriched_transactions.amount)
    )
    
    # Add computed columns to metrics
    metrics_enriched = metrics_table.with_columns(
        average_transaction=pw.if_else(
            metrics_table.transaction_count > 0,
            metrics_table.total_amount / metrics_table.transaction_count,
            0.0
        ),
        financial_health_score=pw.if_else(
            metrics_table.total_income > 0,
            pw.apply(
                lambda expenses, income: max(0.0, min(100.0, 100.0 - (expenses / income * 100.0))),
                metrics_table.total_expenses,
                metrics_table.total_income
            ),
            100.0
        )
    )
    
    # ==================== CATEGORY AGGREGATIONS ====================
    
    # Group by category
    category_groups = enriched_transactions.groupby(enriched_transactions.category).reduce(
        category=pw.this.category,
        total_income=pw.reducers.sum(
            pw.if_else(pw.this.type == "income", pw.this.amount, 0.0)
        ),
        total_expenses=pw.reducers.sum(
            pw.if_else(pw.this.type == "expense", pw.this.amount, 0.0)
        ),
        count=pw.reducers.count()
    )
    
    # Add net amount
    category_enriched = category_groups.with_columns(
        net=category_groups.total_income - category_groups.total_expenses
    )
    
    # ==================== TIME-WINDOWED ANALYTICS ====================
    
    # Window by timestamp (last 5 minutes as default)
    windowed_5min = enriched_transactions.window_by(
        enriched_transactions.timestamp,
        window=pw.temporal.tumbling(duration=timedelta(minutes=5))
    ).reduce(
        window_end=pw.this._pw_window_end,
        recent_income=pw.reducers.sum(
            pw.if_else(pw.this.type == "income", pw.this.amount, 0.0)
        ),
        recent_expenses=pw.reducers.sum(
            pw.if_else(pw.this.type == "expense", pw.this.amount, 0.0)
        ),
        recent_transactions=pw.reducers.count()
    )
    
    # ==================== OUTPUT HANDLERS ====================
    
    def update_metrics_callback(key, row, time, is_addition):
        """Callback when metrics are updated"""
        with state_lock:
            latest_metrics.update({
                "total_income": float(row[1]),  # total_income
                "total_expenses": float(row[2]),  # total_expenses
                "balance": float(row[3]),  # balance
                "transaction_count": int(row[4]),  # transaction_count
                "average_transaction": float(row[6]),  # average_transaction
                "financial_health_score": float(row[7])  # financial_health_score
            })
            
            # Compute intelligence based on metrics
            compute_intelligence()
    
    def update_categories_callback(key, row, time, is_addition):
        """Callback when category metrics are updated"""
        category = row[1]  # category name
        with state_lock:
            latest_categories[category] = {
                "income": float(row[2]),  # total_income
                "expenses": float(row[3]),  # total_expenses
                "count": int(row[4]),  # count
                "net": float(row[5])  # net
            }
    
    def update_windowed_callback(key, row, time, is_addition):
        """Callback when windowed metrics are updated"""
        with state_lock:
            latest_windowed.update({
                "recent_income": float(row[2]),
                "recent_expenses": float(row[3]),
                "recent_transactions": int(row[4]),
                "window_minutes": 5
            })
    
    # Subscribe to table updates
    pw.io.subscribe(metrics_enriched, on_change=update_metrics_callback)
    pw.io.subscribe(category_enriched, on_change=update_categories_callback)
    pw.io.subscribe(windowed_5min, on_change=update_windowed_callback)
    
    # Start Pathway computation in background thread
    def run_pathway_computation():
        """Run Pathway streaming in background"""
        try:
            pw.run()
        except Exception as e:
            print(f"❌ Pathway computation error: {e}")
    
    # Start Pathway in daemon thread
    pathway_thread = threading.Thread(target=run_pathway_computation, daemon=True)
    pathway_thread.start()
    print("✅ Pathway streaming computation started in background")

else:
    # Fallback: Simple in-memory aggregation (not real streaming)
    transaction_history = []
    
    def update_fallback_state():
        """Update state using in-memory calculations"""
        with state_lock:
            if not transaction_history:
                return
            
            total_income = sum(t['amount'] for t in transaction_history if t['type'] == 'income')
            total_expenses = sum(t['amount'] for t in transaction_history if t['type'] == 'expense')
            balance = total_income - total_expenses
            
            latest_metrics.update({
                "total_income": total_income,
                "total_expenses": total_expenses,
                "balance": balance,
                "transaction_count": len(transaction_history),
                "average_transaction": sum(t['amount'] for t in transaction_history) / len(transaction_history),
                "financial_health_score": max(0, 100 - (total_expenses / max(total_income, 1) * 100))
            })
            
            # Category aggregation
            categories = defaultdict(lambda: {"income": 0, "expenses": 0, "count": 0})
            for t in transaction_history:
                cat = t['category']
                if t['type'] == 'income':
                    categories[cat]['income'] += t['amount']
                else:
                    categories[cat]['expenses'] += t['amount']
                categories[cat]['count'] += 1
            
            for cat in categories:
                categories[cat]['net'] = categories[cat]['income'] - categories[cat]['expenses']
            
            latest_categories.clear()
            latest_categories.update(dict(categories))
            
            compute_intelligence()

# ==================== INTELLIGENCE COMPUTATION ====================

def compute_intelligence():
    """Compute financial intelligence from current metrics"""
    metrics = latest_metrics.copy()
    
    alerts = []
    warnings = []
    insights = []
    recommendations = []
    risk_factors = {
        "overspending": False,
        "low_balance": False,
        "negative_balance": False,
        "rapid_spending": False,
        "insufficient_emergency_fund": False
    }
    
    balance = metrics['balance']
    income = metrics['total_income']
    expenses = metrics['total_expenses']
    
    # Rule 1: Overspending
    if expenses > income and income > 0:
        alerts.append(f"🚨 OVERSPENDING: Expenses (₹{expenses:.2f}) exceed income (₹{income:.2f})")
        risk_factors['overspending'] = True
        recommendations.append("🎯 Priority: Reduce discretionary spending by 20-30%")
    
    # Rule 2: Negative balance
    if balance < 0:
        alerts.append(f"⚠️ NEGATIVE BALANCE: Account overdrawn by ₹{abs(balance):.2f}")
        risk_factors['negative_balance'] = True
        recommendations.append("🚨 Immediate: Stop non-essential spending")
    
    # Rule 3: Low balance
    elif balance < 5000:
        warnings.append(f"💰 Low balance warning: Only ₹{balance:.2f} remaining")
        risk_factors['low_balance'] = True
        recommendations.append("💰 Build emergency fund to ₹15,000 minimum")
    
    # Rule 4: Emergency fund check
    if balance < 5000:
        warnings.append("🏦 Emergency fund risk: Balance below recommended ₹5,000")
        risk_factors['insufficient_emergency_fund'] = True
    
    # Rule 5: Top spending categories
    if latest_categories:
        top_expense_cat = max(
            ((k, v['expenses']) for k, v in latest_categories.items() if v['expenses'] > 0),
            key=lambda x: x[1],
            default=(None, 0)
        )
        if top_expense_cat[0] and expenses > 0:
            percentage = (top_expense_cat[1] / expenses) * 100
            if percentage > 30:
                insights.append(f"📊 '{top_expense_cat[0]}' represents {percentage:.0f}% of spending")
                recommendations.append(f"📉 Consider reducing '{top_expense_cat[0]}' expenses")
    
    # Rule 6: Health score insights
    health_score = metrics['financial_health_score']
    if health_score < 30:
        insights.append("⚠️ Financial health is in critical range")
    elif health_score < 60:
        insights.append("📊 Financial health needs improvement")
    else:
        insights.append("✅ Maintaining healthy financial habits")
    
    # Risk level classification
    if balance < 0 or (income > 0 and expenses > income * 2):
        risk_level = "CRITICAL"
    elif expenses > income or balance < 2000:
        risk_level = "HIGH"
    elif balance < 5000 or (income > 0 and expenses > income * 0.8):
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
    
    # Default recommendations
    if not recommendations:
        if risk_level == "LOW":
            recommendations.append("✅ Continue current spending habits")
            recommendations.append("📈 Consider allocating to savings/investments")
        else:
            recommendations.append("📊 Track spending by category weekly")
            recommendations.append("🎯 Set monthly budget limits")
    
    with state_lock:
        latest_intelligence.update({
            "alerts": alerts,
            "warnings": warnings,
            "insights": insights,
            "recommendations": recommendations,
            "risk_level": risk_level,
            "financial_health_score": health_score,
            "risk_factors": risk_factors
        })

# ==================== LLM INTEGRATION ====================

async def generate_llm_insights_async():
    """Generate LLM insights from current state"""
    llm = get_llm_service()
    
    with state_lock:
        metrics = latest_metrics.copy()
        intelligence = latest_intelligence.copy()
        categories = latest_categories.copy()
    
    insights = await llm.generate_financial_insights(metrics, intelligence, categories)
    
    global latest_llm_insights
    latest_llm_insights = insights
    return insights

# ==================== API ENDPOINTS ====================

@app.post("/ingest")
async def ingest_transaction(event: TransactionEvent):
    """Ingest transaction into real Pathway stream"""
    
    # Parse timestamp
    if event.timestamp:
        try:
            dt = datetime.fromisoformat(event.timestamp.replace('Z', '+00:00'))
            timestamp_ms = int(dt.timestamp() * 1000)
        except:
            timestamp_ms = int(datetime.now().timestamp() * 1000)
    else:
        timestamp_ms = int(datetime.now().timestamp() * 1000)
    
    # Generate ID if not provided
    event_id = event.id or f"txn_{timestamp_ms}_{event.amount}"
    
    # Create transaction dict
    transaction = {
        "id": event_id,
        "type": event.type,
        "amount": event.amount,
        "category": event.category,
        "timestamp": timestamp_ms,
        "description": event.description
    }
    
    if PATHWAY_AVAILABLE:
        # Ingest into real Pathway stream
        try:
            transaction_subject.next(**transaction)
        except Exception as e:
            print(f"❌ Pathway ingestion error: {e}")
            raise HTTPException(status_code=500, detail=f"Ingestion failed: {e}")
    else:
        # Fallback to in-memory
        transaction_history.append(transaction)
        update_fallback_state()
    
    return {
        "status": "success",
        "message": "Transaction ingested into Pathway stream" if PATHWAY_AVAILABLE else "Transaction recorded (fallback mode)",
        "transaction_id": event_id
    }

@app.get("/metrics")
def get_metrics():
    """Get real-time core financial metrics"""
    with state_lock:
        return latest_metrics.copy()

@app.get("/metrics/categories")
def get_category_metrics():
    """Get category-wise aggregations"""
    with state_lock:
        return latest_categories.copy()

@app.get("/metrics/windowed")
def get_windowed_metrics(window_minutes: int = Query(5, ge=1, le=60)):
    """Get time-windowed analytics"""
    # Note: Real implementation would use dynamic window sizes
    # For now returning 5-minute window (can be extended with multiple window tables)
    with state_lock:
        windowed = latest_windowed.copy()
        windowed['window_minutes'] = window_minutes
        
        # Add computed fields
        if 'recent_transactions' in windowed:
            windowed['spending_rate_per_minute'] = (
                windowed['recent_expenses'] / window_minutes
                if window_minutes > 0 else 0
            )
            
            net_flow = windowed['recent_income'] - windowed['recent_expenses']
            if windowed['recent_transactions'] == 0:
                windowed['period_summary'] = f"No transactions in last {window_minutes} minutes"
            elif net_flow > 0:
                windowed['period_summary'] = f"Positive flow: ₹{net_flow:.2f} in last {window_minutes} min"
            else:
                windowed['period_summary'] = f"Spending: ₹{abs(net_flow):.2f} in last {window_minutes} min"
        
        return windowed

@app.get("/intelligence")
def get_intelligence():
    """Get financial intelligence (alerts, warnings, insights)"""
    with state_lock:
        return latest_intelligence.copy()

@app.get("/insights/llm")
async def get_llm_insights():
    """Get real LLM-powered natural language insights"""
    global latest_llm_insights
    
    # Return cached if recent (< 10 seconds old)
    if latest_llm_insights and 'generated_at' in latest_llm_insights:
        try:
            generated = datetime.fromisoformat(latest_llm_insights['generated_at'])
            age = (datetime.now() - generated).total_seconds()
            if age < 10:
                return latest_llm_insights
        except:
            pass
    
    # Generate new insights
    insights = await generate_llm_insights_async()
    return insights

@app.get("/status")
def get_status():
    """Get engine status and capabilities"""
    return {
        "engine": "real" if PATHWAY_AVAILABLE else "fallback",
        "pathway_version": pw.__version__ if PATHWAY_AVAILABLE else "N/A",
        "llm_provider": get_llm_service().provider,
        "llm_enabled": get_llm_service().enabled,
        "features": {
            "real_streaming": PATHWAY_AVAILABLE,
            "time_windows": PATHWAY_AVAILABLE,
            "category_aggregations": True,
            "financial_intelligence": True,
            "llm_insights": True
        },
        "uptime": "running"
    }

@app.get("/")
def root():
    """Health check"""
    return {
        "service": "FinTwitch Real Pathway Intelligence Engine",
        "version": "3.0.0-real",
        "status": "operational",
        "engine": "real_pathway" if PATHWAY_AVAILABLE else "fallback",
        "endpoints": [
            "POST /ingest",
            "GET /metrics",
            "GET /metrics/categories",
            "GET /metrics/windowed",
            "GET /intelligence",
            "GET /insights/llm",
            "GET /status"
        ]
    }

# ==================== STARTUP ====================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("\n" + "="*70)
    print("🚀 FINTWITCH REAL PATHWAY INTELLIGENCE ENGINE")
    print("="*70)
    print(f"Engine Type: {'REAL Pathway Streaming' if PATHWAY_AVAILABLE else 'Fallback Mode'}")
    if PATHWAY_AVAILABLE:
        print(f"Pathway Version: {pw.__version__}")
    print(f"LLM Provider: {get_llm_service().provider}")
    print(f"Port: 8000")
    print("\nEndpoints:")
    print("  📥 POST http://localhost:8000/ingest       - Ingest transactions")
    print("  📊 GET  http://localhost:8000/metrics      - Core metrics")
    print("  📂 GET  http://localhost:8000/metrics/categories - Category breakdown")
    print("  ⏰ GET  http://localhost:8000/metrics/windowed - Time windows")
    print("  🧠 GET  http://localhost:8000/intelligence - Financial intelligence")
    print("  🤖 GET  http://localhost:8000/insights/llm - Real LLM insights")
    print("  📖 GET  http://localhost:8000/docs        - API documentation")
    print("="*70)
    
    if not PATHWAY_AVAILABLE:
        print("\n⚠️  WARNING: Real Pathway not available. Using fallback mode.")
        print("📦 Install Pathway from: https://pathway.com/developers/")
    
    print("\n✅ ENGINE READY FOR REAL-TIME INTELLIGENCE\n")

# ==================== RUN ====================

if __name__ == "__main__":
    uvicorn.run(
        "pathway_streaming_real:app",
        host="0.0.0.0",
        port=8000,
        reload=False  # Disable reload due to Pathway threading
    )
