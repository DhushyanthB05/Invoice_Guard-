import csv
import random
from datetime import datetime, timedelta

buyers = [
    {"id": "B-001", "name": "Tata Motors", "avg_amount": 1500000, "avg_delay": 5, "delayed_count": 2, "total_count": 50},
    {"id": "B-002", "name": "Reliance Retail", "avg_amount": 500000, "avg_delay": 2, "delayed_count": 1, "total_count": 120},
    {"id": "B-003", "name": "Larsen & Toubro", "avg_amount": 2500000, "avg_delay": 15, "delayed_count": 12, "total_count": 80},
    {"id": "B-004", "name": "Hindustan Unilever", "avg_amount": 300000, "avg_delay": 1, "delayed_count": 0, "total_count": 200},
    {"id": "B-005", "name": "Mahindra & Mahindra", "avg_amount": 800000, "avg_delay": 8, "delayed_count": 4, "total_count": 60},
    {"id": "B-006", "name": "Infosys Technologies", "avg_amount": 120000, "avg_delay": 3, "delayed_count": 1, "total_count": 40},
    {"id": "B-007", "name": "Wipro Enterprises", "avg_amount": 400000, "avg_delay": 28, "delayed_count": 15, "total_count": 90},
    {"id": "B-008", "name": "Adani Ports", "avg_amount": 3500000, "avg_delay": 12, "delayed_count": 5, "total_count": 45},
    {"id": "B-009", "name": "Maruti Suzuki", "avg_amount": 2000000, "avg_delay": 4, "delayed_count": 2, "total_count": 110},
    {"id": "B-010", "name": "Asian Paints", "avg_amount": 250000, "avg_delay": 2, "delayed_count": 1, "total_count": 150},
]

# Specifically naming some realistic local suppliers for the UI demo
supplier_names = [
    "Sri Balaji Auto Parts", "Chennai Steel Works", "Kaveri Logistics Pvt Ltd",
    "Madras Packaging", "Vanguard Electronics", "Delta Precision Machining",
    "TechNova Solutions", "Apex Raw Materials", "Global Exim Traders", "Southern Spares MSME"
]
suppliers = [{"id": f"S-{101+i}", "name": supplier_names[i], "category": "MSME"} for i in range(10)]

# Write buyers.csv
with open("buyers.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "name", "avg_amount", "avg_delay", "delayed_count", "total_count"])
    writer.writeheader()
    writer.writerows(buyers)

# Write suppliers.csv
with open("suppliers.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "name", "category"])
    writer.writeheader()
    writer.writerows(suppliers)

# Generate 50 realistic Invoices
invoices = []
for i in range(1, 51):
    buyer = random.choice(buyers)
    supplier = random.choice(suppliers)
    
    # 15% chance of being an anomaly (amount way higher than buyer avg)
    is_anomaly = random.random() < 0.15
    amount = int(buyer["avg_amount"] * (random.uniform(2.5, 6.0) if is_anomaly else random.uniform(0.5, 1.5)))
    
    # 5% chance of duplicate
    is_duplicate = random.random() < 0.05
    
    date_obj = datetime.now() - timedelta(days=random.randint(1, 60))
    
    invoices.append({
        "id": f"INV-2026-{i:04d}",
        "supplier_id": supplier["id"],
        "buyer_id": buyer["id"],
        "amount": amount,
        "date": date_obj.strftime("%Y-%m-%d"),
        "due_date": (date_obj + timedelta(days=30)).strftime("%Y-%m-%d"),
        "scenario": "Historical Record",
        "is_duplicate": is_duplicate
    })

with open("invoices.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "supplier_id", "buyer_id", "amount", "date", "due_date", "scenario", "is_duplicate"])
    writer.writeheader()
    writer.writerows(invoices)

print("Massive dataset generated successfully!")
