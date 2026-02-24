"""
Budget Allocation System for FinTwitch
Real-time financial intelligence simulator with category-based budget buckets
"""

import datetime
import uuid
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

# Global storage for user budget data (in production, use database)
user_budgets = {}
budget_lock = threading.Lock()

# Budget Categories
BUDGET_CATEGORIES = {
    "living_expenses": {"name": "Living Expenses", "priority": 1},
    "emergency_fund": {"name": "Emergency Fund", "priority": 2},
    "investments": {"name": "Investments", "priority": 3},
    "savings": {"name": "Savings / Goals", "priority": 4}
}

# Category mappings for automatic expense handling
EXPENSE_CATEGORY_MAPPING = {
    "Rent": "living_expenses",
    "Groceries": "living_expenses",
    "Utilities": "living_expenses",
    "Transport": "living_expenses",
    "Subscription": "living_expenses",
    "Entertainment": "living_expenses",
    "Emergency": "emergency_fund",
    "Medical": "emergency_fund",
    "Health": "emergency_fund",
    "Investment": "investments",
    "Stock": "investments",
    "Asset": "investments",
    "Savings": "savings",
    "Goal": "savings"
}

# Risk thresholds
RISK_THRESHOLDS = {
    "emergency_fund_low": 5000,
    "living_expenses_low": 3000,
    "negative_cash_flow": 0,
    "high_risk_balance": 2000
}


def get_default_budget():
    """Initialize default budget structure"""
    return {
        "user_id": None,
        "buckets": {
            "living_expenses": 0,
            "emergency_fund": 0,
            "investments": 0,
            "savings": 0
        },
        "transactions": [],
        "metrics": {
            "total_income": 0,
            "total_expenses": 0,
            "net_cash_flow": 0
        },
        "alerts": [],
        "created_at": datetime.now().isoformat()
    }


def calculate_metrics(budget_data):
    """Calculate financial metrics from transactions"""
    total_income = sum(t["amount"] for t in budget_data["transactions"] if t["type"] == "income")
    total_expenses = sum(abs(t["amount"]) for t in budget_data["transactions"] if t["type"] == "expense")
    net_cash_flow = total_income - total_expenses
    
    return {
        "total_balance": sum(budget_data["buckets"].values()),
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_cash_flow": net_cash_flow,
        "bucket_balances": budget_data["buckets"].copy()
    }


def generate_alerts(budget_data):
    """Generate risk alerts based on budget state"""
    alerts = []
    buckets = budget_data["buckets"]
    metrics = calculate_metrics(budget_data)
    
    # Emergency fund low
    if buckets["emergency_fund"] < RISK_THRESHOLDS["emergency_fund_low"]:
        alerts.append({
            "id": str(uuid.uuid4()),
            "type": "warning",
            "category": "emergency_fund",
            "message": f"Emergency fund low: Rupee {buckets['emergency_fund']:.2f} (Recommended: Rupee {RISK_THRESHOLDS['emergency_fund_low']})",
            "timestamp": datetime.now().isoformat(),
            "severity": "medium"
        })
    
    # Living expenses low
    if buckets["living_expenses"] < RISK_THRESHOLDS["living_expenses_low"]:
        alerts.append({
            "id": str(uuid.uuid4()),
            "type": "warning",
            "category": "living_expenses",
            "message": f"Living expenses bucket low: Rupee {buckets['living_expenses']:.2f}",
            "timestamp": datetime.now().isoformat(),
            "severity": "high"
        })
    
    # Negative cash flow
    if metrics["net_cash_flow"] < RISK_THRESHOLDS["negative_cash_flow"]:
        alerts.append({
            "id": str(uuid.uuid4()),
            "type": "danger",
            "category": "cash_flow",
            "message": f"Negative cash flow detected: Rupee {metrics['net_cash_flow']:.2f}",
            "timestamp": datetime.now().isoformat(),
            "severity": "critical"
        })
    
    # High financial risk (total balance low)
    if metrics["total_balance"] < RISK_THRESHOLDS["high_risk_balance"]:
        alerts.append({
            "id": str(uuid.uuid4()),
            "type": "danger",
            "category": "overall",
            "message": f"High financial risk - Total balance critically low: Rupee {metrics['total_balance']:.2f}",
            "timestamp": datetime.now().isoformat(),
            "severity": "critical"
        })
    
    # Check for depleted buckets
    for bucket_name, balance in buckets.items():
        if balance <= 0 and any(t["bucket"] == bucket_name for t in budget_data["transactions"][-10:] if t["type"] == "expense"):
            alerts.append({
                "id": str(uuid.uuid4()),
                "type": "danger",
                "category": bucket_name,
                "message": f"{BUDGET_CATEGORIES[bucket_name]['name']} bucket depleted!",
                "timestamp": datetime.now().isoformat(),
                "severity": "high"
            })
    
    return alerts


def categorize_expense(expense_category):
    """Map expense category to budget bucket"""
    for key, bucket in EXPENSE_CATEGORY_MAPPING.items():
        if key.lower() in expense_category.lower():
            return bucket
    return "living_expenses"  # Default fallback


@app.route('/budget/init', methods=['POST'])
def init_budget():
    """Initialize budget for a user"""
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    
    with budget_lock:
        if user_id not in user_budgets:
            budget = get_default_budget()
            budget["user_id"] = user_id
            user_budgets[user_id] = budget
            return jsonify({"message": "Budget initialized", "budget": budget}), 201
        else:
            return jsonify({"message": "Budget already exists", "budget": user_budgets[user_id]}), 200


@app.route('/budget/allocate', methods=['POST'])
def allocate_income():
    """
    Allocate income across budget buckets
    Body: {
        "user_id": "user123",
        "income_amount": 50000,
        "allocations": {
            "living_expenses": 20000,
            "emergency_fund": 10000,
            "investments": 15000,
            "savings": 5000
        },
        "description": "Salary March 2026"
    }
    """
    data = request.json
    user_id = data.get('user_id')
    income_amount = data.get('income_amount', 0)
    allocations = data.get('allocations', {})
    description = data.get('description', 'Income allocation')
    
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    
    # Validate allocation total
    total_allocated = sum(allocations.values())
    if total_allocated > income_amount:
        return jsonify({"error": f"Total allocation (Rupee {total_allocated}) exceeds income (Rupee {income_amount})"}), 400
    
    with budget_lock:
        # Initialize if not exists
        if user_id not in user_budgets:
            budget = get_default_budget()
            budget["user_id"] = user_id
            user_budgets[user_id] = budget
        
        budget = user_budgets[user_id]
        
        # Update bucket balances
        for bucket, amount in allocations.items():
            if bucket in budget["buckets"]:
                budget["buckets"][bucket] += amount
        
        # Record transaction
        transaction = {
            "id": str(uuid.uuid4()),
            "type": "income",
            "amount": income_amount,
            "allocations": allocations,
            "bucket": None,  # Income goes to multiple buckets
            "description": description,
            "timestamp": datetime.now().isoformat()
        }
        budget["transactions"].append(transaction)
        
        # Update metrics
        budget["metrics"] = calculate_metrics(budget)
        
        # Generate alerts
        budget["alerts"] = generate_alerts(budget)
        
        user_budgets[user_id] = budget
        
        return jsonify({
            "message": "Income allocated successfully",
            "transaction": transaction,
            "buckets": budget["buckets"],
            "metrics": budget["metrics"]
        }), 200


@app.route('/budget/expense', methods=['POST'])
def handle_expense():
    """
    Process an expense from appropriate bucket
    Body: {
        "user_id": "user123",
        "amount": 1500,
        "category": "Rent",
        "description": "Monthly rent payment"
    }
    """
    data = request.json
    user_id = data.get('user_id')
    amount = abs(data.get('amount', 0))  # Ensure positive
    category = data.get('category', 'General')
    description = data.get('description', '')
    
    if not user_id or amount <= 0:
        return jsonify({"error": "user_id and positive amount required"}), 400
    
    with budget_lock:
        if user_id not in user_budgets:
            return jsonify({"error": "Budget not initialized"}), 404
        
        budget = user_budgets[user_id]
        
        # Determine which bucket to use
        bucket_name = categorize_expense(category)
        bucket_balance = budget["buckets"][bucket_name]
        
        deficit = 0
        alert = None
        
        # Deduct from bucket
        if bucket_balance >= amount:
            budget["buckets"][bucket_name] -= amount
        else:
            # Insufficient funds in bucket
            deficit = amount - bucket_balance
            budget["buckets"][bucket_name] = 0
            
            alert = {
                "id": str(uuid.uuid4()),
                "type": "danger",
                "category": bucket_name,
                "message": f"Insufficient funds in {BUDGET_CATEGORIES[bucket_name]['name']}! Deficit: Rupee {deficit:.2f}",
                "timestamp": datetime.now().isoformat(),
                "severity": "critical"
            }
        
        # Record transaction
        transaction = {
            "id": str(uuid.uuid4()),
            "type": "expense",
            "amount": -amount,
            "category": category,
            "bucket": bucket_name,
            "description": description,
            "deficit": deficit,
            "timestamp": datetime.now().isoformat(),
            "resulting_balance": budget["buckets"][bucket_name]
        }
        budget["transactions"].append(transaction)
        
        # Update metrics
        budget["metrics"] = calculate_metrics(budget)
        
        # Generate alerts
        budget["alerts"] = generate_alerts(budget)
        if alert:
            budget["alerts"].insert(0, alert)
        
        user_budgets[user_id] = budget
        
        return jsonify({
            "message": "Expense processed",
            "transaction": transaction,
            "buckets": budget["buckets"],
            "metrics": budget["metrics"],
            "deficit": deficit > 0,
            "alert": alert
        }), 200


@app.route('/budget/buckets/<user_id>', methods=['GET'])
def get_buckets(user_id):
    """Get current bucket balances"""
    with budget_lock:
        if user_id not in user_budgets:
            return jsonify({"error": "Budget not initialized"}), 404
        
        budget = user_budgets[user_id]
        return jsonify({
            "buckets": budget["buckets"],
            "metrics": calculate_metrics(budget)
        }), 200


@app.route('/budget/metrics/<user_id>', methods=['GET'])
def get_metrics(user_id):
    """Get financial metrics"""
    with budget_lock:
        if user_id not in user_budgets:
            return jsonify({"error": "Budget not initialized"}), 404
        
        budget = user_budgets[user_id]
        metrics = calculate_metrics(budget)
        
        return jsonify(metrics), 200


@app.route('/budget/alerts/<user_id>', methods=['GET'])
def get_alerts(user_id):
    """Get current alerts"""
    with budget_lock:
        if user_id not in user_budgets:
            return jsonify({"error": "Budget not initialized"}), 404
        
        budget = user_budgets[user_id]
        alerts = generate_alerts(budget)
        
        return jsonify({"alerts": alerts}), 200


@app.route('/budget/transactions/<user_id>', methods=['GET'])
def get_transactions(user_id):
    """Get transaction history"""
    limit = request.args.get('limit', type=int, default=50)
    
    with budget_lock:
        if user_id not in user_budgets:
            return jsonify({"error": "Budget not initialized"}), 404
        
        budget = user_budgets[user_id]
        transactions = budget["transactions"][-limit:]
        
        return jsonify({
            "transactions": transactions,
            "count": len(transactions)
        }), 200


@app.route('/budget/status', methods=['GET'])
def status():
    """Health check"""
    with budget_lock:
        user_count = len(user_budgets)
    
    return jsonify({
        "status": "running",
        "service": "Budget Allocation System",
        "users": user_count
    }), 200


if __name__ == "__main__":
    print("=" * 60)
    print("? FinTwitch Budget Allocation System")
    print("=" * 60)
    print("Endpoints:")
    print("  POST   /budget/init          - Initialize budget")
    print("  POST   /budget/allocate      - Allocate income")
    print("  POST   /budget/expense       - Process expense")
    print("  GET    /budget/buckets/<id>  - Get bucket balances")
    print("  GET    /budget/metrics/<id>  - Get financial metrics")
    print("  GET    /budget/alerts/<id>   - Get risk alerts")
    print("  GET    /budget/transactions/<id> - Get transaction history")
    print("=" * 60)
    
    try:
        app.run(host='0.0.0.0', port=5001, debug=True)
    except Exception as e:
        print(f"CRITICAL SERVER ERROR: {e}")
        input("Press Enter to exit...")
