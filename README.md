# InvoiceGuard AI 🛡️

**AI-Powered Invoice & Payment Risk Intelligence for Safer Supply-Chain Financing**

Built for **Innovation Unbound 2026 — VIT Chennai** by team **NeuralNexus**.

## 📖 Problem
Supply-chain financing requires reliable risk assessment. Hidden transaction-level risks (such as unusual invoice amounts, shifting payment delays, or duplicate invoices) are difficult to identify early. 

## 💡 Solution
InvoiceGuard AI acts as a decision support system. It combines invoice-level anomaly detection with historical buyer payment behavior to produce an explainable financing-risk assessment. 

**Note: The AI supports the financier; it does not replace the human decision.**

## ✨ Features
- **Explainable Risk Score (0-100)**: Transparent components (Invoice, Payment, Transaction).
- **Anomaly Detection**: Identifies unusually high invoices based on buyer history.
- **Duplicate Detection**: Flags potential double-financing attempts.
- **Payment Behavior Analysis**: Tracks average delays and late payment frequencies.
- **Interactive Dashboard**: Professional FinTech UI with visualizations.

## 🏗️ Architecture & Technology Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js
- **AI/ML Risk Engine**: Python, FastAPI
- **Database**: SQLite (Zero-setup MVP fallback for PostgreSQL)

## 📁 Project Structure
- `/frontend`: React dashboard
- `/backend`: Node.js Express API
- `/ml-risk-engine`: Python FastAPI Risk Engine
- `/sample-data`: Synthetic demonstration datasets

## ⚙️ How It Works (Risk Score Methodology)
1. **Invoice Risk (30%)**: Checks if the invoice amount significantly deviates from the buyer's historical average.
2. **Payment Risk (40%)**: Assesses the frequency and severity of past delayed payments.
3. **Transaction Risk (30%)**: Flags identical or highly similar invoices (duplicate patterns).

Scores map to Recommendations:
- `0-30`: **LOW** (APPROVE)
- `31-60`: **MEDIUM** (REVIEW)
- `61-100`: **HIGH** (ESCALATE)

## 📊 Dataset Disclaimer
**All included datasets are synthetic and intended for demonstration purposes only.** We do not use real, confidential banking data.

## 🚀 Installation & Running the Application

### 1. ML Risk Engine (Python)
\`\`\`bash
cd ml-risk-engine
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
\`\`\`

### 2. Backend (Node.js)
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`
*(Runs on port 5000 by default)*

### 3. Frontend (React)
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(Runs on port 5173)*

## 🧪 Demo Scenarios (Available in the UI)
1. **LOW RISK**: Normal invoice, good buyer. (Expect: APPROVE)
2. **HIGH AMOUNT**: Unusually large invoice amount. (Expect: REVIEW/ESCALATE)
3. **DUPLICATE**: Potential double-financing attempt. (Expect: ESCALATE)
4. **PAYMENT DELAYS**: Buyer has repeated late payments. (Expect: REVIEW)
5. **MULTIPLE RISKS**: High amount + delayed payments + duplicate. (Expect: ESCALATE)

## 🔮 Future Scope
- Integration with GST/E-Invoicing APIs.
- Account Aggregator (AA) framework for real-time bank statement analysis.
- External credit bureau data integration.

---
*Created by NeuralNexus for Innovation Unbound 2026*
