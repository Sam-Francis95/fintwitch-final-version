// Pathway FastAPI Backend Integration
// Sends transaction data to the analytics backend

const BACKEND_URL = 'http://localhost:8000';

export const sendToBackend = async (transaction) => {
  try {
    const response = await fetch(`${BACKEND_URL}/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: transaction.amount || 0,
        category: transaction.source || transaction.label || 'game',
        description: `${transaction.label || ''} - Balance: ${transaction.balanceAfter || 0}`,
        type: transaction.amount >= 0 ? 'income' : 'expense',
        date: transaction.ts || new Date().toISOString()
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Transaction sent to Pathway backend:', data);
      return data;
    }
  } catch (error) {
    // Fail silently - backend is optional
    console.log('📊 Pathway backend unavailable (optional):', error.message);
  }
  return null;
};

export const getBackendStats = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/transactions`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Backend unavailable');
  }
  return null;
};
