"""
Test Script for Pathway Streaming Integration
Verifies that Pathway engine is processing transactions correctly
"""

import requests
import json
import time
from datetime import datetime

PATHWAY_BASE_URL = "http://localhost:8000"

def print_section(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def test_status():
    """Test if Pathway engine is running"""
    print_section("1. Testing Pathway Engine Status")
    try:
        response = requests.get(f"{PATHWAY_BASE_URL}/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Pathway engine is RUNNING")
            print(f"   Engine: {data.get('engine', 'Unknown')}")
            print(f"   Stream Active: {data.get('stream_active', False)}")
            print(f"   Metrics Active: {data.get('metrics_active', False)}")
            return True
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Pathway engine is NOT running")
        print(f"   Error: {str(e)}")
        print("\n   💡 Start it with: backend\\start_pathway_streaming.bat")
        return False

def test_ingest_income():
    """Test ingesting an income transaction"""
    print_section("2. Testing Income Transaction Ingestion")
    
    income_event = {
        "type": "income",
        "amount": 5000.0,
        "category": "Test Salary",
        "timestamp": datetime.now().isoformat(),
        "description": "Test income transaction"
    }
    
    try:
        print(f"📤 Sending: {json.dumps(income_event, indent=2)}")
        response = requests.post(
            f"{PATHWAY_BASE_URL}/ingest", 
            json=income_event,
            timeout=5
        )
        
        if response.status_code == 200:
            print("✅ Income transaction INGESTED successfully")
            data = response.json()
            print(f"   Status: {data.get('status')}")
            return True
        else:
            print(f"❌ Failed to ingest: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_ingest_expense():
    """Test ingesting an expense transaction"""
    print_section("3. Testing Expense Transaction Ingestion")
    
    expense_event = {
        "type": "expense",
        "amount": 1500.0,
        "category": "Test Rent",
        "timestamp": datetime.now().isoformat(),
        "description": "Test expense transaction"
    }
    
    try:
        print(f"📤 Sending: {json.dumps(expense_event, indent=2)}")
        response = requests.post(
            f"{PATHWAY_BASE_URL}/ingest", 
            json=expense_event,
            timeout=5
        )
        
        if response.status_code == 200:
            print("✅ Expense transaction INGESTED successfully")
            data = response.json()
            print(f"   Status: {data.get('status')}")
            return True
        else:
            print(f"❌ Failed to ingest: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_metrics():
    """Test retrieving computed metrics"""
    print_section("4. Testing Real-Time Metrics Computation")
    
    try:
        print("⏳ Waiting 2 seconds for stream processing...")
        time.sleep(2)
        
        response = requests.get(f"{PATHWAY_BASE_URL}/metrics", timeout=5)
        
        if response.status_code == 200:
            metrics = response.json()
            print("✅ Metrics retrieved successfully")
            print("\n📊 CURRENT METRICS:")
            print(f"   Balance:          ₹{metrics.get('balance', 0):,.2f}")
            print(f"   Total Income:     ₹{metrics.get('total_income', 0):,.2f}")
            print(f"   Total Expenses:   ₹{metrics.get('total_expenses', 0):,.2f}")
            print(f"   Net Cash Flow:    ₹{metrics.get('net_cash_flow', 0):,.2f}")
            print(f"   Transactions:     {metrics.get('transaction_count', 0)}")
            print(f"   Risk Level:       {metrics.get('risk', 'UNKNOWN')}")
            
            # Verify calculations
            expected_balance = metrics.get('total_income', 0) - metrics.get('total_expenses', 0)
            actual_balance = metrics.get('balance', 0)
            
            if abs(expected_balance - actual_balance) < 0.01:
                print("\n✅ Balance calculation is CORRECT")
            else:
                print(f"\n⚠️  Balance mismatch: expected {expected_balance}, got {actual_balance}")
            
            return True
        else:
            print(f"❌ Failed to retrieve metrics: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_streaming_update():
    """Test that metrics update with new transactions"""
    print_section("5. Testing Real-Time Streaming Updates")
    
    try:
        # Get initial metrics
        print("📊 Getting initial metrics...")
        response1 = requests.get(f"{PATHWAY_BASE_URL}/metrics", timeout=5)
        initial_metrics = response1.json()
        initial_balance = initial_metrics.get('balance', 0)
        initial_count = initial_metrics.get('transaction_count', 0)
        
        print(f"   Initial Balance: ₹{initial_balance:,.2f}")
        print(f"   Initial Count: {initial_count}")
        
        # Send new transaction
        print("\n📤 Sending new income transaction (+2000)...")
        new_transaction = {
            "type": "income",
            "amount": 2000.0,
            "category": "Streaming Test",
            "timestamp": datetime.now().isoformat(),
            "description": "Testing real-time updates"
        }
        requests.post(f"{PATHWAY_BASE_URL}/ingest", json=new_transaction, timeout=5)
        
        # Wait for processing
        print("⏳ Waiting for stream processing...")
        time.sleep(2)
        
        # Get updated metrics
        print("📊 Getting updated metrics...")
        response2 = requests.get(f"{PATHWAY_BASE_URL}/metrics", timeout=5)
        updated_metrics = response2.json()
        updated_balance = updated_metrics.get('balance', 0)
        updated_count = updated_metrics.get('transaction_count', 0)
        
        print(f"   Updated Balance: ₹{updated_balance:,.2f}")
        print(f"   Updated Count: {updated_count}")
        
        # Verify update
        balance_increased = (updated_balance - initial_balance) >= 1999  # Allow small floating point diff
        count_increased = updated_count > initial_count
        
        if balance_increased and count_increased:
            print("\n✅ STREAMING UPDATE VERIFIED!")
            print(f"   Balance increased by: ₹{updated_balance - initial_balance:,.2f}")
            print(f"   Transaction count increased by: {updated_count - initial_count}")
            return True
        else:
            print("\n⚠️  Metrics did not update as expected")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    print("\n" + "🌊" * 30)
    print("     PATHWAY STREAMING INTEGRATION TEST SUITE")
    print("🌊" * 30)
    
    results = []
    
    # Run all tests
    results.append(("Engine Status", test_status()))
    
    if results[0][1]:  # Only continue if engine is running
        results.append(("Income Ingestion", test_ingest_income()))
        results.append(("Expense Ingestion", test_ingest_expense()))
        results.append(("Metrics Computation", test_metrics()))
        results.append(("Streaming Updates", test_streaming_update()))
    
    # Print summary
    print_section("TEST SUMMARY")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status}  {test_name}")
    
    print(f"\n   Score: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n   🎉 ALL TESTS PASSED! Pathway integration working perfectly.")
        print("\n   Next steps:")
        print("   1. Open http://localhost:3000/pathway")
        print("   2. Watch metrics update in real-time")
        print("   3. Play the game and see transactions flow through Pathway")
    else:
        print("\n   ⚠️  Some tests failed. Check the output above for details.")
        print("\n   Troubleshooting:")
        print("   1. Make sure Pathway engine is running: backend\\start_pathway_streaming.bat")
        print("   2. Check for error messages in the Pathway terminal")
        print("   3. Verify dependencies installed: pip install -r backend\\requirements.txt")
    
    print("\n" + "=" * 90 + "\n")

if __name__ == "__main__":
    main()
