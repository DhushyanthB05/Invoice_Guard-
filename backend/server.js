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
        const { invoice_id, invoice_data } = req.body;
        
        // Forward directly to the new FastAPI ML engine
        const mlResponse = await axios.post(`${ML_URL}/analyze`, {
            invoice_id,
            invoice_data
        });
        
        const result = mlResponse.data;

        riskResults.push({
            id: riskResults.length + 1,
            invoice_id,
            risk_score: result.risk.risk_score,
            risk_level: result.risk.risk_level,
            recommendation: result.risk.recommendation,
            created_at: new Date()
        });

        res.json(result);
    } catch (err) {
        console.error(err?.response?.data || err.message);
        res.status(500).json({ error: 'Analysis failed', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
