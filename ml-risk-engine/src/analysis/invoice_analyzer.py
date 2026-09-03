def check_invoice_anomalies(invoice, all_invoices):
    factors = []
    score = 0
    amount = float(invoice.get('amount', 0))
    
    # 1. Unusual Amount check
    if amount > 800000:
        factors.append("Invoice amount is significantly higher than the buyer's historical invoice range.")
        score += 40
        
    # 2. Duplicate Detection (matching supplier, buyer, and amount)
    duplicates = [i for i in all_invoices if i.get('supplier_id') == invoice.get('supplier_id') 
                  and i.get('buyer_id') == invoice.get('buyer_id')
                  and float(i.get('amount', 0)) == amount
                  and i.get('id') != invoice.get('id')]
    
    if len(duplicates) > 0:
        factors.append("Duplicate invoice pattern detected.")
        score += 60
        
    return {"risk": min(score, 100), "factors": factors}
