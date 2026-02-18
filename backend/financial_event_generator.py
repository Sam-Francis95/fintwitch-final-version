import datetime
import random
import threading
import time
import uuid
from datetime import datetime

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global Event Queue
event_queue = []
queue_lock = threading.Lock()

def generate_event():
    """Generates a random financial event with balanced economy logic."""
    # 80% chance of Expense, 20% chance of Income to prevent infinite wealth
    if random.random() < 0.2:
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
        # Expense amounts (Increased to challenge player)
        if category == "Rent":
            amount = random.uniform(1500, 2500)
        elif category == "Emergency":
            amount = random.uniform(500, 3000)
        elif category == "Groceries":
            amount = random.uniform(100, 400)
        elif category == "Utilities":
            amount = random.uniform(100, 300)
        else:
            amount = random.uniform(20, 150)

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
    """Background thread that generates events."""
    print("Starting Background Event Generator...")
    while True:
        try:
            delay = random.uniform(5, 10)
            time.sleep(delay)
            
            event = generate_event()
            
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
    """Returns and clears the event queue."""
    global event_queue
    with queue_lock:
        events = list(event_queue)
        event_queue.clear()
    
    return jsonify(events)

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "running", "queue_size": len(event_queue)})

if __name__ == "__main__":
    # Start generator thread
    generator_thread = threading.Thread(target=background_generator, daemon=True)
    generator_thread.start()
    
    try:
        # Run Flask server
        app.run(host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"CRITICAL SERVER ERROR: {e}")
        input("Press Enter to exit...")
