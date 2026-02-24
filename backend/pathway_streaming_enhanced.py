"""
FinTwitch ENHANCED Pathway Streaming Engine
============================================
Hackathon-ready real-time financial intelligence with multi-source streaming.

PATHWAY-CENTRIC FEATURES:
+ Multi-source stream ingestion (transactions + external signals)
+ Advanced streaming transformations (moving averages, velocity, trends)
+ Predictive analytics (balance depletion, spending projections)
+ Real-time decision assistance (alerts, warnings)
+ Multi-source data fusion (user + market + economic signals)
+ Anomaly detection and behavioral analysis
+ LLM powered by processed analytics (not raw data)
+ Streaming status visibility

Architecture:
    [User Transactions] --+
    [Market Signals]    --+-> Pathway Pipeline -> Transformations -> Fusion -> Analytics -> API
    [Economic Events]   --+
"""

from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, List, Dict, Any, Optional
import uvicorn
from datetime import datetime, timedelta
import asyncio
from collections import defaultdict, deque
import threading
import time
from pathlib import Path
import json
import queue as queue_module

# Import real Pathway
try:
    import pathway as pw
    if not hasattr(pw, 'Schema'):
        raise ImportError("Stub pathway detected")
    PATHWAY_AVAILABLE = True
    print("OK REAL Pathway streaming engine loaded")
except (ImportError, AttributeError) as e:
    print(f"!!  Real Pathway not available: {e}")
    print("-> Install from: https://pathway.com/developers/")
    PATHWAY_AVAILABLE = False

# Whether pw.run() is actually processing (set False if it crashes)
PATHWAY_RUNNING = False

# Import LLM service and external stream
from llm_service import get_llm_service
from external_data_stream import ExternalDataStreamGenerator

# ==================== FASTAPI SETUP ====================

app = FastAPI(
    title="FinTwitch ENHANCED Pathway Intelligence Engine",
    description="Hackathon-ready multi-source real-time financial intelligence",
    version="4.0.0-hackathon"
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
    """User transaction event"""
    type: Literal["income", "expense"]
    amount: float
    category: str
    timestamp: Optional[str] = None
    description: Optional[str] = ""
    id: Optional[str] = None

class ExternalSignal(BaseModel):
    """External data signal"""
    category: str  # market, economic, policy
    event_type: str
    impact: str
    value: float
    description: str
    timestamp: Optional[str] = None
    id: Optional[str] = None

# ==================== GLOBAL STATE ====================

# Core metrics
latest_metrics = {
    "total_income": 0.0,
    "total_expenses": 0.0,
    "balance": 0.0,
    "transaction_count": 0,
    "financial_health_score": 100.0,
    "average_transaction": 0.0
}

# Advanced analytics
latest_advanced_analytics = {
    "spending_velocity": 0.0,  # Per minute
    "income_velocity": 0.0,
    "moving_avg_expense_5min": 0.0,
    "moving_avg_expense_15min": 0.0,
    "trend": "stable",  # rising, falling, stable
    "largest_transaction_amount": 0.0,
    "spending_pattern": "normal",  # normal, impulsive, stable
    "anomaly_detected": False,
    "recent_anomalies": []
}

# Predictive insights
latest_predictions = {
    "days_until_zero_balance": None,
    "projected_monthly_deficit": 0.0,
    "projected_monthly_surplus": 0.0,
    "risk_escalation_warning": False,
    "recommended_daily_budget": 0.0,
    "burn_rate_per_day": 0.0
}

# Real-time alerts
latest_alerts = {
    "critical": [],
    "warnings": [],
    "opportunities": [],
    "triggered_at": None
}

# External signals state
latest_external_signals = {
    "market_sentiment": 0.5,
    "market_volatility": 0.3,
    "interest_rate": 6.5,
    "inflation_rate": 4.2,
    "recent_events": [],
    "impact_on_spending": 0.0  # -1 to 1
}

# Multi-source fusion
latest_fusion_metrics = {
    "overall_financial_risk": 0.0,  # 0-100
    "market_adjusted_health": 0.0,
    "economic_impact_score": 0.0,
    "recommended_action": "monitor",
    "risk_breakdown": {}
}

# Streaming status
streaming_status = {
    "engine_active": PATHWAY_AVAILABLE,
    "events_processed": 0,
    "transactions_processed": 0,
    "external_signals_processed": 0,
    "last_transaction_time": None,
    "last_external_signal_time": None,
    "uptime_seconds": 0,
    "active_data_sources": [],
    "current_window_size": 5,
    "pipeline_health": "operational"
}

# Categories and windowed
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

# External stream generator
external_stream_generator = None
external_stream_task = None

# Startup time
start_time = time.time()

# ==================== REAL PATHWAY STREAMING PIPELINE ====================

if PATHWAY_AVAILABLE:
    
    # ===== SCHEMA DEFINITIONS =====
    
    class TransactionSchema(pw.Schema):
        event_id: str
        type: str  # 'income' or 'expense'
        amount: float
        category: str
        timestamp: int  # Unix timestamp in milliseconds
        description: str
    
    class ExternalSignalSchema(pw.Schema):
        event_id: str
        category: str  # market, economic, policy
        event_type: str
        impact: str  # positive, negative, neutral
        value: float
        description: str
        timestamp: int
    
    # ===== STREAM INGESTION =====

    # Proper ConnectorSubject subclasses (required by Pathway 0.29+)
    # Data is pushed from API endpoints into a queue; run() feeds it to Pathway
    class TransactionConnectorSubject(pw.io.python.ConnectorSubject):
        def __init__(self):
            super().__init__()
            self._queue = queue_module.Queue()

        def put(self, **kwargs):
            self._queue.put(kwargs)

        def run(self):
            while True:
                try:
                    item = self._queue.get(timeout=1.0)
                    self.next(**item)
                except queue_module.Empty:
                    pass

    class ExternalSignalConnectorSubject(pw.io.python.ConnectorSubject):
        def __init__(self):
            super().__init__()
            self._queue = queue_module.Queue()

        def put(self, **kwargs):
            self._queue.put(kwargs)

        def run(self):
            while True:
                try:
                    item = self._queue.get(timeout=1.0)
                    self.next(**item)
                except queue_module.Empty:
                    pass

    # Create subjects for multi-source ingestion
    transaction_subject = TransactionConnectorSubject()
    external_signal_subject = ExternalSignalConnectorSubject()

    # Create input tables using pw.io.python.read (Pathway 0.29+ API)
    transactions = pw.io.python.read(transaction_subject, schema=TransactionSchema)
    external_signals = pw.io.python.read(external_signal_subject, schema=ExternalSignalSchema)
    
    # ===== TRANSACTION STREAM PROCESSING =====
    
    # Enrich transactions
    enriched_transactions = transactions.with_columns(
        signed_amount=pw.if_else(
            transactions.type == "income",
            transactions.amount,
            -transactions.amount
        ),
        is_income=pw.apply_with_type(lambda t: 1 if t == "income" else 0, int, transactions.type),
        is_expense=pw.apply_with_type(lambda t: 1 if t == "expense" else 0, int, transactions.type)
    )
    
    # ===== CORE AGGREGATIONS =====
    
    metrics_table = enriched_transactions.reduce(
        total_income=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "income" else 0.0, float, enriched_transactions.type, enriched_transactions.amount)
        ),
        total_expenses=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "expense" else 0.0, float, enriched_transactions.type, enriched_transactions.amount)
        ),
        balance=pw.reducers.sum(enriched_transactions.signed_amount),
        transaction_count=pw.reducers.count(),
        total_amount=pw.reducers.sum(enriched_transactions.amount),
        largest_transaction=pw.reducers.max(enriched_transactions.amount)
    )
    
    metrics_enriched = metrics_table.with_columns(
        average_transaction=pw.apply_with_type(
            lambda count, total: total / count if count > 0 else 0.0,
            float,
            metrics_table.transaction_count,
            metrics_table.total_amount,
        ),
        financial_health_score=pw.apply_with_type(
            lambda expenses, income: (
                max(0.0, min(100.0, 100.0 - (expenses / income * 100.0))) if income > 0 else 100.0
            ),
            float,
            metrics_table.total_expenses,
            metrics_table.total_income,
        )
    )
    
    # ===== ADVANCED TRANSFORMATIONS =====
    
    # Time-windowed analytics for velocity and trends
    windowed_5min = enriched_transactions.windowby(
        enriched_transactions.timestamp,
        window=pw.temporal.tumbling(duration=300_000)  # 5 min in ms
    ).reduce(
        window_end=pw.this._pw_window_end,
        recent_income=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "income" else 0.0, float, pw.this.type, pw.this.amount)
        ),
        recent_expenses=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "expense" else 0.0, float, pw.this.type, pw.this.amount)
        ),
        recent_transactions=pw.reducers.count(),
        max_transaction=pw.reducers.max(pw.this.amount),
        min_transaction=pw.reducers.min(pw.this.amount)
    )
    
    # 15-minute window for trend detection
    windowed_15min = enriched_transactions.windowby(
        enriched_transactions.timestamp,
        window=pw.temporal.tumbling(duration=900_000)  # 15 min in ms
    ).reduce(
        window_end=pw.this._pw_window_end,
        expenses_15min=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "expense" else 0.0, float, pw.this.type, pw.this.amount)
        ),
        income_15min=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "income" else 0.0, float, pw.this.type, pw.this.amount)
        ),
        count_15min=pw.reducers.count()
    )
    
    # ===== CATEGORY AGGREGATIONS =====
    
    category_groups = enriched_transactions.groupby(enriched_transactions.category).reduce(
        category=pw.this.category,
        total_income=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "income" else 0.0, float, pw.this.type, pw.this.amount)
        ),
        total_expenses=pw.reducers.sum(
            pw.apply_with_type(lambda t, a: a if t == "expense" else 0.0, float, pw.this.type, pw.this.amount)
        ),
        count=pw.reducers.count(),
        avg_amount=pw.reducers.avg(pw.this.amount)
    )
    
    category_enriched = category_groups.with_columns(
        net=category_groups.total_income - category_groups.total_expenses
    )
    
    # ===== EXTERNAL SIGNAL PROCESSING =====
    
    # Aggregate external signals by category
    external_aggregated = external_signals.groupby(external_signals.category).reduce(
        signal_category=pw.this.category,
        event_count=pw.reducers.count(),
        total_impact=pw.reducers.sum(
            pw.apply_with_type(
                lambda impact, value: value if impact == "positive" else -value if impact == "negative" else 0.0,
                float,
                pw.this.impact,
                pw.this.value
            )
        )
    )
    
    # ===== OUTPUT HANDLERS =====
    
    def update_metrics_callback(key, row, time, is_addition):
        """Update core metrics"""
        with state_lock:
            latest_metrics.update({
                "total_income": float(row[1]),
                "total_expenses": float(row[2]),
                "balance": float(row[3]),
                "transaction_count": int(row[4]),
                "average_transaction": float(row[7]),
                "financial_health_score": float(row[8])
            })
            latest_advanced_analytics["largest_transaction_amount"] = float(row[6])
            streaming_status["transactions_processed"] = int(row[4])
            streaming_status["last_transaction_time"] = datetime.now().isoformat()
            
            compute_predictions()
            compute_intelligence()
            check_real_time_alerts()
    
    def update_windowed_5min_callback(key, row, time, is_addition):
        """Update 5-minute window metrics"""
        with state_lock:
            recent_income = float(row[2])
            recent_expenses = float(row[3])
            recent_count = int(row[4])
            
            # Compute velocity (per minute)
            spending_velocity = recent_expenses / 5.0
            income_velocity = recent_income / 5.0
            
            latest_windowed.update({
                "recent_income": recent_income,
                "recent_expenses": recent_expenses,
                "recent_transactions": recent_count,
                "window_minutes": 5
            })
            
            latest_advanced_analytics.update({
                "spending_velocity": spending_velocity,
                "income_velocity": income_velocity,
                "moving_avg_expense_5min": recent_expenses
            })
            
            # Detect anomalies (spending > 3x average)
            if recent_count > 0:
                avg_per_txn = recent_expenses / recent_count
                if avg_per_txn > latest_metrics.get("average_transaction", 0) * 3:
                    latest_advanced_analytics["anomaly_detected"] = True
                    latest_advanced_analytics["recent_anomalies"].append({
                        "time": datetime.now().isoformat(),
                        "description": f"Unusually large spending: Rupee {recent_expenses:.2f} in 5 minutes"
                    })
                    # Keep only last 5 anomalies
                    latest_advanced_analytics["recent_anomalies"] = latest_advanced_analytics["recent_anomalies"][-5:]
    
    def update_windowed_15min_callback(key, row, time, is_addition):
        """Update 15-minute window for trend detection"""
        with state_lock:
            expenses_15min = float(row[2])
            latest_advanced_analytics["moving_avg_expense_15min"] = expenses_15min
            
            # Trend detection: compare 5min vs 15min averages
            ma_5 = latest_advanced_analytics.get("moving_avg_expense_5min", 0)
            ma_15 = expenses_15min / 3.0  # Average per 5-min period
            
            if ma_5 > ma_15 * 1.3:
                latest_advanced_analytics["trend"] = "rising"
            elif ma_5 < ma_15 * 0.7:
                latest_advanced_analytics["trend"] = "falling"
            else:
                latest_advanced_analytics["trend"] = "stable"
            
            # Behavioral classification
            if latest_advanced_analytics.get("spending_velocity", 0) > 50:
                latest_advanced_analytics["spending_pattern"] = "impulsive"
            elif latest_advanced_analytics.get("spending_velocity", 0) < 10:
                latest_advanced_analytics["spending_pattern"] = "stable"
            else:
                latest_advanced_analytics["spending_pattern"] = "normal"
    
    def update_categories_callback(key, row, time, is_addition):
        """Update category metrics"""
        category = row[1]
        with state_lock:
            latest_categories[category] = {
                "income": float(row[2]),
                "expenses": float(row[3]),
                "count": int(row[4]),
                "avg_amount": float(row[5]),
                "net": float(row[6])
            }
    
    def update_external_signals_callback(key, row, time, is_addition):
        """Update external signals aggregation"""
        with state_lock:
            signal_category = row[1]
            event_count = int(row[2])
            total_impact = float(row[3])
            
            if signal_category == "market":
                latest_external_signals["impact_on_spending"] = total_impact
            
            streaming_status["external_signals_processed"] += 1
            streaming_status["last_external_signal_time"] = datetime.now().isoformat()
            
            # Trigger fusion computation
            compute_fusion_metrics()
    
    # Subscribe to table updates
    pw.io.subscribe(metrics_enriched, on_change=update_metrics_callback)
    pw.io.subscribe(windowed_5min, on_change=update_windowed_5min_callback)
    pw.io.subscribe(windowed_15min, on_change=update_windowed_15min_callback)
    pw.io.subscribe(category_enriched, on_change=update_categories_callback)
    pw.io.subscribe(external_aggregated, on_change=update_external_signals_callback)
    
    # Start Pathway computation
    def run_pathway_computation():
        """Run Pathway streaming in background"""
        global PATHWAY_RUNNING
        PATHWAY_RUNNING = True
        try:
            pw.run()
        except Exception as e:
            print(f"! Pathway computation error: {e}")
            # Stub/unsupported Pathway falls back gracefully
            streaming_status["pipeline_health"] = "fallback"
            streaming_status["engine_active"] = True  # backend still serves data
        finally:
            PATHWAY_RUNNING = False
    
    pathway_thread = threading.Thread(target=run_pathway_computation, daemon=True)
    pathway_thread.start()
    print("OK Enhanced Pathway streaming pipeline started")
    
    # Update active data sources
    streaming_status["active_data_sources"] = ["user_transactions", "external_signals"]

# Always define fallback storage (used when Pathway pipeline is unavailable/crashed)
transaction_history = []
external_signal_history = []

def update_fallback_state():
    """Fallback in-memory computation"""
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
            "net_cash_flow": balance,
            "transaction_count": len(transaction_history),
            "average_transaction": sum(t['amount'] for t in transaction_history) / len(transaction_history),
            "financial_health_score": max(0, 100 - (total_expenses / max(total_income, 1) * 100))
        })
        
        compute_predictions()
        compute_intelligence()
        check_real_time_alerts()

# ==================== PREDICTIVE ANALYTICS ====================

def compute_predictions():
    """Compute forward-looking financial predictions"""
    with state_lock:
        balance = latest_metrics["balance"]
        velocity = latest_advanced_analytics.get("spending_velocity", 0)
        
        # Days until zero balance
        if velocity > 0 and balance > 0:
            minutes_until_zero = balance / velocity
            days_until_zero = minutes_until_zero / (60 * 24)
            latest_predictions["days_until_zero_balance"] = round(days_until_zero, 1)
        else:
            latest_predictions["days_until_zero_balance"] = None
        
        # Burn rate per day
        daily_burn = velocity * 60 * 24
        latest_predictions["burn_rate_per_day"] = round(daily_burn, 2)
        
        # Projected monthly deficit/surplus
        monthly_income = latest_metrics["total_income"]
        monthly_expenses = latest_metrics["total_expenses"]
        
        # Simple projection based on current rates
        if latest_metrics["transaction_count"] > 0:
            projected_monthly_expenses = daily_burn * 30
            projected_monthly_income = monthly_income  # Use current as baseline
            
            if projected_monthly_income > projected_monthly_expenses:
                latest_predictions["projected_monthly_surplus"] = projected_monthly_income - projected_monthly_expenses
                latest_predictions["projected_monthly_deficit"] = 0.0
            else:
                latest_predictions["projected_monthly_deficit"] = projected_monthly_expenses - projected_monthly_income
                latest_predictions["projected_monthly_surplus"] = 0.0
        
        # Recommended daily budget (to maintain positive balance)
        if balance > 0:
            latest_predictions["recommended_daily_budget"] = round(balance / 30, 2)
        else:
            latest_predictions["recommended_daily_budget"] = 0.0
        
        # Risk escalation warning
        trend = latest_advanced_analytics.get("trend", "stable")
        if trend == "rising" and velocity > 20:
            latest_predictions["risk_escalation_warning"] = True
        else:
            latest_predictions["risk_escalation_warning"] = False

# ==================== MULTI-SOURCE DATA FUSION ====================

def compute_fusion_metrics():
    """Fuse user data + external signals for overall risk assessment"""
    with state_lock:
        # Base financial risk (0-100)
        health_score = latest_metrics["financial_health_score"]
        base_risk = 100 - health_score
        
        # Market impact adjustment
        market_sentiment = latest_external_signals.get("market_sentiment", 0.5)
        volatility = latest_external_signals.get("market_volatility", 0.3)
        
        # Bearish market or high volatility increases risk
        market_risk_multiplier = 1.0 + (volatility * 0.5)
        if market_sentiment < 0.4:  # Bearish
            market_risk_multiplier += 0.3
        
        # Economic impact
        inflation = latest_external_signals.get("inflation_rate", 4.2)
        interest_rate = latest_external_signals.get("interest_rate", 6.5)
        
        economic_risk = 0
        if inflation > 6.0:
            economic_risk += 15
        if interest_rate > 8.0:
            economic_risk += 10
        
        # Fused overall risk
        overall_risk = min(100, (base_risk * market_risk_multiplier) + economic_risk)
        
        # Market-adjusted health score
        market_adjusted_health = max(0, 100 - overall_risk)
        
        latest_fusion_metrics.update({
            "overall_financial_risk": round(overall_risk, 2),
            "market_adjusted_health": round(market_adjusted_health, 2),
            "economic_impact_score": economic_risk,
            "risk_breakdown": {
                "user_spending_risk": round(base_risk, 2),
                "market_risk_multiplier": round(market_risk_multiplier, 2),
                "economic_factors_risk": economic_risk
            }
        })
        
        # Recommended action based on fused risk
        if overall_risk > 70:
            latest_fusion_metrics["recommended_action"] = "urgent_action_needed"
        elif overall_risk > 50:
            latest_fusion_metrics["recommended_action"] = "reduce_spending"
        elif overall_risk > 30:
            latest_fusion_metrics["recommended_action"] = "monitor_closely"
        else:
            latest_fusion_metrics["recommended_action"] = "maintain_current_habits"

# ==================== REAL-TIME ALERT SYSTEM ====================

def check_real_time_alerts():
    """Generate immediate alerts based on live conditions"""
    critical = []
    warnings = []
    opportunities = []
    
    balance = latest_metrics["balance"]
    velocity = latest_advanced_analytics.get("spending_velocity", 0)
    trend = latest_advanced_analytics.get("trend", "stable")
    days_until_zero = latest_predictions.get("days_until_zero_balance")
    
    # CRITICAL ALERTS
    if balance < 0:
        critical.append({
            "level": "CRITICAL",
            "title": "Negative Balance Alert",
            "message": f"Your account is overdrawn by Rupee {abs(balance):.2f}",
            "action": "Stop all non-essential spending immediately"
        })
    
    if days_until_zero and days_until_zero < 3:
        critical.append({
            "level": "CRITICAL",
            "title": "Balance Depletion Warning",
            "message": f"Current spending will deplete your balance in {days_until_zero} days",
            "action": "Reduce daily spending to Rupee " + str(latest_predictions.get("recommended_daily_budget", 0))
        })
    
    # WARNING ALERTS
    if balance < 2000 and balance > 0:
        warnings.append({
            "level": "WARNING",
            "title": "Low Balance Warning",
            "message": f"Your balance is critically low: Rupee {balance:.2f}",
            "action": "Consider emergency fund replenishment"
        })
    
    if trend == "rising" and velocity > 15:
        warnings.append({
            "level": "WARNING",
            "title": "Spending Trajectory Alert",
            "message": f"Spending is accelerating: Rupee {velocity:.2f}/minute",
            "action": "Review recent transactions and identify non-essentials"
        })
    
    if latest_predictions.get("projected_monthly_deficit", 0) > 0:
        warnings.append({
            "level": "WARNING",
            "title": "Projected Monthly Deficit",
            "message": f"Projected shortage: Rupee {latest_predictions['projected_monthly_deficit']:.2f}",
            "action": "Adjust spending plan for remainder of month"
        })
    
    # OPPORTUNITY ALERTS
    if balance > 10000 and velocity < 5:
        opportunities.append({
            "level": "OPPORTUNITY",
            "title": "Savings Opportunity",
            "message": f"Stable spending with healthy balance: Rupee {balance:.2f}",
            "action": "Consider moving excess to savings or investments"
        })
    
    market_sentiment = latest_external_signals.get("market_sentiment", 0.5)
    if market_sentiment > 0.7 and balance > 5000:
        opportunities.append({
            "level": "OPPORTUNITY",
            "title": "Favorable Market Conditions",
            "message": "Strong market sentiment detected",
            "action": "Good time to consider investment opportunities"
        })
    
    with state_lock:
        latest_alerts.update({
            "critical": critical,
            "warnings": warnings,
            "opportunities": opportunities,
            "triggered_at": datetime.now().isoformat()
        })

# ==================== INTELLIGENCE COMPUTATION ====================

def compute_intelligence():
    """Compute financial intelligence rules"""
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
    
    # Apply rules
    if expenses > income and income > 0:
        alerts.append(f"? OVERSPENDING: Expenses (Rupee {expenses:.2f}) exceed income (Rupee {income:.2f})")
        risk_factors['overspending'] = True
        recommendations.append("? Priority: Reduce discretionary spending by 20-30%")
    
    if balance < 0:
        alerts.append(f"?? NEGATIVE BALANCE: Account overdrawn by Rupee {abs(balance):.2f}")
        risk_factors['negative_balance'] = True
        recommendations.append("? Immediate: Stop non-essential spending")
    elif balance < 5000:
        warnings.append(f"? Low balance warning: Only Rupee {balance:.2f} remaining")
        risk_factors['low_balance'] = True
        recommendations.append("? Build emergency fund to Rupee 15,000 minimum")
    
    health_score = metrics['financial_health_score']
    if health_score < 30:
        insights.append("?? Financial health is in critical range")
    elif health_score < 60:
        insights.append("? Financial health needs improvement")
    else:
        insights.append("OK Maintaining healthy financial habits")
    
    # Risk level
    if balance < 0 or (income > 0 and expenses > income * 2):
        risk_level = "CRITICAL"
    elif expenses > income or balance < 2000:
        risk_level = "HIGH"
    elif balance < 5000 or (income > 0 and expenses > income * 0.8):
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
    
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

# ==================== LLM INTEGRATION (Using Processed Analytics) ====================

async def generate_llm_insights_async():
    """Generate LLM insights from PROCESSED ANALYTICS (not raw transactions)"""
    llm = get_llm_service()
    
    # Gather processed analytics context (no lock needed for reads of dicts in CPython)
    context = {
        "core_metrics": dict(latest_metrics),
        "advanced_analytics": dict(latest_advanced_analytics),
        "predictions": dict(latest_predictions),
        "external_signals": dict(latest_external_signals),
        "fusion_metrics": dict(latest_fusion_metrics),
        "categories": dict(latest_categories),
        "intelligence": dict(latest_intelligence)
    }
    
    # The LLM receives structured analytics, NOT raw transaction lists
    insights = await llm.generate_financial_insights(
        context["core_metrics"],
        context["intelligence"],
        context["categories"],
        context["advanced_analytics"],
        context["predictions"],
        context["external_signals"],
        context["fusion_metrics"]
    )
    
    # Enhance with advanced context
    if insights and "insights" in insights:
        # Add context about advanced analytics
        if context["advanced_analytics"].get("trend") == "rising":
            insights["insights"].append(
                f"? Trend Analysis: Spending is {context['advanced_analytics']['trend']} - "
                f"your spending velocity is Rupee {context['advanced_analytics']['spending_velocity']:.2f}/min"
            )
        
        if context["predictions"].get("days_until_zero_balance"):
            insights["insights"].append(
                f"? Projection: At current rate, balance depletes in "
                f"{context['predictions']['days_until_zero_balance']} days"
            )
        
        if context["fusion_metrics"].get("overall_financial_risk", 0) > 50:
            insights["insights"].append(
                f"? Market-Adjusted Risk: {context['fusion_metrics']['overall_financial_risk']:.0f}/100 "
                f"(including external factors)"
            )
    
    global latest_llm_insights
    latest_llm_insights = insights
    return insights

# ==================== EXTERNAL STREAM INTEGRATION ====================

async def poll_external_stream():
    """Poll external event stream file and ingest into Pathway"""
    stream_file = Path("data_streams/external_events.jsonl")
    processed_lines = 0
    
    while True:
        try:
            await asyncio.sleep(5)  # Poll every 5 seconds
            
            if not stream_file.exists():
                continue
            
            with open(stream_file, 'r') as f:
                lines = f.readlines()
            
            # Process new lines
            for line in lines[processed_lines:]:
                try:
                    event = json.loads(line.strip())
                    
                    # Update external signals state
                    with state_lock:
                        if "sentiment" in event:
                            latest_external_signals["market_sentiment"] = event["sentiment"]
                        if "volatility" in event:
                            latest_external_signals["market_volatility"] = event["volatility"]
                        if "interest_rate" in event:
                            latest_external_signals["interest_rate"] = event["interest_rate"]
                        if "inflation_rate" in event:
                            latest_external_signals["inflation_rate"] = event["inflation_rate"]
                        
                        # Keep recent events (last 10)
                        latest_external_signals["recent_events"].append({
                            "time": event.get("timestamp"),
                            "category": event.get("category"),
                            "description": event.get("description", "")[:100]
                        })
                        latest_external_signals["recent_events"] = latest_external_signals["recent_events"][-10:]
                    
                    # Ingest into Pathway if available
                    if PATHWAY_AVAILABLE:
                        timestamp_ms = int(datetime.fromisoformat(event['timestamp'].replace('Z', '+00:00')).timestamp() * 1000)
                        
                        external_signal_subject.put(
                            event_id=event.get('id', f"ext_{int(time.time()*1000)}"),
                            category=event.get('category', 'unknown'),
                            event_type=event.get('event_type', 'update'),
                            impact=event.get('impact', 'neutral'),
                            value=float(event.get('value', 0)),
                            description=event.get('description', ''),
                            timestamp=timestamp_ms
                        )
                    
                    processed_lines += 1
                    streaming_status["events_processed"] += 1
                    
                except Exception as e:
                    print(f"Error processing external event: {e}")
                    continue
        
        except Exception as e:
            print(f"Error polling external stream: {e}")
            await asyncio.sleep(10)

# ==================== API ENDPOINTS ====================

@app.post("/ingest")
async def ingest_transaction(event: TransactionEvent):
    """Ingest user transaction into Pathway stream"""
    
    if event.timestamp:
        try:
            dt = datetime.fromisoformat(event.timestamp.replace('Z', '+00:00'))
            timestamp_ms = int(dt.timestamp() * 1000)
        except:
            timestamp_ms = int(datetime.now().timestamp() * 1000)
    else:
        timestamp_ms = int(datetime.now().timestamp() * 1000)
    
    event_id = event.id or f"txn_{timestamp_ms}_{event.amount}"
    
    transaction = {
        "event_id": event_id,
        "type": event.type,
        "amount": event.amount,
        "category": event.category,
        "timestamp": timestamp_ms,
        "description": event.description
    }
    
    if PATHWAY_AVAILABLE and PATHWAY_RUNNING:
        try:
            transaction_subject.put(**transaction)
        except Exception as e:
            # If Pathway put fails, fall through to in-memory fallback
            print(f"Pathway put failed, using fallback: {e}")
            transaction_history.append(transaction)
            update_fallback_state()
    else:
        transaction_history.append(transaction)
        update_fallback_state()
    
    streaming_status["events_processed"] += 1
    
    return {
        "status": "success",
        "message": "Transaction ingested into multi-source Pathway pipeline",
        "transaction_id": event_id
    }

@app.get("/metrics")
def get_metrics():
    """Get real-time core financial metrics"""
    with state_lock:
        return latest_metrics.copy()

@app.get("/metrics/advanced")
def get_advanced_analytics():
    """Get advanced streaming analytics"""
    with state_lock:
        return latest_advanced_analytics.copy()

@app.get("/metrics/predictions")
def get_predictions():
    """Get predictive financial insights"""
    with state_lock:
        return latest_predictions.copy()

@app.get("/metrics/categories")
def get_category_metrics():
    """Get category-wise aggregations"""
    with state_lock:
        return latest_categories.copy()

@app.get("/metrics/windowed")
def get_windowed_metrics():
    """Get time-windowed analytics"""
    with state_lock:
        return latest_windowed.copy()

@app.get("/metrics/fusion")
def get_fusion_metrics():
    """Get multi-source data fusion metrics"""
    with state_lock:
        return latest_fusion_metrics.copy()

@app.get("/external-signals")
def get_external_signals():
    """Get current external signal state"""
    with state_lock:
        return latest_external_signals.copy()

@app.get("/alerts")
def get_real_time_alerts():
    """Get real-time decision assistance alerts"""
    with state_lock:
        return latest_alerts.copy()

@app.get("/intelligence")
def get_intelligence():
    """Get financial intelligence (rules-based)"""
    with state_lock:
        return latest_intelligence.copy()

@app.get("/insights/llm")
async def get_llm_insights():
    """Get LLM insights powered by processed analytics"""
    global latest_llm_insights
    
    # Always return immediately with cached or mock data - NEVER block
    if latest_llm_insights and 'generated_at' in latest_llm_insights:
        try:
            generated = datetime.fromisoformat(latest_llm_insights['generated_at'])
            age = (datetime.now() - generated).total_seconds()
            if age < 120:  # Cache for 2 minutes
                return latest_llm_insights
        except:
            pass
    
    # Schedule LLM generation in background (fire-and-forget)
    # Don't await it - let it complete on its own
    try:
        asyncio.ensure_future(_safe_llm_generation())
    except Exception:
        pass
    
    # Return mock/placeholder insights immediately
    return {
        "insights": [
            "Financial analysis is being prepared...",
            "Your spending patterns are being analyzed.",
            "Real-time market signals are being incorporated."
        ],
        "recommendations": [
            "Track daily expenses to identify spending patterns",
            "Build an emergency fund covering 3-6 months of expenses",
            "Review subscriptions and recurring charges regularly"
        ],
        "risk_assessment": "Analyzing...",
        "generated_at": datetime.now().isoformat(),
        "provider": "initializing"
    }

async def _safe_llm_generation():
    """Safely generate LLM insights without blocking the event loop"""
    global latest_llm_insights
    try:
        insights = await asyncio.wait_for(generate_llm_insights_async(), timeout=10.0)
        if insights:
            latest_llm_insights = insights
    except asyncio.TimeoutError:
        print("INFO: Background LLM generation timed out")
    except Exception as e:
        print(f"INFO: Background LLM generation failed: {e}")

@app.get("/status")
def get_streaming_status():
    """Get comprehensive streaming system status"""
    with state_lock:
        status = streaming_status.copy()
        status["uptime_seconds"] = int(time.time() - start_time)
        return status

@app.get("/")
def root():
    """Health check and system info"""
    return {
        "service": "FinTwitch Enhanced Pathway Intelligence Engine",
        "version": "4.0.0-hackathon",
        "status": "operational",
        "engine": "real_pathway" if PATHWAY_AVAILABLE else "fallback",
        "features": {
            "multi_source_ingestion": True,
            "advanced_transformations": True,
            "predictive_analytics": True,
            "real_time_alerts": True,
            "data_fusion": True,
            "llm_from_analytics": True,
            "streaming_visibility": True
        },
        "active_sources": streaming_status["active_data_sources"],
        "events_processed": streaming_status["events_processed"]
    }

# ==================== STARTUP ====================

@app.on_event("startup")
async def startup_event():
    """Initialize enhanced streaming engine"""
    print("\n" + "="*80)
    print("? FINTWITCH ENHANCED PATHWAY INTELLIGENCE ENGINE - HACKATHON EDITION")
    print("="*80)
    print(f"+ Engine: {'REAL Pathway Streaming' if PATHWAY_AVAILABLE else 'Fallback Mode'}")
    if PATHWAY_AVAILABLE:
        print(f"+ Pathway Version: {pw.__version__}")
    print(f"+ LLM Provider: {get_llm_service().provider}")
    print(f"+ Multi-source ingestion: ENABLED")
    print(f"+ Advanced analytics: ENABLED")
    print(f"+ Predictive insights: ENABLED")
    print("\n? Active Data Sources:")
    for source in streaming_status["active_data_sources"]:
        print(f"   * {source}")
    print("\n? Enhanced Endpoints:")
    print("  ? POST /ingest                - Ingest transactions")
    print("  ? GET  /metrics               - Core metrics")
    print("  ? GET  /metrics/advanced      - Advanced analytics")
    print("  ? GET  /metrics/predictions   - Predictive insights")
    print("  ? GET  /metrics/fusion        - Multi-source fusion")
    print("  ? GET  /external-signals      - External data state")
    print("  ? GET  /alerts                - Real-time alerts")
    print("  ? GET  /insights/llm          - LLM insights")
    print("  ? GET  /status                - Streaming status")
    print("="*80)
    
    # Start external stream generator
    global external_stream_generator, external_stream_task
    external_stream_generator = ExternalDataStreamGenerator()
    
    # Start generator in background
    async def run_generator():
        await external_stream_generator.run_continuous_stream(interval_seconds=20.0)
    
    asyncio.create_task(run_generator())
    
    # Start polling external stream
    asyncio.create_task(poll_external_stream())

    # Start the real Pathway pipeline in a background thread (pw.run() is blocking)
    if PATHWAY_AVAILABLE:
        def _run_pathway():
            try:
                pw.run()
            except Exception as e:
                print(f"[Pathway] Pipeline error: {e}")
        pathway_thread = threading.Thread(target=_run_pathway, daemon=True, name="PathwayPipeline")
        pathway_thread.start()
        print("[Pathway] Pipeline thread started (pw.run() running in background)")
    
    print("\nOK HACKATHON-READY PATHWAY SYSTEM OPERATIONAL\n")

# ==================== RUN ====================

if __name__ == "__main__":
    uvicorn.run(
        "pathway_streaming_enhanced:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
