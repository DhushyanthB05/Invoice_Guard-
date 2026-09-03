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
              backgroundColor: [color, '#334155'], // Dark background for the remaining part
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
          <span className="text-sm text-slate-400">/ 100</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <nav className="bg-slate-950 text-white p-4 shadow-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold tracking-wide">InvoiceGuard <span className="text-blue-500">AI</span></h1>
          </div>
          <p className="text-sm text-slate-400 hidden md:block">AI-Powered Invoice & Payment Risk Intelligence</p>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Selection Area */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-white"><FileText className="w-5 h-5 mr-2 text-blue-400"/> Select Demo Invoice</h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select 
              className="flex-1 p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full text-slate-200"
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
            >
              <option value="" className="text-slate-400">-- Choose a synthetic invoice --</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} - ₹{parseFloat(inv.amount).toLocaleString()} ({inv.scenario})
                </option>
              ))}
            </select>
            <button 
              onClick={handleAnalyze}
              disabled={loading || !selectedInvoiceId}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-900/50"
            >
              {loading ? <Activity className="w-5 h-5 animate-spin mr-2" /> : <UploadCloud className="w-5 h-5 mr-2" />}
              {loading ? 'Analyzing...' : 'Analyze Risk'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Report Area */}
        {report && (
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className={`p-6 text-white ${report.risk.risk_level === 'HIGH' ? 'bg-red-900/80 border-b border-red-800' : report.risk.risk_level === 'MEDIUM' ? 'bg-amber-900/80 border-b border-amber-800' : 'bg-emerald-900/80 border-b border-emerald-800'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Risk Assessment Report</h2>
                  <p className="opacity-90 text-slate-200">Invoice: {report.invoice.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm uppercase tracking-wider opacity-90 mb-1 text-slate-200">Recommendation</div>
                  <div className="text-3xl font-bold bg-black/30 px-4 py-1 rounded-md inline-block shadow-inner">
                    {report.risk.recommendation}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column - Score & Components */}
              <div className="md:col-span-1 border-r border-slate-700 pr-0 md:pr-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Overall Risk Score</h3>
                  {renderGauge(report.risk.risk_score)}
                  <div className={`text-xl font-bold mt-2 ${report.risk.risk_level === 'HIGH' ? 'text-red-400' : report.risk.risk_level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {report.risk.risk_level} RISK
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Risk Breakdown</h4>
                  {[
                    { label: 'Invoice Anomaly', val: report.risk.components.invoice_risk },
                    { label: 'Payment Behavior', val: report.risk.components.payment_risk },
                    { label: 'Transaction / Dup', val: report.risk.components.transaction_risk }
                  ].map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{c.label}</span>
                        <span className="font-medium text-slate-100">{c.val}/100</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full shadow-sm ${c.val > 60 ? 'bg-red-500' : c.val > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: \`\${c.val}%\` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="md:col-span-2 space-y-8">
                
                {/* Key Factors */}
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">Key Risk Factors (Explainability)</h3>
                  <div className="space-y-3">
                    {report.risk.risk_factors.map((factor, idx) => (
                      <div key={idx} className="flex items-start bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        {report.risk.risk_level === 'LOW' ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-slate-200 font-medium">{factor}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Details Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Invoice Details</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="text-slate-400 w-24 inline-block">Amount:</span> <span className="font-semibold text-white">₹{parseFloat(report.invoice.amount).toLocaleString()}</span></li>
                      <li><span className="text-slate-400 w-24 inline-block">Date:</span> <span className="text-slate-200">{report.invoice.date}</span></li>
                      <li><span className="text-slate-400 w-24 inline-block">Due Date:</span> <span className="text-slate-200">{report.invoice.due_date}</span></li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Parties Involved</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="text-slate-400 w-24 inline-block">Buyer:</span> <span className="font-semibold text-white">{report.buyer.name}</span></li>
                      <li><span className="text-slate-400 w-24 inline-block">Avg Amount:</span> <span className="text-slate-200">₹{parseFloat(report.buyer.avg_amount).toLocaleString()}</span></li>
                      <li><span className="text-slate-400 w-24 inline-block">Supplier:</span> <span className="text-slate-200">{report.supplier.name}</span></li>
                    </ul>
                  </div>
                </section>

                {/* Payment History Visual */}
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">Historical Payment Behavior</h3>
                  <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
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
                          scales: { 
                            y: { 
                              beginAtZero: true,
                              grid: { color: '#334155' },
                              ticks: { color: '#94a3b8' }
                            },
                            x: {
                              grid: { color: '#334155' },
                              ticks: { color: '#94a3b8' }
                            }
                          }
                        }}
                      />
                    </div>
                    <p className="text-center text-sm text-slate-400 mt-4">
                      Buyer has an average payment delay of <strong className="text-slate-200">{report.buyer.avg_delay} days</strong>.
                    </p>
                  </div>
                </section>

              </div>
            </div>
            
            <div className="bg-slate-900/80 p-4 text-center text-xs text-slate-500 border-t border-slate-700">
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
