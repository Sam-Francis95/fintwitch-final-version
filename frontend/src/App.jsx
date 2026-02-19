import React, { useState } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const transaction = {
      amount: parseFloat(amount),
      category,
      description,
      type
    };

    try {
      // Send POST request to FastAPI backend
      const response = await fetch('http://localhost:8000/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setMessage(`✅ Transaction saved! Total: ${data.total_transactions}`);
        setTransactions([data.transaction, ...transactions]);
        
        // Reset form
        setAmount('');
        setCategory('');
        setDescription('');
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>💰 Fintwitch - Financial Tracker</h1>
        <p>Powered by Pathway + FastAPI</p>
      </header>

      <div className="container">
        <div className="form-section">
          <h2>Add New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Food, Transport, Salary..."
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <button type="submit" className="submit-btn">
              Add Transaction
            </button>
          </form>

          {message && <div className="message">{message}</div>}
        </div>

        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet. Add one above!</p>
          ) : (
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-header">
                    <span className="transaction-type">
                      {transaction.type === 'income' ? '💰' : '💸'} {transaction.type}
                    </span>
                    <span className="transaction-amount">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="transaction-body">
                    <strong>{transaction.category}</strong>
                    {transaction.description && <p>{transaction.description}</p>}
                    <small>{new Date(transaction.date).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
