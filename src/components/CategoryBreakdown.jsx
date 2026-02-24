import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Layers, TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'];

const CategoryBreakdown = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/metrics/categories');
        if (!response.ok) throw new Error('Failed to fetch category metrics');
        const data = await response.json();
        setCategories(data.categories || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    const interval = setInterval(fetchCategories, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-indigo-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="w-6 h-6 text-indigo-400 animate-pulse" />
          <h3 className="text-xl font-bold text-indigo-400">Category Breakdown</h3>
        </div>
        <p className="text-gray-400">Loading category data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/30">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-indigo-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-indigo-400">Category Breakdown</h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          No transactions yet. Start using the app to see category breakdown.
        </p>
      </div>
    );
  }

  // Prepare data for pie chart (expenses only)
  const chartData = categories
    .filter(cat => cat.total_expenses > 0)
    .map(cat => ({
      name: cat.category,
      value: cat.total_expenses
    }));

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-indigo-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-indigo-400">Category Breakdown</h3>
          <span className="px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-300">
            Aggregated
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {categories.length} categories
        </span>
      </div>

      {/* Pie Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #6366F1',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={80}
                iconType="circle"
                formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-semibold text-white capitalize">
                  {cat.category}
                </span>
              </div>
              <span className={`text-sm font-medium ${
                cat.net >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{cat.net.toFixed(2)}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-300">₹{cat.total_income.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span className="text-red-300">₹{cat.total_expenses.toFixed(2)}</span>
              </div>
              <div className="text-gray-400 text-right">
                {cat.transaction_count} txns
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-indigo-500/20">
        <p className="text-xs text-gray-500 text-center">
          📊 Category aggregations computed by Pathway streaming engine
        </p>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
