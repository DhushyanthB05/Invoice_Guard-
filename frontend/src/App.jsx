import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { AlertTriangle, CheckCircle, Info, UploadCloud, ShieldAlert, FileText, Activity } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/invoices`)
      .then(res => setInvoices(res.data))
      .catch(err => setError("Failed to load demo invoices. Is the backend running?"));
  }, []);

  const handleAnalyze = async () => {
    if (!selectedInvoiceId) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await axios.post(`${API_BASE}/analyze`, { invoice_id: selectedInvoiceId });
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Ensure Python ML service is running.");
    } finally {
      setLoading(false);
    }
  };

  const renderGauge = (score) => {
    let color = score > 60 ? '#ef4444' : score > 30 ? '#f59e0b' : '#10b981';
    return (
      <div className="w-48 h-48 mx-auto relative">
        <Doughnut 
          data={{
            labels: ['Risk', 'Safe'],
            datasets: [{
              data: [score, 100 - score],
              backgroundColor: [color, '#e5e7eb'],
              borderWidth: 0,
              circumference: 180,
              rotation: 270,
            }]
          }}
          options={{
            cutout: '80%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-4xl font-bold" style={{color}}>{score}</span>
          <span className="text-sm text-gray-500">/ 100</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold tracking-wide">InvoiceGuard <span className="text-blue-400">AI</span></h1>
          </div>
          <p className="text-sm text-slate-300 hidden md:block">AI-Powered Invoice & Payment Risk Intelligence</p>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Selection Area */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600"/> Select Demo Invoice</h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select 
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
            >
              <option value="">-- Choose a synthetic invoice --</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} - ₹{parseFloat(inv.amount).toLocaleString()} ({inv.scenario})
                </option>
              ))}
            </select>
            <button 
              onClick={handleAnalyze}
              disabled={loading || !selectedInvoiceId}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Activity className="w-5 h-5 animate-spin mr-2" /> : <UploadCloud className="w-5 h-5 mr-2" />}
              {loading ? 'Analyzing...' : 'Analyze Risk'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Report Area */}
        {report && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className={`p-6 text-white ${report.risk.risk_level === 'HIGH' ? 'bg-red-600' : report.risk.risk_level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-600'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Risk Assessment Report</h2>
                  <p className="opacity-90">Invoice: {report.invoice.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm uppercase tracking-wider opacity-90 mb-1">Recommendation</div>
                  <div className="text-3xl font-bold bg-white/20 px-4 py-1 rounded-md inline-block">
                    {report.risk.recommendation}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column - Score & Components */}
              <div className="md:col-span-1 border-r border-gray-100 pr-0 md:pr-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Risk Score</h3>
                  {renderGauge(report.risk.risk_score)}
                  <div className={`text-xl font-bold mt-2 ${report.risk.risk_level === 'HIGH' ? 'text-red-600' : report.risk.risk_level === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {report.risk.risk_level} RISK
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase">Risk Breakdown</h4>
                  {[
                    { label: 'Invoice Anomaly', val: report.risk.components.invoice_risk },
                    { label: 'Payment Behavior', val: report.risk.components.payment_risk },
                    { label: 'Transaction / Dup', val: report.risk.components.transaction_risk }
                  ].map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{c.label}</span>
                        <span className="font-medium">{c.val}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${c.val > 60 ? 'bg-red-500' : c.val > 30 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: \`\${c.val}%\` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="md:col-span-2 space-y-8">
                
                {/* Key Factors */}
                <section>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">Key Risk Factors (Explainability)</h3>
                  <div className="space-y-3">
                    {report.risk.risk_factors.map((factor, idx) => (
                      <div key={idx} className="flex items-start bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {report.risk.risk_level === 'LOW' ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-slate-700 font-medium">{factor}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Details Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Invoice Details</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="text-gray-500 w-24 inline-block">Amount:</span> <span className="font-semibold text-slate-900">₹{parseFloat(report.invoice.amount).toLocaleString()}</span></li>
                      <li><span className="text-gray-500 w-24 inline-block">Date:</span> <span className="text-slate-900">{report.invoice.date}</span></li>
                      <li><span className="text-gray-500 w-24 inline-block">Due Date:</span> <span className="text-slate-900">{report.invoice.due_date}</span></li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Parties Involved</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="text-gray-500 w-24 inline-block">Buyer:</span> <span className="font-semibold text-slate-900">{report.buyer.name}</span></li>
                      <li><span className="text-gray-500 w-24 inline-block">Avg Amount:</span> <span className="text-slate-900">₹{parseFloat(report.buyer.avg_amount).toLocaleString()}</span></li>
                      <li><span className="text-gray-500 w-24 inline-block">Supplier:</span> <span className="text-slate-900">{report.supplier.name}</span></li>
                    </ul>
                  </div>
                </section>

                {/* Payment History Visual */}
                <section>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">Historical Payment Behavior</h3>
                  <div className="bg-white p-4 border border-gray-100 rounded-lg">
                    <div className="h-48">
                      <Bar 
                        data={{
                          labels: ['Previous Invoices', 'Delayed Payments'],
                          datasets: [{
                            label: 'Count',
                            data: [report.buyer.total_count, report.buyer.delayed_count],
                            backgroundColor: ['#3b82f6', '#ef4444'],
                            borderRadius: 4
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { y: { beginAtZero: true } }
                        }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Buyer has an average payment delay of <strong className="text-slate-700">{report.buyer.avg_delay} days</strong>.
                    </p>
                  </div>
                </section>

              </div>
            </div>
            
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-200">
              <Info className="w-4 h-4 inline mr-1" />
              Final financing decision remains with the financier. This is synthetic demonstration data.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
