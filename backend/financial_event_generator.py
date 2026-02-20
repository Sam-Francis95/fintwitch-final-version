import datetime
import random
import threading
import time
import uuid
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global Event Queue
event_queue = []
queue_lock = threading.Lock()

# Balance thresholds for adaptive economy
CRITICAL_BALANCE_THRESHOLD = 0    # At or below this: Block all expenses
EXPENSE_BLOCK_THRESHOLD = 100     # Below this: No expenses generated
RECOVERY_THRESHOLD = 800          # Must reach this to resume normal expenses
LOW_BALANCE_THRESHOLD = 500       # Boost income generation
RECOVERY_BALANCE_THRESHOLD = 1500 # Return to normal mode

def generate_event(user_balance=None):
    """Generates a random financial event with adaptive economy logic."""
    # Adaptive probability based on user's balance
    if user_balance is not None and user_balance <= EXPENSE_BLOCK_THRESHOLD:
        # CRITICAL: 100% Income, 0% Expense (complete recovery mode)
        # Expenses only resume after balance reaches RECOVERY_THRESHOLD
        income_probability = 1.0
        expense_multiplier = 0.0
        print(f"🚨 RECOVERY MODE (Balance: ₹{user_balance:.2f}) - INCOME ONLY until ₹{RECOVERY_THRESHOLD}!")
    elif user_balance is not None and user_balance < LOW_BALANCE_THRESHOLD:
        # Low balance: 80% Income, 20% Expense (help user recover)
        income_probability = 0.80
        expense_multiplier = 0.4  # Reduce expense amounts significantly
        print(f"⚠️  LOW BALANCE MODE ({user_balance}) - Boosting income...")
    elif user_balance is not None and user_balance < RECOVERY_BALANCE_THRESHOLD:
        # Recovery mode: 50% Income, 50% Expense (balanced)
        income_probability = 0.50
        expense_multiplier = 0.7
        print(f"📈 RECOVERY MODE ({user_balance}) - Balanced generation...")
    else:
        # Normal mode: 20% Income, 80% Expense (challenge player)
        income_probability = 0.20
        expense_multiplier = 1.0
    
    if random.random() < income_probability:
        event_type = "Income"
        category = random.choice(["Salary", "Bonus", "Interest", "Dividend"])
        # Income amounts
        if category == "Salary":
            amount = random.uniform(3000, 5000)
        elif category == "Bonus":
            amount = random.uniform(500, 2000)
        else:
            amount = random.uniform(50, 500)
    else:
        event_type = "Expense"
        category = random.choice(["Rent", "Groceries", "Utilities", "Subscription", "Emergency", "Entertainment", "Transport"])
        # Expense amounts (reduced when balance is low)
        if category == "Rent":
            amount = random.uniform(1500, 2500) * expense_multiplier
        elif category == "Emergency":
            amount = random.uniform(500, 3000) * expense_multiplier
        elif category == "Groceries":
            amount = random.uniform(100, 400) * expense_multiplier
        elif category == "Utilities":
            amount = random.uniform(100, 300) * expense_multiplier
        else:
            amount = random.uniform(20, 150) * expense_multiplier

    return {
        "id": str(uuid.uuid4()),
        "type": event_type,
        "category": category,
        "amount": round(amount, 2),
        "timestamp": datetime.now().isoformat()
    }

def print_event(event):
    """Pretty prints the event details."""
    colors = {
        "Income": "\033[92m",  # Green
        "Expense": "\033[91m", # Red
        "RESET": "\033[0m"
    }
    
    color = colors.get(event["type"], colors["RESET"])
    sign = "+" if event["type"] == "Income" else "-"
    
    print(f"{color}[{event['type'].upper()}] {event['category']}: {sign}${event['amount']:.2f}{colors['RESET']}")

def background_generator():
    """Background thread that generates events with default (normal) economy."""
    print("Starting Background Event Generator...")
    while True:
        try:
            delay = random.uniform(5, 10)
            time.sleep(delay)
            
            # Generate event with no balance (uses normal mode)
            event = generate_event(None)
            
            with queue_lock:
                event_queue.append(event)
                # Keep queue size manageable
                if len(event_queue) > 50:
                    event_queue.pop(0)
            
            print_event(event)
            
        except Exception as e:
            print(f"Error in generator: {e}")
            time.sleep(5)

@app.route('/events', methods=['GET'])
def get_events():
    """Generates events adaptively based on user balance (no background queue)."""
    # Get user balance from query parameter
    user_balance = request.args.get('balance', type=float)
    
    # Always generate event based on current balance (adaptive mode)
    if user_balance is not None:
        adaptive_event = generate_event(user_balance)
        print_event(adaptive_event)
        return jsonify([adaptive_event])
    
    # Fallback: generate normal event if no balance provided
    normal_event = generate_event(None)
    return jsonify([normal_event])

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "running", "queue_size": len(event_queue)})

if __name__ == "__main__":
    # Note: Background generator DISABLED for fully adaptive event generation
    # Events now generated on-demand based on real-time balance
    
    print("========================================")
    print("Financial Event Generator - ADAPTIVE MODE")
    print("Generating events based on user balance")
    print("Port: 5000")
    print("========================================\n")
    
    try:
        # Run Flask server
        app.run(host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"CRITICAL SERVER ERROR: {e}")
        input("Press Enter to exit...")
