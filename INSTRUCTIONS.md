# Instructions

## Backend is Running! ✅

The FastAPI server is currently running on http://localhost:8000

## Next Steps - Start the React Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies (first time only):
```bash
npm install
```

3. Start the React development server:
```bash
npm run dev
```

4. Open your browser to http://localhost:3000

5. You can now add transactions through the React interface, and they will be sent to the FastAPI backend!

## Testing the API

You can also test the API directly using curl or a browser:

- GET http://localhost:8000 - Check server status
- POST http://localhost:8000/transaction - Add a transaction
- GET http://localhost:8000/transactions - View all transactions

### Example curl command:
```bash
curl -X POST http://localhost:8000/transaction \
  -H "Content-Type: application/json" \
  -d '{"amount": 50.25, "category": "Food", "description": "Lunch", "type": "expense"}'
```

## Stopping the Servers

- Backend: Press CTRL+C in the terminal running main.py
- Frontend: Press CTRL+C in the terminal running npm run dev
