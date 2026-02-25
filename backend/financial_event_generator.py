import datetime
import random
import threading
import time
import uuid
from datetime import datetime
import requests

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Pathway Streaming Engine endpoint
PATHWAY_INGEST_URL = "http://localhost:8000/ingest"

# Global Event Queue
event_queue = []
queue_lock = threading.Lock()

# Balance thresholds for adaptive economy
CRITICAL_BALANCE_THRESHOLD = 0     # At or below this: trigger recovery mode
EXPENSE_BLOCK_THRESHOLD = 100      # Below this: No expenses generated
RECOVERY_THRESHOLD = 2000          # Must reach this to exit recovery mode and resume normal expenses
LOW_BALANCE_THRESHOLD = 500        # Boost income generation
RECOVERY_BALANCE_THRESHOLD = 1500  # Return to balanced mode
HIGH_BALANCE_THRESHOLD = 90000     # Above this: Increase expenses significantly
MAX_BALANCE_THRESHOLD = 100000     # Hard cap: income blocked until user allocates money

# Recovery state tracker - once balance hits 0, expenses are blocked until RECOVERY_THRESHOLD
recovery_mode_active = False

def generate_event(user_balance=None):
    """Generates a random financial event with adaptive economy logic."""
    global recovery_mode_active

    if user_balance is not None:
        # Exit recovery mode once balance reaches RECOVERY_THRESHOLD
        if recovery_mode_active and user_balance >= RECOVERY_THRESHOLD:
            recovery_mode_active = False
            print(f"✅ RECOVERY COMPLETE (Balance: \u20b9{user_balance:.2f}) - Resuming normal mode")

        if user_balance <= CRITICAL_BALANCE_THRESHOLD:
            # Trigger recovery mode — income only until RECOVERY_THRESHOLD
            recovery_mode_active = True
            income_probability = 1.0
            expense_multiplier = 0.0
            print(f"🚨 CRITICAL: Balance \u20b9{user_balance:.2f} - INCOME ONLY until \u20b9{RECOVERY_THRESHOLD}")
        elif recovery_mode_active:
            # Still recovering — balance > 0 but hasn't hit RECOVERY_THRESHOLD yet
            income_probability = 1.0
            expense_multiplier = 0.0
            print(f"🔄 RECOVERING (Balance: \u20b9{user_balance:.2f}) - Income only until \u20b9{RECOVERY_THRESHOLD}")
        elif user_balance >= MAX_BALANCE_THRESHOLD:
            # Balance cap reached — block all income until user allocates money
            income_probability = 0.0
            expense_multiplier = 3.0
            print(f"🔝 CAP REACHED (Balance: \u20b9{user_balance:.2f}) - Expenses only; allocate money to unlock growth")
        elif user_balance >= HIGH_BALANCE_THRESHOLD:
            # High balance — heavy expenses to challenge player
            income_probability = 0.10
            expense_multiplier = 2.5
            print(f"💰 HIGH BALANCE MODE (Balance: \u20b9{user_balance:.2f}) - Increased expenses!")
        elif user_balance < LOW_BALANCE_THRESHOLD:
            # Low balance — boost income
            income_probability = 0.80
            expense_multiplier = 0.4
            print(f"⚠️  LOW BALANCE MODE ({user_balance}) - Boosting income...")
        elif user_balance < RECOVERY_BALANCE_THRESHOLD:
            # Balanced mode
            income_probability = 0.50
            expense_multiplier = 0.7
            print(f"📈 BALANCED MODE ({user_balance}) - Balanced generation...")
        else:
            # Normal mode — challenge player (20% income, 80% expense)
            income_probability = 0.20
            expense_multiplier = 1.0
    else:
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

def forward_to_pathway(event):
    """Forward event to Pathway streaming engine"""
    try:
        # Convert event format to match Pathway schema
        pathway_event = {
            "type": event["type"].lower(),  # "Income" -> "income"
            "amount": event["amount"],
            "category": event["category"],
            "timestamp": event["timestamp"],
            "description": f"{event['type']} - {event['category']}"
        }
        
        response = requests.post(PATHWAY_INGEST_URL, json=pathway_event, timeout=1)
        if response.status_code == 200:
            print(f"  ✓ Forwarded to Pathway")
        else:
            print(f"  ⚠ Pathway ingestion failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        # Fail silently - Pathway might not be running
        print(f"  ⚠ Pathway unavailable: {str(e)[:50]}")
    except Exception as e:
        print(f"  ⚠ Error forwarding to Pathway: {str(e)[:50]}")

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
        # NOTE: Do NOT forward_to_pathway here - the frontend transact() already
        # calls sendToBackend(tx) which sends to Pathway. Double-calling would
        # inflate Pathway metrics by 2x.
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
