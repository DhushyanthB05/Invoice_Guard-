import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Activity, Search, Bell, User, FileText, ArrowRight, X } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    axios.get(`${API_BASE}/invoices`)
      .then(res => setInvoices(res.data))
      .catch(err => setError("Failed to load demo invoices. Is the backend running?"));
  };

  const handleAnalyze = async (invoiceId) => {
    setAnalyzingId(invoiceId);
    setLoading(true);
    setError(null);
    setReport(null);
    
    try {
      const res = await axios.post(`${API_BASE}/analyze`, { invoice_id: invoiceId });
      setReport(res.data);
      // Smooth scroll to report after a short delay to allow render
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Ensure Python ML service is running.");
    } finally {
      setLoading(false);
      setAnalyzingId(null);
    }
  };

  const closeReport = () => {
    setReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderGauge = (score) => {
    let color = score > 60 ? '#ef4444' : score > 30 ? '#f59e0b' : '#10b981';
    return (
      <div className="w-56 h-56 mx-auto relative drop-shadow-xl">
        <Doughnut 
          data={{
            labels: ['Risk', 'Safe'],
            datasets: [{
              data: [score, 100 - score],
              backgroundColor: [color, '#334155'],
              borderWidth: 0,
              circumference: 180,
              rotation: 270,
            }]
          }}
          options={{
            cutout: '82%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            maintainAspectRatio: true,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
          <span className="text-5xl font-bold tracking-tighter" style={{color}}>{score}</span>
          <span className="text-sm text-slate-400 font-medium tracking-wide uppercase mt-1">Risk Score</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Enterprise Header */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
              <ShieldAlert className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              InvoiceGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">AI</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center text-sm font-medium text-slate-400">
              <span className="flex items-center"><Activity className="w-4 h-4 mr-2 text-emerald-400"/> System Online</span>
            </div>
            <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center shadow-inner cursor-pointer">
              <User className="w-4 h-4 text-slate-200" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Title & Stats (Mocked for MVP Professional feel) */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Financing Risk Center</h2>
            <p className="text-slate-400 mt-2">Evaluate and approve supply-chain invoices using AI-driven risk intelligence.</p>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center backdrop-blur-sm">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Invoice Queue Table (Replaces the basic dropdown) */}
        <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-12 relative z-10">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-b from-slate-800/50 to-transparent">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400"/> 
              Pending Invoice Queue
            </h3>
            <div className="relative w-full sm:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="Search invoices..." 
                 className="w-full bg-[#0b1120] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
               />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b1120]/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="p-4 pl-6">Invoice ID</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 hidden md:table-cell">Due Date</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      Loading synthetic invoices...
                    </td>
                  </tr>
                ) : invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 pl-6 font-medium text-slate-200">
                      {inv.id}
                      <div className="text-xs text-slate-500 mt-1">{inv.scenario}</div>
                    </td>
                    <td className="p-4 text-slate-300">{inv.supplier_id}</td>
                    <td className="p-4 font-semibold text-white">₹{parseFloat(inv.amount).toLocaleString()}</td>
                    <td className="p-4 text-slate-400 hidden md:table-cell">{inv.due_date}</td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => handleAnalyze(inv.id)}
                        disabled={loading && analyzingId !== inv.id}
                        className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all
                          ${analyzingId === inv.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                            : 'bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 group-hover:bg-blue-600/10'
                          } disabled:opacity-50`}
                      >
                        {analyzingId === inv.id ? (
                          <><Activity className="w-4 h-4 animate-spin mr-2" /> Analyzing</>
                        ) : (
                          <>Analyze <ArrowRight className="w-4 h-4 ml-2" /></>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Risk Report */}
        {report && (
          <div ref={reportRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <ShieldAlert className="w-6 h-6 mr-3 text-blue-500" />
                Intelligence Report
              </h2>
              <button onClick={closeReport} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors border border-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#111827] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative">
              
              {/* Dynamic Status Banner */}
              <div className={`px-8 py-5 flex flex-col md:flex-row justify-between items-center relative overflow-hidden
                ${report.risk.risk_level === 'HIGH' ? 'bg-gradient-to-r from-red-900/90 to-red-950 border-b border-red-800' 
                : report.risk.risk_level === 'MEDIUM' ? 'bg-gradient-to-r from-amber-900/90 to-amber-950 border-b border-amber-800' 
                : 'bg-gradient-to-r from-emerald-900/90 to-emerald-950 border-b border-emerald-800'}`}>
                
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10 text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm font-medium opacity-80 text-white uppercase tracking-wider mb-1">Assessment Complete</p>
                  <h3 className="text-3xl font-bold text-white">{report.invoice.id}</h3>
                </div>
                
                <div className="relative z-10 flex items-center bg-black/40 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 shadow-inner">
                  <span className="text-sm text-slate-300 uppercase tracking-widest mr-4">Decision</span>
                  <span className="text-2xl font-bold text-white tracking-tight">{report.risk.recommendation}</span>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column - Score Matrix (4 cols) */}
                <div className="lg:col-span-4 flex flex-col">
                  <div className="bg-[#0b1120] rounded-xl p-6 border border-slate-800 shadow-inner mb-6 flex-1">
                    {renderGauge(report.risk.risk_score)}
                    
                    <div className="mt-8 space-y-5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Risk Matrix Breakdown</h4>
                      {[
                        { label: 'Invoice Anomaly', val: report.risk.components.invoice_risk },
                        { label: 'Payment Behavior', val: report.risk.components.payment_risk },
                        { label: 'Transaction Risk', val: report.risk.components.transaction_risk }
                      ].map((c, i) => (
                        <div key={i} className="group">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300 group-hover:text-white transition-colors">{c.label}</span>
                            <span className="font-semibold text-slate-100">{c.val}/100</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out
                                ${c.val > 60 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                : c.val > 30 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                                : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                              style={{ width: `${c.val}%` }}>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Intelligence & Data (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* AI Explainability */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-[#0b1120] p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-2 text-blue-400"/> AI Risk Explainability
                    </h3>
                    <div className="space-y-3">
                      {report.risk.risk_factors.map((factor, idx) => (
                        <div key={idx} className="flex items-start bg-[#0b1120]/80 p-4 rounded-lg border border-slate-800/50 backdrop-blur-sm transition-transform hover:-translate-y-0.5 duration-200">
                          {report.risk.risk_level === 'LOW' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 mr-4 mt-0.5 flex-shrink-0 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-400 mr-4 mt-0.5 flex-shrink-0 drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]" />
                          )}
                          <span className="text-slate-200 leading-relaxed">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Context Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0b1120] p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Transaction Profile</h4>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-800/50 pb-2">
                          <dt className="text-slate-400">Target Amount</dt>
                          <dd className="font-bold text-white">₹{parseFloat(report.invoice.amount).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/50 pb-2">
                          <dt className="text-slate-400">Issue Date</dt>
                          <dd className="text-slate-200">{report.invoice.date}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/50 pb-2">
                          <dt className="text-slate-400">Due Date</dt>
                          <dd className="text-slate-200">{report.invoice.due_date}</dd>
                        </div>
                        <div className="flex justify-between pb-1">
                          <dt className="text-slate-400">Supplier Entity</dt>
                          <dd className="text-slate-200 font-medium">{report.supplier.name}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-[#0b1120] p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Buyer Intelligence</h4>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-800/50 pb-2">
                          <dt className="text-slate-400">Buyer Entity</dt>
                          <dd className="font-bold text-blue-400">{report.buyer.name}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/50 pb-2">
                          <dt className="text-slate-400">Historical Avg</dt>
                          <dd className="text-slate-200">₹{parseFloat(report.buyer.avg_amount).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/50 pb-2">
                          <dt className="text-slate-400">Historical Delay</dt>
                          <dd className="text-slate-200">{report.buyer.avg_delay} days</dd>
                        </div>
                        <div className="flex justify-between pb-1">
                          <dt className="text-slate-400">Delay Frequency</dt>
                          <dd className="text-slate-200 font-medium">{report.buyer.delayed_count} / {report.buyer.total_count} invoices</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Visual Analytics */}
                  <div className="bg-[#0b1120] p-5 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Behavioral Analytics</h3>
                    <div className="h-40">
                      <Bar 
                        data={{
                          labels: ['Total Paid Invoices', 'Late Payments'],
                          datasets: [{
                            label: 'Volume',
                            data: [report.buyer.total_count, report.buyer.delayed_count],
                            backgroundColor: ['#3b82f6', '#ef4444'],
                            borderRadius: 6,
                            barThickness: 30,
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { 
                            y: { 
                              beginAtZero: true,
                              grid: { color: '#1e293b', drawBorder: false },
                              ticks: { color: '#64748b', stepSize: 5 }
                            },
                            x: {
                              grid: { display: false },
                              ticks: { color: '#94a3b8', font: { weight: '500' } }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="bg-[#0b1120] p-4 flex justify-between items-center text-xs text-slate-500 border-t border-slate-800">
                <span className="flex items-center"><Info className="w-4 h-4 mr-2" /> Generated by NeuralNexus Engine v2.0 (Synthetic Demo Data)</span>
                <span>ID: {report.invoice.id}-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
