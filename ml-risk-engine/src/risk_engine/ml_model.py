import numpy as np
from sklearn.ensemble import IsolationForest
import shap

class TransactionAnomalyDetector:
    def __init__(self):
        # Transaction anomaly detection using Isolation Forest
        self.model = IsolationForest(contamination=0.1, random_state=42)
        
        # Simulated training data [amount, avg_payment_delay]
        self.X_train = np.array([
            [50000, 2], [60000, 3], [48000, 1], [55000, 4], 
            [52000, 2], [58000, 5], [1500000, 45], [49000, 1]
        ])
        
        self.model.fit(self.X_train)
        
        # Initialize SHAP explainer for IsolationForest (using TreeExplainer)
        self.explainer = shap.TreeExplainer(self.model)
        
    def predict(self, invoice_amount, avg_delay):
        X_test = np.array([[invoice_amount, avg_delay]])
        prediction = self.model.predict(X_test)
        
        # -1 means anomaly, 1 means normal
        is_anomaly = prediction[0] == -1
        
        # Calculate SHAP values for explainability
        shap_values = self.explainer.shap_values(X_test)
        feature_importance = shap_values[0] # Importance of [amount, delay]
        
        risk_score = 90 if is_anomaly else 15
        factor = None
        
        if is_anomaly:
            if abs(feature_importance[0]) > abs(feature_importance[1]):
                factor = "Transaction amount is statistically unusual (SHAP explanation)."
            else:
                factor = "Payment delay pattern is statistically anomalous (SHAP explanation)."
        
        return {"risk": risk_score, "factor": factor, "is_anomaly": is_anomaly}

anomaly_detector = TransactionAnomalyDetector()
