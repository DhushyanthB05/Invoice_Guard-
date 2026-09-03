def calculate_overall_risk(invoice_risk, payment_risk, anomaly_risk):
    # Weighted formula as per specifications
    overall = (invoice_risk * 0.30) + (payment_risk * 0.40) + (anomaly_risk * 0.30)
    
    level = "LOW"
    recommendation = "APPROVE"
    
    if overall > 60:
        level = "HIGH"
        recommendation = "ESCALATE"
    elif overall > 30:
        level = "MEDIUM"
        recommendation = "REVIEW"
        
    return {
        "score": int(overall),
        "level": level,
        "recommendation": recommendation
    }
