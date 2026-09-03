def analyze_buyer_payment(buyer_id):
    factors = []
    score = 0
    
    # Mocking historical buyer delay metrics
    if buyer_id.endswith("001"):
        factors.append("Buyer has a strong history of on-time payments.")
        score = 10
        avg_delay = 2
    elif buyer_id.endswith("002"):
        factors.append("Buyer has a history of delayed payments.")
        score = 50
        avg_delay = 18
    else:
        factors.append("Recent payment delays are increasing.")
        score = 85
        avg_delay = 45
        
    return {"risk": score, "factors": factors, "avg_delay": avg_delay}
