"""
Advanced Mock Pathway Implementation with Time Windows, Aggregations, and LLM Support
Provides comprehensive streaming analytics capabilities for development/testing
"""

from typing import Any, Dict, List, Callable, Optional
from datetime import datetime, timedelta
from collections import defaultdict
import threading
import time
import json


class Table:
    """Advanced mock streaming table with time-aware capabilities"""
    def __init__(self):
        self.data: List[Dict[str, Any]] = []
        self._lock = threading.Lock()
        self._transformations = []
    
    def select(self, **kwargs):
        """Select and transform columns"""
        new_table = Table()
        with self._lock:
            for row in self.data:
                new_row = {}
                for key, value in kwargs.items():
                    if callable(value):
                        try:
                            new_row[key] = value(row)
                        except:
                            new_row[key] = None
                    else:
                        new_row[key] = row.get(value, value)
                new_table.data.append(new_row)
        return new_table
    
    def groupby(self, *columns):
        """Group by columns"""
        return GroupedTable(self, list(columns))
    
    def filter(self, condition):
        """Filter rows based on condition"""
        new_table = Table()
        with self._lock:
            for row in self.data:
                try:
                    if callable(condition):
                        if condition(row):
                            new_table.data.append(row.copy())
                    elif condition:
                        new_table.data.append(row.copy())
                except:
                    pass
        return new_table
    
    def with_columns(self, **kwargs):
        """Add computed columns"""
        new_table = Table()
        with self._lock:
            for row in self.data:
                new_row = row.copy()
                for key, value in kwargs.items():
                    if callable(value):
                        try:
                            new_row[key] = value(row)
                        except:
                            new_row[key] = None
                    else:
                        new_row[key] = value
                new_table.data.append(new_row)
        return new_table
    
    def window_by(self, time_column: str, duration_minutes: int):
        """Create time-windowed view of data"""
        return TimeWindowedTable(self, time_column, duration_minutes)
    
    def reduce(self, **kwargs):
        """Perform aggregations on entire table"""
        result = {}
        with self._lock:
            for key, reducer in kwargs.items():
                if callable(reducer):
                    result[key] = reducer(self.data)
                else:
                    result[key] = reducer
        return SingleRowTable(result)
    
    def append(self, record: Dict[str, Any]):
        """Append a record to the table"""
        with self._lock:
            # Add timestamp if not present
            if 'ingestion_time' not in record:
                record['ingestion_time'] = datetime.now().isoformat()
            self.data.append(record.copy())
    
    def join(self, other_table, left_on: str, right_on: str):
        """Join with another table"""
        new_table = Table()
        with self._lock:
            with other_table._lock:
                for row in self.data:
                    for other_row in other_table.data:
                        if row.get(left_on) == other_row.get(right_on):
                            joined_row = {**row, **other_row}
                            new_table.data.append(joined_row)
        return new_table


class TimeWindowedTable:
    """Table with time-based windowing"""
    def __init__(self, table: Table, time_column: str, duration_minutes: int):
        self.table = table
        self.time_column = time_column
        self.duration = timedelta(minutes=duration_minutes)
    
    def get_windowed_data(self):
        """Get data within the time window"""
        now = datetime.now()
        cutoff = now - self.duration
        windowed_data = []
        
        with self.table._lock:
            for row in self.table.data:
                try:
                    row_time = datetime.fromisoformat(row.get(self.time_column, row.get('ingestion_time', '')))
                    if row_time >= cutoff:
                        windowed_data.append(row)
                except:
                    # If timestamp parsing fails, include recent records
                    windowed_data.append(row)
        
        return windowed_data
    
    def reduce(self, **kwargs):
        """Perform aggregations on windowed data"""
        windowed_data = self.get_windowed_data()
        result = {}
        for key, reducer in kwargs.items():
            if callable(reducer):
                result[key] = reducer(windowed_data)
            else:
                result[key] = reducer
        return SingleRowTable(result)


class GroupedTable:
    """Mock grouped table for aggregations"""
    def __init__(self, table: Table, group_columns: List[str]):
        self.table = table
        self.group_columns = group_columns
    
    def reduce(self, **kwargs):
        """Perform aggregations per group"""
        groups = defaultdict(list)
        
        with self.table._lock:
            for row in self.table.data:
                # Create group key
                key = tuple(row.get(col, None) for col in self.group_columns)
                groups[key].append(row)
        
        # Create result table
        result_table = Table()
        for group_key, group_data in groups.items():
            result_row = dict(zip(self.group_columns, group_key))
            
            for agg_name, reducer in kwargs.items():
                if callable(reducer):
                    result_row[agg_name] = reducer(group_data)
                else:
                    result_row[agg_name] = reducer
            
            result_table.data.append(result_row)
        
        return result_table


class SingleRowTable:
    """Represents a single aggregated result"""
    def __init__(self, data: Dict[str, Any]):
        self.data = [data]
    
    def __getitem__(self, key):
        return self.data[0].get(key)
    
    def __iter__(self):
        return iter([type('Row', (), self.data[0])()])


class ConnectorSubject:
    """Advanced mock connector for streaming input with intelligence"""
    def __init__(self):
        self.table = Table()
        self._lock = threading.Lock()
        self._event_count = 0
        self._start_time = datetime.now()
    
    def next(self, **record):
        """Ingest a new record with automatic enrichment"""
        with self._lock:
            self._event_count += 1
            record['event_id'] = self._event_count
            record['ingestion_time'] = datetime.now().isoformat()
            self.table.append(record)
    
    def get_table(self):
        """Get the streaming table"""
        return self.table
    
    def get_event_rate(self):
        """Calculate events per minute"""
        elapsed = (datetime.now() - self._start_time).total_seconds() / 60
        return self._event_count / max(elapsed, 0.01)


class Reducers:
    """Advanced reducer functions with time-awareness"""
    
    @staticmethod
    def sum(column):
        """Sum aggregation"""
        def _sum(data):
            return sum(row.get(column, 0) for row in data)
        return _sum
    
    @staticmethod
    def count():
        """Count aggregation"""
        def _count(data):
            return len(data)
        return _count
    
    @staticmethod
    def avg(column):
        """Average aggregation"""
        def _avg(data):
            values = [row.get(column, 0) for row in data if row.get(column) is not None]
            return sum(values) / len(values) if values else 0
        return _avg
    
    @staticmethod
    def max(column):
        """Maximum value"""
        def _max(data):
            values = [row.get(column, 0) for row in data if row.get(column) is not None]
            return max(values) if values else 0
        return _max
    
    @staticmethod
    def min(column):
        """Minimum value"""
        def _min(data):
            values = [row.get(column, 0) for row in data if row.get(column) is not None]
            return min(values) if values else 0
        return _min
    
    @staticmethod
    def collect(column):
        """Collect all values into list"""
        def _collect(data):
            return [row.get(column) for row in data if row.get(column) is not None]
        return _collect


class StreamingFunctions:
    """Advanced streaming operations"""
    
    @staticmethod
    def moving_average(column, window_size=5):
        """Calculate moving average"""
        def _ma(data):
            values = [row.get(column, 0) for row in data[-window_size:]]
            return sum(values) / len(values) if values else 0
        return _ma
    
    @staticmethod
    def rate_of_change(column):
        """Calculate rate of change"""
        def _roc(data):
            if len(data) < 2:
                return 0
            recent = [row.get(column, 0) for row in data[-10:]]
            if len(recent) < 2:
                return 0
            return (recent[-1] - recent[0]) / max(len(recent), 1)
        return _roc
    
    @staticmethod
    def detect_spike(column, threshold=2.0):
        """Detect sudden spikes"""
        def _spike(data):
            if len(data) < 3:
                return False
            recent = [row.get(column, 0) for row in data[-10:]]
            if len(recent) < 3:
                return False
            avg = sum(recent[:-1]) / len(recent[:-1])
            current = recent[-1]
            return current > avg * threshold if avg > 0 else False
        return _spike


class LLMMock:
    """Mock LLM for generating insights"""
    
    @staticmethod
    def generate_summary(metrics: Dict[str, Any]) -> str:
        """Generate natural language summary"""
        balance = metrics.get('balance', 0)
        income = metrics.get('total_income', 0)
        expenses = metrics.get('total_expenses', 0)
        risk = metrics.get('risk', 'LOW')
        
        if balance < 0:
            return f"?? Your account is overdrawn by Rupee {abs(balance):.2f}. You've spent Rupee {expenses:.2f} but only earned Rupee {income:.2f}. Immediate action needed to restore financial stability."
        elif risk == "HIGH":
            return f"?? High financial risk detected. Your expenses (Rupee {expenses:.2f}) are approaching or exceeding your income (Rupee {income:.2f}). Current balance: Rupee {balance:.2f}. Consider reducing discretionary spending."
        elif balance < 1000:
            return f"? Low balance alert. You have Rupee {balance:.2f} remaining. With income of Rupee {income:.2f} and expenses of Rupee {expenses:.2f}, maintain cautious spending."
        else:
            return f"OK Financial health looks stable. Balance: Rupee {balance:.2f} | Income: Rupee {income:.2f} | Expenses: Rupee {expenses:.2f}. Keep maintaining this positive trend!"
    
    @staticmethod
    def explain_risk(metrics: Dict[str, Any]) -> str:
        """Explain why risk is at current level"""
        risk = metrics.get('risk', 'LOW')
        income = metrics.get('total_income', 0)
        expenses = metrics.get('total_expenses', 0)
        
        if risk == "HIGH":
            ratio = (expenses / income * 100) if income > 0 else 100
            return f"Risk is HIGH because your expenses represent {ratio:.1f}% of your income. Sustainable spending should stay below 80% to maintain financial cushion."
        else:
            ratio = (expenses / income * 100) if income > 0 else 0
            return f"Risk is LOW because expenses are only {ratio:.1f}% of income, leaving comfortable margin for savings and emergencies."
    
    @staticmethod
    def recommend_actions(metrics: Dict[str, Any], alerts: List[str]) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        balance = metrics.get('balance', 0)
        expenses = metrics.get('total_expenses', 0)
        
        if metrics.get('risk') == 'HIGH':
            recommendations.append("? Priority: Reduce discretionary spending by 20%")
            recommendations.append("? Goal: Increase income through side projects or overtime")
        
        if balance < 5000:
            recommendations.append("? Build emergency fund: Aim for Rupee 10,000 minimum reserve")
        
        if 'overspending' in str(alerts).lower():
            recommendations.append("? Review spending patterns and cut non-essential expenses")
        
        if expenses > 0:
            recommendations.append("? Track spending by category to identify optimization areas")
        
        if not recommendations:
            recommendations.append("OK Continue current financial habits - you're doing great!")
        
        return recommendations[:3]  # Top 3 recommendations


# Mock Pathway API
class PathwayMock:
    """Advanced Mock Pathway module"""
    
    class Schema:
        """Mock schema class"""
        pass
    
    reducers = Reducers()
    streaming = StreamingFunctions()
    llm = LLMMock()
    
    @staticmethod
    def apply(func, *args):
        """Apply function to arguments"""
        return lambda row: func(*[row.get(arg) if isinstance(arg, str) else arg for arg in args])
    
    @staticmethod
    def if_else(condition, true_val, false_val):
        """Conditional expression"""
        return lambda row: true_val if row.get(condition) else false_val
    
    @staticmethod
    def debug():
        """Mock debug namespace"""
        class Debug:
            @staticmethod
            def table_to_dicts(table: Table):
                """Convert table to list of dicts"""
                with table._lock:
                    return table.data.copy()
        return Debug()
    
    @staticmethod
    def io():
        """Mock io namespace"""
        class IO:
            class python:
                """Python connector namespace"""
                @staticmethod
                def ConnectorSubject(schema=None, **kwargs):
                    """Create a connector subject"""
                    return ConnectorSubject()
        return IO()
    
    @staticmethod
    def this():
        """Reference to current row"""
        class This:
            def __getattr__(self, name):
                return name
        return This()


# Singleton instance
pw = PathwayMock()
