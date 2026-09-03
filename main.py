from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="InvoiceGuard AI Risk Engine")

class InvoiceData(BaseModel):
    invoice_id: str
    supplier_id: str
    buyer_id: str
    invoice_amount: float
    invoice_date: str
    average_invoice_amount: float
    average_payment_delay: float
    previous_delayed_payments: int
    total_previous_invoices: int
    is_duplicate: bool

@app.post("/predict-risk")
def predict_risk(data: InvoiceData):
    # 1. Invoice Anomaly Risk (0-100)
    # If amount is > 2x average, high risk
    amount_ratio = data.invoice_amount / data.average_invoice_amount if data.average_invoice_amount > 0 else 1
    invoice_risk = min(100, max(0, (amount_ratio - 1) * 30))

    # 2. Payment Behavior Risk (0-100)
    delay_ratio = data.previous_delayed_payments / data.total_previous_invoices if data.total_previous_invoices > 0 else 0
    payment_risk = min(100, max(0, delay_ratio * 100 + (data.average_payment_delay / 10)))

    # 3. Transaction/Duplicate Risk (0-100)
    transaction_risk = 100 if data.is_duplicate else 0

    # Overall Score
    overall_score = int(0.3 * invoice_risk + 0.4 * payment_risk + 0.3 * transaction_risk)

    # Level
    if overall_score <= 30:
        level = "LOW"
        rec = "APPROVE"
    elif overall_score <= 60:
        level = "MEDIUM"
        rec = "REVIEW"
    else:
        level = "HIGH"
        rec = "ESCALATE"

    # Factors
    factors = []
    if amount_ratio > 1.5:
        factors.append(f"Invoice amount is {amount_ratio:.1f}x the buyer's historical average.")
    if delay_ratio > 0.3:
        factors.append(f"Buyer delayed {data.previous_delayed_payments} of the previous {data.total_previous_invoices} invoices.")
    if data.is_duplicate:
        factors.append("Duplicate invoice pattern detected.")
    if data.average_payment_delay > 15:
        factors.append(f"Average payment delay is {data.average_payment_delay} days.")

    if not factors and level == "LOW":
        factors.append("All metrics are within normal ranges.")

    return {
        "risk_score": overall_score,
        "risk_level": level,
        "risk_factors": factors,
        "recommendation": rec,
        "components": {
            "invoice_risk": int(invoice_risk),
            "payment_risk": int(payment_risk),
            "transaction_risk": int(transaction_risk)
        }
    }

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
