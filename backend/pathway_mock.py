"""
Mock Pathway Implementation for Development/Testing
This provides the same API as Pathway but uses in-memory state instead.
Replace with real Pathway when available.
"""

from typing import Any, Dict, List, Callable
from datetime import datetime
import threading


class Table:
    """Mock streaming table that holds streaming data"""
    def __init__(self):
        self.data: List[Dict[str, Any]] = []
        self._lock = threading.Lock()
    
    def select(self, **kwargs):
        """Select columns from table"""
        return self
    
    def groupby(self, *args):
        """Group by columns"""
        return GroupedTable(self)
    
    def filter(self, condition):
        """Filter rows"""
        return self
    
    def with_columns(self, **kwargs):
        """Add computed columns"""
        table = Table()
        with self._lock:
            table.data = self.data.copy()
        return table
    
    def append(self, record: Dict[str, Any]):
        """Append a record to the table"""
        with self._lock:
            self.data.append(record.copy())


class GroupedTable:
    """Mock grouped table for aggregations"""
    def __init__(self, table: Table):
        self.table = table
    
    def reduce(self, **kwargs):
        """Perform aggregations"""
        return self.table


class ConnectorSubject:
    """Mock connector for streaming input"""
    def __init__(self):
        self.table = Table()
        self._lock = threading.Lock()
    
    def next(self, **record):
        """Ingest a new record"""
        with self._lock:
            self.table.append(record)
    
    def get_table(self):
        """Get the streaming table"""
        return self.table


class Reducers:
    """Mock reducer functions"""
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


class Apply:
    """Mock apply function for row-wise transformations"""
    @staticmethod
    def with_universes(**kwargs):
        """Apply function to table"""
        def decorator(func):
            return func
        return decorator


# Mock Pathway API
class PathwayMock:
    """Mock Pathway module"""
    
    class Schema:
        """Mock schema class"""
        pass
    
    reducers = Reducers()
    apply = Apply
    
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
                def ConnectorSubject(schema, **kwargs):
                    """Create a connector subject"""
                    return ConnectorSubject()
        return IO()


# Singleton instance
pw = PathwayMock()
