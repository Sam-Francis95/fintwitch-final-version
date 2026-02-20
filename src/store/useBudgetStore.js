import { create } from 'zustand';

const BUDGET_BACKEND_URL = 'http://localhost:5001';

// Budget categories
export const BUDGET_CATEGORIES = {
    living_expenses: { name: "Living Expenses", color: "#3b82f6", icon: "🏠" },
    emergency_fund: { name: "Emergency Fund", color: "#ef4444", icon: "🚨" },
    investments: { name: "Investments", color: "#10b981", icon: "📈" },
    savings: { name: "Savings / Goals", color: "#8b5cf6", icon: "🎯" }
};

export const useBudgetStore = create((set, get) => ({
    // State
    buckets: {
        living_expenses: 0,
        emergency_fund: 0,
        investments: 0,
        savings: 0
    },
    metrics: {
        total_balance: 0,
        total_income: 0,
        total_expenses: 0,
        net_cash_flow: 0
    },
    alerts: [],
    transactions: [],
    isLoading: false,
    isInitialized: false,

    // Actions
    initializeBudget: async (userId) => {
        if (!userId) return;
        
        set({ isLoading: true });
        
        try {
            const response = await fetch(`${BUDGET_BACKEND_URL}/budget/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
            
            if (response.ok) {
                const data = await response.json();
                const budget = data.budget;
                
                set({
                    buckets: budget.buckets,
                    metrics: budget.metrics,
                    alerts: budget.alerts || [],
                    transactions: budget.transactions || [],
                    isInitialized: true,
                    isLoading: false
                });
                
                console.log('✅ Budget system initialized:', budget);
            }
        } catch (error) {
            console.error('❌ Failed to initialize budget:', error);
            set({ isLoading: false });
        }
    },

    allocateIncome: async (userId, incomeAmount, allocations, description = 'Income allocation') => {
        set({ isLoading: true });
        
        try {
            const response = await fetch(`${BUDGET_BACKEND_URL}/budget/allocate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    income_amount: incomeAmount,
                    allocations: allocations,
                    description: description
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                set({
                    buckets: data.buckets,
                    metrics: data.metrics,
                    isLoading: false
                });
                
                // Refresh alerts
                get().refreshAlerts(userId);
                
                console.log('✅ Income allocated:', data);
                return { success: true, data };
            } else {
                const error = await response.json();
                set({ isLoading: false });
                return { success: false, error: error.error };
            }
        } catch (error) {
            console.error('❌ Failed to allocate income:', error);
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    processExpense: async (userId, amount, category, description = '') => {
        set({ isLoading: true });
        
        try {
            const response = await fetch(`${BUDGET_BACKEND_URL}/budget/expense`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    amount: amount,
                    category: category,
                    description: description
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                set({
                    buckets: data.buckets,
                    metrics: data.metrics,
                    isLoading: false
                });
                
                // Refresh alerts
                get().refreshAlerts(userId);
                
                console.log('✅ Expense processed:', data);
                return { success: true, data };
            } else {
                const error = await response.json();
                set({ isLoading: false });
                return { success: false, error: error.error };
            }
        } catch (error) {
            console.error('❌ Failed to process expense:', error);
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    refreshBuckets: async (userId) => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${BUDGET_BACKEND_URL}/budget/buckets/${userId}`);
            
            if (response.ok) {
                const data = await response.json();
                set({
                    buckets: data.buckets,
                    metrics: data.metrics
                });
            }
        } catch (error) {
            console.error('❌ Failed to refresh buckets:', error);
        }
    },

    refreshMetrics: async (userId) => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${BUDGET_BACKEND_URL}/budget/metrics/${userId}`);
            
            if (response.ok) {
                const metrics = await response.json();
                set({ metrics });
            }
        } catch (error) {
            console.error('❌ Failed to refresh metrics:', error);
        }
    },

    refreshAlerts: async (userId) => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${BUDGET_BACKEND_URL}/budget/alerts/${userId}`);
            
            if (response.ok) {
                const data = await response.json();
                set({ alerts: data.alerts });
            }
        } catch (error) {
            console.error('❌ Failed to refresh alerts:', error);
        }
    },

    refreshTransactions: async (userId, limit = 50) => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${BUDGET_BACKEND_URL}/budget/transactions/${userId}?limit=${limit}`);
            
            if (response.ok) {
                const data = await response.json();
                set({ transactions: data.transactions });
            }
        } catch (error) {
            console.error('❌ Failed to refresh transactions:', error);
        }
    },

    // Auto-sync all data
    syncAll: async (userId) => {
        if (!userId) return;
        
        await Promise.all([
            get().refreshBuckets(userId),
            get().refreshAlerts(userId),
            get().refreshTransactions(userId)
        ]);
    }
}));
