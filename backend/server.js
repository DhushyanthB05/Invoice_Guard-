const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ML_URL = process.env.ML_URL || 'http://localhost:8000';

// In-memory store for MVP
const riskResults = [];

// Helper for CSV demo data
function parseCSV(filepath) {
    const lines = fs.readFileSync(path.join(__dirname, filepath), 'utf-8').trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
        return obj;
    });
}

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/invoices', (req, res) => {
    try {
        const invoices = parseCSV('../sample-data/invoices.csv');
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/analyze', async (req, res) => {
    try {
        const { invoice_id } = req.body;
        
        const invoices = parseCSV('../sample-data/invoices.csv');
        const invoice = invoices.find(i => i.id === invoice_id);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

        const buyers = parseCSV('../sample-data/buyers.csv');
        const buyer = buyers.find(b => b.id === invoice.buyer_id);

        const suppliers = parseCSV('../sample-data/suppliers.csv');
        const supplier = suppliers.find(s => s.id === invoice.supplier_id);

        const payload = {
            invoice_id: invoice.id,
            supplier_id: invoice.supplier_id,
            buyer_id: invoice.buyer_id,
            invoice_amount: parseFloat(invoice.amount),
            invoice_date: invoice.date,
            average_invoice_amount: parseFloat(buyer.avg_amount || 0),
            average_payment_delay: parseFloat(buyer.avg_delay || 0),
            previous_delayed_payments: parseInt(buyer.delayed_count || 0),
            total_previous_invoices: parseInt(buyer.total_count || 0),
            is_duplicate: invoice.is_duplicate === 'True'
        };

        const mlResponse = await axios.post(`${ML_URL}/predict-risk`, payload);
        const result = mlResponse.data;

        riskResults.push({
            id: riskResults.length + 1,
            invoice_id,
            risk_score: result.risk_score,
            risk_level: result.risk_level,
            risk_factors: result.risk_factors,
            recommendation: result.recommendation,
            created_at: new Date()
        });

        res.json({
            invoice,
            buyer,
            supplier,
            risk: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Analysis failed', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
