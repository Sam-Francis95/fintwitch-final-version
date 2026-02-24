"""
Test External Data Stream Generator
=====================================
Quick test to verify external stream generation is working.
"""

import asyncio
from backend.external_data_stream import ExternalDataStreamGenerator
from pathlib import Path
import time

async def test_stream():
    print("="*70)
    print("TESTING EXTERNAL DATA STREAM GENERATOR")
    print("="*70)
    print()
    
    # Create generator
    generator = ExternalDataStreamGenerator()
    
    # Check if file exists
    stream_file = Path("data_streams/external_events.jsonl")
    print(f"Stream file: {stream_file}")
    print(f"Exists: {stream_file.exists()}")
    print()
    
    # Generate a few test events
    print("Generating test events...")
    print()
    
    for i in range(5):
        print(f"\n--- Event {i+1} ---")
        
        # Generate different types
        if i % 3 == 0:
            event = generator.generate_market_signal()
        elif i % 3 == 1:
            event = generator.generate_economic_signal()
        else:
            event = generator.generate_policy_signal()
        
        generator.append_event(event)
        
        print(f"Type: {event['category']}")
        print(f"Event: {event['event_type']}")
        print(f"Description: {event['description']}")
        print(f"Impact: {event.get('impact', 'N/A')}")
        print(f"Value: {event.get('value', 0)}")
        
        await asyncio.sleep(1)
    
    print()
    print("="*70)
    print("TEST COMPLETE")
    print("="*70)
    print()
    print(f"Check file: {stream_file.absolute()}")
    print(f"File size: {stream_file.stat().st_size if stream_file.exists() else 0} bytes")
    
    if stream_file.exists():
        with open(stream_file, 'r') as f:
            lines = f.readlines()
        print(f"Total events in file: {len(lines)}")
        print()
        print("✅ External stream generator is working!")
    else:
        print("❌ Stream file not created")

if __name__ == "__main__":
    asyncio.run(test_stream())
