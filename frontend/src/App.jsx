import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Activity, Search, Bell, User, FileText, ArrowRight, X, Zap, Target, TrendingUp, Building2, Calendar } from 'lucide-react';

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
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    let color = score > 60 ? '#f43f5e' : score > 30 ? '#f59e0b' : '#10b981';
    return (
      <div className="w-64 h-64 mx-auto relative drop-shadow-2xl">
        <Doughnut 
          data={{
            labels: ['Risk', 'Safe'],
            datasets: [{
              data: [score, 100 - score],
              backgroundColor: [color, '#f1f5f9'],
              borderWidth: 0,
              circumference: 180,
              rotation: 270,
            }]
          }}
          options={{
            cutout: '75%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            maintainAspectRatio: true,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-14">
          <span className="text-6xl font-extrabold tracking-tighter" style={{color}}>{score}</span>
          <span className="text-sm text-slate-400 font-bold tracking-widest uppercase mt-2">Risk Score</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Colorful Animated Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-emerald-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Modern Glass Header */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              InvoiceGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">AI</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span> System Online
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors relative bg-white p-2 rounded-full shadow-sm border border-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center shadow-sm cursor-pointer">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* Page Title */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Financing Risk Center</h2>
            <p className="text-slate-500 mt-2 font-medium text-lg">Evaluate and approve supply-chain invoices using AI-driven risk intelligence.</p>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 shadow-sm flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 text-rose-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Invoice Queue Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-slate-200/50 overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-indigo-600"/>
              </div>
              Pending Invoice Queue
            </h3>
            <div className="relative w-full sm:w-72">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search invoices..." 
                 className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm" 
               />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="p-5 pl-8">Invoice ID</th>
                  <th className="p-5">Supplier</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5 hidden md:table-cell">Due Date</th>
                  <th className="p-5 text-right pr-8">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500 font-medium">
                      Loading synthetic invoices...
                    </td>
                  </tr>
                ) : invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="font-bold text-slate-900">{inv.id}</div>
                      <div className="text-xs font-semibold text-indigo-500 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mt-1">{inv.scenario}</div>
                    </td>
                    <td className="p-5 text-slate-600 font-medium flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-slate-400"/> {inv.supplier_id}
                    </td>
                    <td className="p-5 font-extrabold text-slate-900 text-lg">₹{parseFloat(inv.amount).toLocaleString()}</td>
                    <td className="p-5 text-slate-500 font-medium hidden md:table-cell">
                      <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400"/> {inv.due_date}</div>
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <button 
                        onClick={() => handleAnalyze(inv.id)}
                        disabled={loading && analyzingId !== inv.id}
                        className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm
                          ${analyzingId === inv.id 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30 scale-95' 
                            : 'bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md'
                          } disabled:opacity-50`}
                      >
                        {analyzingId === inv.id ? (
                          <><Activity className="w-4 h-4 animate-spin mr-2" /> Processing</>
                        ) : (
                          <>Analyze <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
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
          <div ref={reportRef} className="animate-in fade-in slide-in-from-bottom-12 duration-700">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-3xl font-extrabold text-slate-900 flex items-center">
                <Zap className="w-8 h-8 mr-3 text-indigo-500 fill-indigo-500/20" />
                Intelligence Report
              </h2>
              <button onClick={closeReport} className="p-2.5 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all shadow-sm border border-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/5 border border-white overflow-hidden relative">
              
              {/* Dynamic Status Banner */}
              <div className={`px-10 py-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden
                ${report.risk.risk_level === 'HIGH' ? 'bg-rose-50' 
                : report.risk.risk_level === 'MEDIUM' ? 'bg-amber-50' 
                : 'bg-emerald-50'}`}>
                
                <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                  <p className={`text-sm font-bold uppercase tracking-widest mb-2
                    ${report.risk.risk_level === 'HIGH' ? 'text-rose-500' : report.risk.risk_level === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    Assessment Complete
                  </p>
                  <h3 className="text-4xl font-extrabold text-slate-900">{report.invoice.id}</h3>
                </div>
                
                <div className={`relative z-10 flex items-center px-8 py-4 rounded-2xl shadow-lg border
                  ${report.risk.risk_level === 'HIGH' ? 'bg-rose-500 border-rose-400 text-white shadow-rose-500/30' 
                  : report.risk.risk_level === 'MEDIUM' ? 'bg-amber-500 border-amber-400 text-white shadow-amber-500/30' 
                  : 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30'}`}>
                  <span className="text-sm font-semibold uppercase tracking-widest mr-4 opacity-90">Decision</span>
                  <span className="text-3xl font-extrabold tracking-tight">{report.risk.recommendation}</span>
                </div>
              </div>

              <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column - Score Matrix */}
                <div className="lg:col-span-4 flex flex-col">
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner flex-1">
                    {renderGauge(report.risk.risk_score)}
                    
                    <div className="mt-12 space-y-6">
                      <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2"/> Risk Breakdown
                      </h4>
                      {[
                        { label: 'Invoice Anomaly', val: report.risk.components.invoice_risk },
                        { label: 'Payment Behavior', val: report.risk.components.payment_risk },
                        { label: 'Transaction Risk', val: report.risk.components.transaction_risk }
                      ].map((c, i) => (
                        <div key={i} className="group">
                          <div className="flex justify-between text-sm mb-2.5">
                            <span className="text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">{c.label}</span>
                            <span className="font-extrabold text-slate-900">{c.val}/100</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out
                                ${c.val > 60 ? 'bg-rose-500' 
                                : c.val > 30 ? 'bg-amber-400' 
                                : 'bg-emerald-400'}`} 
                              style={{ width: `${c.val}%` }}>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Intelligence & Data */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* AI Explainability */}
                  <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-fuchsia-500"></div>
                    <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-widest mb-6 flex items-center">
                      <ShieldAlert className="w-5 h-5 mr-2"/> AI Risk Explainability
                    </h3>
                    <div className="space-y-4">
                      {report.risk.risk_factors.map((factor, idx) => (
                        <div key={idx} className="flex items-start bg-slate-50 p-5 rounded-2xl border border-slate-100 transition-all hover:shadow-md duration-300">
                          {report.risk.risk_level === 'LOW' ? (
                            <CheckCircle className="w-6 h-6 text-emerald-500 mr-4 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-amber-500 mr-4 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-slate-700 font-medium text-lg leading-relaxed">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Context Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-7 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-sm font-extrabold text-slate-500 mb-6 uppercase tracking-widest flex items-center">
                        <FileText className="w-4 h-4 mr-2"/> Transaction Profile
                      </h4>
                      <dl className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <dt className="text-slate-500 font-medium">Target Amount</dt>
                          <dd className="font-extrabold text-slate-900 text-base">₹{parseFloat(report.invoice.amount).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <dt className="text-slate-500 font-medium">Issue Date</dt>
                          <dd className="text-slate-700 font-semibold">{report.invoice.date}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <dt className="text-slate-500 font-medium">Due Date</dt>
                          <dd className="text-slate-700 font-semibold">{report.invoice.due_date}</dd>
                        </div>
                        <div className="flex justify-between pb-1">
                          <dt className="text-slate-500 font-medium">Supplier Entity</dt>
                          <dd className="text-slate-700 font-bold">{report.supplier.name}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-slate-50 p-7 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-sm font-extrabold text-slate-500 mb-6 uppercase tracking-widest flex items-center">
                        <Building2 className="w-4 h-4 mr-2"/> Buyer Intelligence
                      </h4>
                      <dl className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <dt className="text-slate-500 font-medium">Buyer Entity</dt>
                          <dd className="font-extrabold text-indigo-600 text-base">{report.buyer.name}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <dt className="text-slate-500 font-medium">Historical Avg</dt>
                          <dd className="text-slate-700 font-semibold">₹{parseFloat(report.buyer.avg_amount).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <dt className="text-slate-500 font-medium">Historical Delay</dt>
                          <dd className="text-slate-700 font-semibold">{report.buyer.avg_delay} days</dd>
                        </div>
                        <div className="flex justify-between pb-1">
                          <dt className="text-slate-500 font-medium">Delay Frequency</dt>
                          <dd className="text-slate-700 font-bold bg-slate-200 px-2 py-0.5 rounded-md">{report.buyer.delayed_count} / {report.buyer.total_count} invoices</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Visual Analytics */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2"/> Behavioral Analytics
                    </h3>
                    <div className="h-48">
                      <Bar 
                        data={{
                          labels: ['Total Paid Invoices', 'Late Payments'],
                          datasets: [{
                            label: 'Volume',
                            data: [report.buyer.total_count, report.buyer.delayed_count],
                            backgroundColor: ['#6366f1', '#f43f5e'],
                            borderRadius: 8,
                            barThickness: 40,
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { 
                            y: { 
                              beginAtZero: true,
                              grid: { color: '#f1f5f9', drawBorder: false },
                              ticks: { color: '#64748b', font: { weight: '600' } }
                            },
                            x: {
                              grid: { display: false },
                              ticks: { color: '#475569', font: { weight: '700' } }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="bg-slate-50 p-6 flex justify-between items-center text-sm text-slate-500 font-medium border-t border-slate-200">
                <span className="flex items-center"><Info className="w-4 h-4 mr-2 text-indigo-500" /> Generated by NeuralNexus Engine v2.0 (Synthetic Demo Data)</span>
                <span className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">ID: {report.invoice.id}-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
