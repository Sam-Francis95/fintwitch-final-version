// Financial Event Listener - Connects to Event Generator Backend
// Polls for automatic income/expense events

const EVENT_BACKEND_URL = 'http://localhost:5000';
const POLL_INTERVAL = 3000; // Check every 3 seconds

let pollingInterval = null;

export const startEventListener = (getBalance, onEventReceived) => {
  if (pollingInterval) {
    console.log('Event listener already running');
    return;
  }

  console.log('🎧 Starting Financial Event Listener...');
  
  const pollEvents = async () => {
    try {
      // Always get the latest balance (supports both function and static value)
      const balance = typeof getBalance === 'function' ? getBalance() : getBalance;
      const response = await fetch(`${EVENT_BACKEND_URL}/events?balance=${balance}`, {
        method: 'GET',
      });

      if (response.ok) {
        const events = await response.json();
        
        if (events && events.length > 0) {
          events.forEach(event => {
            console.log(`💰 Financial Event: ${event.type} (${event.category}) $${event.amount}`);
            
            // Call the callback with event data
            if (onEventReceived) {
              onEventReceived(event);
            }
          });
        }
      }
    } catch (error) {
      // Silently fail - backend might not be running
      console.log('📊 Event backend unavailable (optional feature)');
    }
  };

  // Poll immediately, then set interval
  pollEvents();
  pollingInterval = setInterval(pollEvents, POLL_INTERVAL);
};

export const stopEventListener = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log('🛑 Financial Event Listener stopped');
  }
};

export const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${EVENT_BACKEND_URL}/status`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Event Generator Status:', data);
      return true;
    }
  } catch (error) {
    console.log('❌ Event Generator not running');
  }
  return false;
};
