# 🛡️ InvoiceGuard AI
**Agentic AI-Powered Risk Assessment for Supply Chain Finance**

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Python](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![NodeJS](https://img.shields.io/badge/Proxy-Node.js-339933?logo=nodedotjs)
![MachineLearning](https://img.shields.io/badge/AI-Scikit--Learn-F7931E?logo=scikitlearn)

> **Built for Innovation Unbound 2026**  
> **Theme Connection:** *Preventing Financial Distress Before It Becomes a Crisis*

## 📖 The Problem
Traditional invoice financing (factoring/discounting) is broken. Financiers rely on static credit scores and manual document verification. This leads to slow approval times, high vulnerability to fraud, and an inability to properly assess the risk of MSME suppliers who lack formal credit histories.

Most importantly, when an Anchor Buyer pays late, it triggers a cascading cash-flow crisis down the entire supply chain.

## 💡 The Solution
**InvoiceGuard AI** is a next-generation decision support system for underwriters. It replaces generic credit scoring with an **Autonomous Multi-Agent Risk Engine** that analyzes the *current invoice* alongside the *historical payment behavior* of the buyer at the transaction level. 

By acting as an early-warning radar, we prevent financiers from absorbing toxic debt and stabilize the MSME ecosystem before a delayed payment cascades into a financial crisis.

---

## ✨ Core Features

### 1. The Multi-Agent Swarm Architecture 🤖
InvoiceGuard utilizes a simulated swarm of specialized AI agents working sequentially:
*   **Extraction Agent:** Parses the uploaded invoice payload.
*   **KYC Agent:** Validates Counterparty IDs against registries.
*   **ML Risk Swarm:** Executes mathematical outlier detection.
*   **Policy Agent:** Applies human-in-the-loop routing guardrails.

### 2. Machine Learning Anomaly Detection 🧠
Powered by a Python FastAPI backend, the system runs a **Scikit-Learn Isolation Forest** model in real-time. It analyzes the incoming invoice against the buyer's historical averages to instantly catch fraudulent amounts, abnormal volumes, and duplicate submissions.

### 3. SHAP Explainability (White-Box AI) 📊
InvoiceGuard implements **SHAP** principles to explain exactly *why* a score was generated (e.g., *"Invoice amount is 400% higher than historical average"*), ensuring full regulatory compliance and underwriter trust.

### 4. Generative AI Auto-Draft Communications ✨
When an invoice is flagged for review, the system uses an LLM to automatically draft a polite, highly-contextualized email to the supplier, injecting the specific mathematical reasons for the delay to save underwriters hours of manual communication.

### 5. Enterprise-Grade Dashboard & PDF Exports 📄
A stunning, responsive React frontend featuring:
*   Live Redux-powered Smart Queue with batch processing capabilities.
*   Interactive Counterparty Trust Score matrices.
*   Zero-dependency, native high-resolution **PDF Report Export** for audit trails.
*   A fully interactive floating AI Copilot widget.

---

## 🚀 How to Run Locally

### 1. Start the Machine Learning Engine (Python)
```bash
cd ml-risk-engine
pip install -r requirements.txt
python -m uvicorn src.api.main:app --reload --port 8000
```

### 2. Start the Backend API Proxy (Node.js)
```bash
cd backend
npm install
node server.js
```

### 3. Start the Frontend Application (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to view the application!
