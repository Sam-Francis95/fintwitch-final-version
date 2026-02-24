"""
External Data Stream Generator for FinTwitch
=============================================
Generates continuous external financial signals that feed into the Pathway pipeline:
- Market sentiment indicators
- Economic signals
- Interest rate changes
- Inflation indicators
- Government scheme updates
- Random macroeconomic events

These streams demonstrate multi-source data ingestion and fusion.
"""

import asyncio
import random
import time
from datetime import datetime
from typing import Dict, Any, List
import json
from pathlib import Path


class ExternalDataStreamGenerator:
    """Generates continuous external financial data streams"""
    
    def __init__(self, stream_file: str = "data_streams/external_events.jsonl"):
        self.stream_file = Path(stream_file)
        self.stream_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Ensure file exists
        if not self.stream_file.exists():
            self.stream_file.write_text("")
        
        self.is_running = False
        
        # Market sentiment states
        self.market_sentiment = 0.5  # 0=bearish, 1=bullish
        self.volatility = 0.3
        
        # Economic indicators
        self.interest_rate = 6.5  # Percentage
        self.inflation_rate = 4.2  # Percentage
        
        # Event templates
        self.market_events = [
            {"type": "market_surge", "sentiment_change": 0.15, "description": "Stock market rally boosts investor confidence"},
            {"type": "market_dip", "sentiment_change": -0.15, "description": "Market correction triggers cautious spending"},
            {"type": "volatility_spike", "volatility_change": 0.1, "description": "Market volatility increases uncertainty"},
            {"type": "stability_return", "volatility_change": -0.1, "description": "Markets stabilize after period of uncertainty"}
        ]
        
        self.economic_events = [
            {"type": "rate_hike", "rate_change": 0.25, "description": "Central bank increases interest rates"},
            {"type": "rate_cut", "rate_change": -0.25, "description": "Central bank reduces interest rates to boost economy"},
            {"type": "inflation_rise", "inflation_change": 0.3, "description": "Inflation increases, raising cost of living"},
            {"type": "inflation_drop", "inflation_change": -0.3, "description": "Inflation eases, providing spending relief"}
        ]
        
        self.policy_events = [
            {"type": "subsidy_announced", "impact": "positive", "category": "groceries", "value": 0.1, 
             "description": "Government announces food subsidy program"},
            {"type": "tax_relief", "impact": "positive", "category": "income", "value": 0.15,
             "description": "Tax relief measures announced for middle class"},
            {"type": "price_hike", "impact": "negative", "category": "utilities", "value": -0.12,
             "description": "Utility prices increased due to supply constraints"},
            {"type": "fuel_subsidy", "impact": "positive", "category": "transportation", "value": 0.08,
             "description": "Fuel prices reduced through government subsidy"}
        ]
    
    def generate_market_signal(self) -> Dict[str, Any]:
        """Generate random market sentiment signal"""
        # Random walk for sentiment
        self.market_sentiment += random.uniform(-0.05, 0.05)
        self.market_sentiment = max(0.0, min(1.0, self.market_sentiment))
        
        # Occasional significant events
        if random.random() < 0.1:  # 10% chance
            event = random.choice(self.market_events)
            self.market_sentiment += event.get("sentiment_change", 0)
            self.market_sentiment = max(0.0, min(1.0, self.market_sentiment))
            
            if "volatility_change" in event:
                self.volatility += event["volatility_change"]
                self.volatility = max(0.0, min(1.0, self.volatility))
            
            return {
                "stream_type": "external_signal",
                "category": "market",
                "event_type": event["type"],
                "sentiment": round(self.market_sentiment, 3),
                "volatility": round(self.volatility, 3),
                "impact": "positive" if event.get("sentiment_change", 0) > 0 else "negative",
                "value": abs(event.get("sentiment_change", 0)),
                "description": event["description"],
                "timestamp": datetime.now().isoformat(),
                "id": f"market_{int(time.time() * 1000)}"
            }
        
        # Normal sentiment update
        sentiment_label = "bullish" if self.market_sentiment > 0.6 else "bearish" if self.market_sentiment < 0.4 else "neutral"
        return {
            "stream_type": "external_signal",
            "category": "market",
            "event_type": "sentiment_update",
            "sentiment": round(self.market_sentiment, 3),
            "volatility": round(self.volatility, 3),
            "impact": "neutral",
            "value": 0,
            "description": f"Market sentiment: {sentiment_label}",
            "timestamp": datetime.now().isoformat(),
            "id": f"market_{int(time.time() * 1000)}"
        }
    
    def generate_economic_signal(self) -> Dict[str, Any]:
        """Generate economic indicator signal"""
        event = random.choice(self.economic_events)
        
        if "rate_change" in event:
            self.interest_rate += event["rate_change"]
            self.interest_rate = max(0.0, min(15.0, self.interest_rate))
            
            return {
                "stream_type": "external_signal",
                "category": "economic",
                "event_type": event["type"],
                "interest_rate": round(self.interest_rate, 2),
                "impact": "positive" if event["rate_change"] < 0 else "negative",
                "value": abs(event["rate_change"]),
                "description": event["description"],
                "timestamp": datetime.now().isoformat(),
                "id": f"econ_{int(time.time() * 1000)}"
            }
        
        if "inflation_change" in event:
            self.inflation_rate += event["inflation_change"]
            self.inflation_rate = max(0.0, min(20.0, self.inflation_rate))
            
            return {
                "stream_type": "external_signal",
                "category": "economic",
                "event_type": event["type"],
                "inflation_rate": round(self.inflation_rate, 2),
                "impact": "positive" if event["inflation_change"] < 0 else "negative",
                "value": abs(event["inflation_change"]),
                "description": event["description"],
                "timestamp": datetime.now().isoformat(),
                "id": f"econ_{int(time.time() * 1000)}"
            }
    
    def generate_policy_signal(self) -> Dict[str, Any]:
        """Generate government policy/scheme signal"""
        event = random.choice(self.policy_events)
        
        return {
            "stream_type": "external_signal",
            "category": "policy",
            "event_type": event["type"],
            "affected_category": event.get("category", "general"),
            "impact": event["impact"],
            "value": event["value"],
            "description": event["description"],
            "timestamp": datetime.now().isoformat(),
            "id": f"policy_{int(time.time() * 1000)}"
        }
    
    def append_event(self, event: Dict[str, Any]):
        """Append event to JSONL stream file"""
        with open(self.stream_file, 'a') as f:
            f.write(json.dumps(event) + '\n')
    
    async def run_continuous_stream(self, interval_seconds: float = 15.0):
        """Run continuous data stream generation"""
        print(f"? Starting external data stream generator...")
        print(f"   Stream file: {self.stream_file}")
        print(f"   Interval: {interval_seconds}s")
        
        self.is_running = True
        event_count = 0
        
        try:
            while self.is_running:
                # Randomly select signal type
                signal_type = random.choices(
                    ['market', 'economic', 'policy'],
                    weights=[0.5, 0.3, 0.2]  # Market signals more frequent
                )[0]
                
                if signal_type == 'market':
                    event = self.generate_market_signal()
                elif signal_type == 'economic':
                    event = self.generate_economic_signal()
                else:
                    event = self.generate_policy_signal()
                
                # Append to stream
                self.append_event(event)
                event_count += 1
                
                print(f"  + [{event_count}] {event['category'].upper()}: {event['description'][:60]}...")
                
                # Wait for next event
                await asyncio.sleep(interval_seconds)
        
        except asyncio.CancelledError:
            print(f"? External data stream stopped. Total events generated: {event_count}")
            self.is_running = False
        except Exception as e:
            print(f"? Error in external stream: {e}")
            self.is_running = False
    
    def stop(self):
        """Stop the stream generator"""
        self.is_running = False


# Standalone runner for testing
if __name__ == "__main__":
    print("="*70)
    print("EXTERNAL DATA STREAM GENERATOR")
    print("="*70)
    
    generator = ExternalDataStreamGenerator()
    
    try:
        asyncio.run(generator.run_continuous_stream(interval_seconds=10.0))
    except KeyboardInterrupt:
        print("\n\n? Stream stopped by user")
        generator.stop()
