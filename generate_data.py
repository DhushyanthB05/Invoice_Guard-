import csv
import os

os.makedirs('sample-data', exist_ok=True)

buyers = [
    {"id": "B001", "name": "Alpha Retail", "avg_amount": 50000, "avg_delay": 2, "delayed_count": 1, "total_count": 20},
    {"id": "B002", "name": "Beta Electronics", "avg_amount": 100000, "avg_delay": 5, "delayed_count": 2, "total_count": 15},
    {"id": "B003", "name": "Gamma Trading", "avg_amount": 75000, "avg_delay": 45, "delayed_count": 8, "total_count": 10},
]

suppliers = [
    {"id": "S001", "name": "Tech Corp"},
    {"id": "S002", "name": "Global Supplies"},
]

invoices = [
    {"id": "INV-001", "supplier_id": "S001", "buyer_id": "B001", "amount": 52000, "date": "2026-09-01", "due_date": "2026-10-01", "is_duplicate": False, "scenario": "LOW RISK"},
    {"id": "INV-002", "supplier_id": "S001", "buyer_id": "B002", "amount": 250000, "date": "2026-09-02", "due_date": "2026-10-02", "is_duplicate": False, "scenario": "HIGH AMOUNT"},
    {"id": "INV-003", "supplier_id": "S002", "buyer_id": "B001", "amount": 50000, "date": "2026-09-03", "due_date": "2026-10-03", "is_duplicate": True, "scenario": "DUPLICATE"},
    {"id": "INV-004", "supplier_id": "S002", "buyer_id": "B003", "amount": 76000, "date": "2026-09-04", "due_date": "2026-10-04", "is_duplicate": False, "scenario": "PAYMENT DELAYS"},
    {"id": "INV-005", "supplier_id": "S001", "buyer_id": "B003", "amount": 200000, "date": "2026-09-05", "due_date": "2026-10-05", "is_duplicate": True, "scenario": "MULTIPLE RISKS"},
]

def write_csv(filename, data, fieldnames):
    with open(f'sample-data/{filename}', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

write_csv('buyers.csv', buyers, ["id", "name", "avg_amount", "avg_delay", "delayed_count", "total_count"])
write_csv('suppliers.csv', suppliers, ["id", "name"])
write_csv('invoices.csv', invoices, ["id", "supplier_id", "buyer_id", "amount", "date", "due_date", "is_duplicate", "scenario"])

print("Generated synthetic dataset successfully in sample-data/")
