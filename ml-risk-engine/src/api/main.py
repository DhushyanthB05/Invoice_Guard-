from fastapi import FastAPI, HTTPException
import json
import os

from src.data.schemas import AnalyzeRequest
from src.analysis.invoice_analyzer import check_invoice_anomalies
from src.analysis.payment_analyzer import analyze_buyer_payment
from src.risk_engine.ml_model import anomaly_detector
from src.risk_engine.scoring import calculate_overall_risk

app = FastAPI(title="InvoiceGuard AI - ML Engine")

# Load synthetic data
DATA_FILE = "../sample-data/invoices.csv"

def load_data():
    invoices = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            lines = f.readlines()
            headers = lines[0].strip().split(",")
            for line in lines[1:]:
                values = line.strip().split(",")
                invoices.append(dict(zip(headers, values)))
    return invoices

@app.post("/analyze")
def analyze_invoice(request: AnalyzeRequest):
    invoices = load_data()
    
    # 1. Support real-time dynamic uploads or lookup from CSV
    target_invoice = None
    if request.invoice_data:
        target_invoice = request.invoice_data
        invoices.append(target_invoice) # Add to context for duplicate checking
    else:
        target_invoice = next((i for i in invoices if i['id'] == request.invoice_id), None)
        
    if not target_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    # 2. Stage: Invoice Analysis (Rule-based)
    inv_analysis = check_invoice_anomalies(target_invoice, invoices)
    
    # 3. Stage: Payment History Analysis (Rule-based)
    pay_analysis = analyze_buyer_payment(target_invoice['buyer_id'])
    
    # 4. Stage: Risk Engine - Transaction Anomaly (Machine Learning via Scikit-Learn & SHAP)
    amount = float(target_invoice.get('amount', 0))
    ml_analysis = anomaly_detector.predict(amount, pay_analysis['avg_delay'])
    
    # 5. Stage: Aggregate Risk Score
    final_risk = calculate_overall_risk(
        invoice_risk=inv_analysis['risk'],
        payment_risk=pay_analysis['risk'],
        anomaly_risk=ml_analysis['risk']
    )
    
    # Collect all explainable risk factors
    factors = inv_analysis['factors'] + pay_analysis['factors']
    if ml_analysis['factor']:
        factors.append(ml_analysis['factor'])
        
    # If no risk factors detected, add a baseline positive factor
    if not factors:
        factors.append("No significant anomalies detected in transaction or payment history.")
        
    return {
        "invoice": target_invoice,
        "supplier": {"name": target_invoice['supplier_id']},
        "buyer": {
            "name": target_invoice['buyer_id'],
            "avg_amount": amount * 0.9,
            "avg_delay": pay_analysis['avg_delay'],
            "delayed_count": 5 if pay_analysis['avg_delay'] > 10 else 1,
            "total_count": 24
        },
        "risk": {
            "risk_score": final_risk['score'],
            "risk_level": final_risk['level'],
            "recommendation": final_risk['recommendation'],
            "risk_factors": factors,
            "components": {
                "invoice_risk": inv_analysis['risk'],
                "payment_risk": pay_analysis['risk'],
                "transaction_risk": ml_analysis['risk']
            }
        }
    }
