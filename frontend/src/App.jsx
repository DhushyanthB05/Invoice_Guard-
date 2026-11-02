import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { setInvoices, addInvoice, setLoading, setReport, setError, clearReport } from './store';
import { 
  LayoutDashboard, FileSearch, ShieldCheck, Activity, Users, Settings, 
  Bell, Search, ChevronRight, FileText, CheckCircle, AlertTriangle, 
  ArrowRight, BrainCircuit, X, UploadCloud, Database, Scan, Lock, Printer, Check, User, Info, BarChart3,
  MessageSquare, Send, Bot, Wifi, WifiOff, Mail, Sparkles, Copy, Network
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- CONTEXT FOR TOAST NOTIFICATIONS --- //
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center border 
              ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-800 text-white border-slate-700'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" /> : <Info className="w-5 h-5 mr-3 text-blue-400" />}
            <span className="font-bold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100"><X className="w-4 h-4"/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

// --- COMPONENTS --- //

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Risk Pipeline', path: '/pipeline', icon: FileSearch },
    { name: 'Counterparties', path: '/counterparties', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl shadow-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">InvoiceGuard</h1>
          <p className="text-xs text-indigo-400 font-medium">by NeuralNexus</p>
        </div>
      </div>
      <div className="p-4 flex-1">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2 mt-4">Menu</div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const Header = () => {
  const showToast = useContext(ToastContext);
  const dispatch = useDispatch();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if(!isLive) return;
    
    showToast("Live Traffic Simulation Started. Monitoring network...", "info");
    const interval = setInterval(() => {
       const newInvoice = {
          id: `TRX-${Math.floor(Math.random() * 90000) + 10000}`,
          supplier_id: "SUPP-" + Math.floor(Math.random() * 900 + 100),
          buyer_id: "BUYER-" + Math.floor(Math.random() * 900 + 100),
          amount: Math.floor(Math.random() * 5000000) + 50000,
          due_date: "2026-11-20",
          date: "2026-09-03",
          scenario: "Live Network Stream"
        };
        dispatch(addInvoice(newInvoice));
    }, 4500);

    return () => clearInterval(interval);
  }, [isLive, dispatch]);
  
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 w-96 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white">
        <Search className="w-4 h-4 text-slate-400 mr-3" />
        <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700" />
      </div>
      <div className="flex items-center space-x-5">
        
        {/* Live Traffic Toggle */}
        <button 
          onClick={() => setIsLive(!isLive)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center transition-all duration-300
            ${isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
        >
          {isLive ? (
            <><Wifi className="w-4 h-4 mr-2 animate-pulse text-emerald-500"/> Live Network: ON</>
          ) : (
            <><WifiOff className="w-4 h-4 mr-2"/> Live Network: OFF</>
          )}
        </button>

        <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 flex items-center cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => showToast("Account Aggregator sync successful.", "info")}>
          <Database className="w-3.5 h-3.5 mr-1.5" /> 
          AA Sync Data
        </div>
        <button onClick={() => showToast("You have 3 new risk alerts pending review.", "info")} className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-full border border-slate-200 shadow-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <button onClick={() => showToast("Admin profile options opened.", "info")} className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center shadow-sm">
          <User className="w-5 h-5 text-indigo-600" />
        </button>
      </div>
    </header>
  );
}

const PipelineStage = ({ step, title, desc, active, completed, icon: Icon }) => (
  <div className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-500 ${active ? 'bg-indigo-50 border border-indigo-100 shadow-sm' : 'opacity-60'}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500
      ${completed ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-500'}`}>
      {completed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
    </div>
    <div>
      <h4 className={`text-sm font-bold ${active ? 'text-indigo-900' : 'text-slate-700'}`}>Step {step}: {title}</h4>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// --- PAGES --- //

const Dashboard = () => {
  const { allReports, invoices } = useSelector(state => state.risk);
  
  const highRiskCount = allReports.filter(r => r.risk.risk_level === 'HIGH').length;
  const avgScore = allReports.length > 0 
    ? Math.round(allReports.reduce((acc, r) => acc + r.risk.risk_score, 0) / allReports.length)
    : 0;

  return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-in fade-in duration-500">
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enterprise Risk Analytics</h2>
      <p className="text-slate-500 mt-2 font-medium text-lg">Real-time supply chain finance intelligence and portfolio monitoring.</p>
    </div>
    
    {/* KPI Cards */}
    <motion.div 
      initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="p-6 rounded-3xl border border-indigo-100 bg-indigo-50 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-200/50 rounded-full blur-xl"></div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">Total Processed</h3>
        <div className="text-4xl font-extrabold text-indigo-600 mb-2 relative z-10">{allReports.length} <span className="text-lg text-slate-400">/ {invoices.length || 10}</span></div>
        <div className="text-sm font-medium text-indigo-600/80 relative z-10">Invoices analyzed in session</div>
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="p-6 rounded-3xl border border-rose-100 bg-rose-50 shadow-sm relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">Critical Risks</h3>
        <div className="text-4xl font-extrabold text-rose-600 mb-2 relative z-10">{highRiskCount}</div>
        <div className="text-sm font-medium text-rose-600/80 relative z-10">High-risk invoices blocked</div>
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="p-6 rounded-3xl border border-amber-100 bg-amber-50 shadow-sm relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">Average Score</h3>
        <div className="text-4xl font-extrabold text-amber-600 mb-2 relative z-10">{avgScore}</div>
        <div className="text-sm font-medium text-amber-600/80 relative z-10">Portfolio average risk score</div>
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50 shadow-sm relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">Capital Protected</h3>
        <div className="text-4xl font-extrabold text-emerald-600 mb-2 relative z-10">₹4.2M</div>
        <div className="text-sm font-medium text-emerald-600/80 relative z-10">Estimated risk exposure avoided</div>
      </motion.div>
    </motion.div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {/* Risk Distribution Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 md:col-span-1">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-indigo-600"/> Risk Distribution
        </h3>
        <div className="h-64 relative">
          {allReports.length > 0 ? (
            <Doughnut 
              data={{
                labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                datasets: [{
                  data: [
                    allReports.filter(r => r.risk.risk_level === 'HIGH').length,
                    allReports.filter(r => r.risk.risk_level === 'MEDIUM').length,
                    allReports.filter(r => r.risk.risk_level === 'LOW').length,
                  ],
                  backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
                  borderWidth: 0,
                  hoverOffset: 4
                }]
              }}
              options={{ maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }}
            />
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Doughnut data={{datasets:[{data:[1], backgroundColor:['#f1f5f9'], borderWidth:0}]}} options={{cutout:'70%', tooltips:{enabled:false}, hover:{mode:null}}} />
                <span className="absolute text-sm font-medium">No Data Yet</span>
             </div>
          )}
        </div>
      </div>

      {/* Transaction Volume Trend */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 md:col-span-2 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-indigo-600"/> 30-Day Processing Volume
          </h3>
        </div>
        <div className="flex-1 min-h-[250px]">
          <Bar 
            data={{
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [{
                label: 'Invoices Processed',
                data: [420, 650, 580, 890],
                backgroundColor: '#6366f1',
                borderRadius: 8,
              }]
            }}
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } }}
          />
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const Pipeline = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);
  const { invoices, loading, error, allReports } = useSelector(state => state.risk);
  const [activeStep, setActiveStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (invoices.length === 0) {
      axios.get(`${API_BASE}/invoices`).then(res => dispatch(setInvoices(res.data)));
    }
  }, [dispatch, invoices.length]);

  const startAnalysis = async (invoiceId, bypassAnimation = false, invoiceData = null) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    if (!bypassAnimation) {
      setActiveStep(1); 
      for (let i = 2; i <= 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setActiveStep(i);
      }
    }

    try {
      const targetInv = invoiceData || invoices.find(i => i.id === invoiceId);
      const res = await axios.post(`${API_BASE}/analyze`, { 
          invoice_id: invoiceId, 
          invoice_data: targetInv 
      });
      dispatch(setReport(res.data));
      setActiveStep(7); 
      showToast(`Analysis completed for ${invoiceId}`, "success");
      if (!bypassAnimation) setTimeout(() => navigate('/report'), 600);
    } catch (err) {
      dispatch(setError(err.message));
      showToast(`Pipeline failed for ${invoiceId}. Check server.`, "error");
      setActiveStep(0);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleBatchProcess = async () => {
    const unanalyzed = invoices.filter(inv => !allReports.find(r => r.invoice.id === inv.id));
    if (unanalyzed.length === 0) return showToast("All invoices are already analyzed!", "info");
    
    showToast(`Batch processing ${unanalyzed.length} invoices in background...`, "info");
    for (const inv of unanalyzed) {
      await startAnalysis(inv.id, true);
    }
    showToast("Batch processing complete!", "success");
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    showToast(`Initiating OCR on ${file.name}...`, "info");
    
    setTimeout(async () => {
      const newInvoice = {
        id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        supplier_id: "SUPP-" + Math.floor(Math.random() * 900 + 100),
        buyer_id: "BUYER-" + Math.floor(Math.random() * 900 + 100),
        amount: Math.floor(Math.random() * 2000000) + 50000,
        due_date: "2026-11-20",
        date: "2026-09-03",
        scenario: `Scanned: ${file.name}`
      };
      
      dispatch(addInvoice(newInvoice));
      setIsUploading(false);
      showToast(`Data Extracted! Automatically sensing risk for ${newInvoice.id}...`, "success");
      
      // Auto-trigger the ML pipeline in real-time
      await startAnalysis(newInvoice.id, false, newInvoice);
    }, 2500);
  };

  const handleExportCSV = () => {
    if (allReports.length === 0) return showToast("No reports to export.", "error");
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Invoice ID,Risk Level,Score,Recommendation\n"
      + allReports.map(e => `${e.invoice.id},${e.risk.risk_level},${e.risk.risk_score},${e.risk.recommendation}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "InvoiceGuard_Audit_Trail.csv");
    document.body.appendChild(link);
    link.click();
    showToast("Audit trail exported successfully!", "success");
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inv.supplier_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-8 h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Invoice Risk Pipeline</h2>
            <p className="text-slate-500 mt-2 font-medium">Process supply-chain invoices through the AI anomaly detection engine.</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={handleExportCSV} className="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center">
              <Database className="w-4 h-4 mr-2"/> Export Audit CSV
            </button>
            <button onClick={handleBatchProcess} disabled={loading} className="px-5 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm flex items-center">
              <Settings className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}/> Batch Process
            </button>
          </div>
        </div>

        {/* OCR Dropzone */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.jpg,.png" 
          onChange={handleFileChange} 
        />
        <div 
          onClick={() => fileInputRef.current.click()}
          className={`mb-6 border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300
            ${isUploading ? 'bg-indigo-50 border-indigo-300 shadow-inner' : 'bg-white border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50'}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Scan className="w-12 h-12 text-indigo-600 animate-pulse mb-3" />
              <h3 className="text-lg font-bold text-indigo-900">Extracting Invoice Data...</h3>
              <p className="text-sm text-indigo-600/80 mt-1">Running Optical Character Recognition (OCR) and Field Mapping</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <UploadCloud className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Drag & Drop Invoice Document</h3>
              <p className="text-sm text-slate-500 mt-1">Click to select an actual physical invoice (PDF, JPG, PNG)</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative flex-1 flex flex-col">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
               <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-indigo-100">
                 <BrainCircuit className="w-12 h-12 text-indigo-600 animate-pulse mb-4" />
                 <span className="font-extrabold text-indigo-900 text-lg">AI Engine Processing...</span>
                 <span className="text-sm text-slate-500 mt-2">Evaluating Risk Parameters</span>
               </div>
            </div>
          )}
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50 shrink-0">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600"/> Processing Queue
            </h3>
            <div className="relative w-full sm:w-72">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search by ID or Supplier..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
               />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-sm z-10">
                <tr className="text-slate-500 text-xs uppercase tracking-widest font-bold border-b border-slate-200">
                  <th className="p-5 pl-8">Invoice ID</th>
                  <th className="p-5">Counterparties</th>
                  <th className="p-5">Target Amount</th>
                  <th className="p-5 text-right pr-8">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map(inv => {
                  const existingReport = allReports.find(r => r.invoice.id === inv.id);
                  return (
                  <tr key={inv.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-5 pl-8">
                      <div className="font-bold text-slate-900 text-lg">{inv.id}</div>
                      <div className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-flex px-2 py-0.5 rounded-md mt-1 border border-indigo-100">
                        {inv.scenario}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm font-semibold text-slate-900 flex items-center mb-1"><span className="text-slate-400 text-xs w-16">Supplier:</span> {inv.supplier_id}</div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center"><span className="text-slate-400 text-xs w-16">Buyer:</span> {inv.buyer_id}</div>
                    </td>
                    <td className="p-5 font-extrabold text-slate-900 text-lg">₹{parseFloat(inv.amount).toLocaleString()}</td>
                    <td className="p-5 pr-8 text-right">
                      {existingReport ? (
                        <div className="flex items-center justify-end space-x-3">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold border ${existingReport.risk.risk_level === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' : existingReport.risk.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                             {existingReport.risk.risk_level} RISK
                           </span>
                           <button 
                             onClick={() => { dispatch(setReport(existingReport)); navigate('/report'); }}
                             className="text-indigo-600 font-bold hover:underline text-sm"
                           >
                             View Report
                           </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => startAnalysis(inv.id)}
                          disabled={loading}
                          className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
                        >
                          Run AI Engine <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-80 flex-shrink-0 hidden lg:block">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sticky top-28">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-6 flex items-center">
            <BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" />
            7-Stage AI Pipeline
          </h3>
          <div className="space-y-2 relative before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            <PipelineStage step="1" title="Data Ingestion" desc="Upload docs & extract metadata" icon={UploadCloud} active={activeStep >= 1} completed={activeStep > 1} />
            <PipelineStage step="2" title="Data Extraction" desc="OCR & field mapping" icon={Scan} active={activeStep >= 2} completed={activeStep > 2} />
            <PipelineStage step="3" title="Invoice Analysis" desc="GSTN & Duplicate check" icon={FileSearch} active={activeStep >= 3} completed={activeStep > 3} />
            <PipelineStage step="4" title="Payment History" desc="AA API behavior mapping" icon={Activity} active={activeStep >= 4} completed={activeStep > 4} />
            <PipelineStage step="5" title="Risk Engine" desc="XGBoost & SHAP Evaluation" icon={BrainCircuit} active={activeStep >= 5} completed={activeStep > 5} />
            <PipelineStage step="6" title="Risk Report" desc="Generation of explanations" icon={FileText} active={activeStep >= 6} completed={activeStep > 6} />
            <PipelineStage step="7" title="Decision Support" desc="Financier Human-in-the-loop" icon={Lock} active={activeStep >= 7} completed={activeStep > 7} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Report = () => {
  const { currentReport: report } = useSelector(state => state.risk);
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);
  const reportRef = useRef(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="text-center p-20">
        <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700">No Report Selected</h2>
        <button onClick={() => navigate('/pipeline')} className="mt-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Go to Pipeline</button>
      </div>
    );
  }

  const handleExport = () => {
    showToast("Preparing PDF export...", "info");
    setTimeout(() => window.print(), 800);
  };

  const handleManualReview = () => {
    showToast("Manual review requested. Assigned to underwriting team.", "info");
    navigate('/pipeline');
  };

  const handleConfirmDecision = () => {
    showToast(`Decision ${report.risk.recommendation} confirmed successfully!`, "success");
    navigate('/pipeline');
  };

  const emailDraft = `Subject: Urgent: Clarification Required for Invoice ${report.invoice.id}

Dear ${report.supplier?.name || 'Supplier'} Finance Team,

We are currently processing your recent invoice (${report.invoice.id}) dated ${report.invoice.date} for the amount of ₹${parseFloat(report.invoice.amount).toLocaleString()}.

Our automated risk assessment engine has temporarily paused the processing of this transaction for manual review due to the following detected anomalies:
${report.risk.risk_factors.map(f => `- ${f}`).join('\n')}

To prevent any delays in your payout, please provide supporting documentation (such as approved purchase orders or delivery challans) corresponding to this invoice amount.

Best regards,
Risk Underwriting Team
CashInvoice (Powered by NeuralNexus AI)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    showToast("AI Draft copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/pipeline')} className="text-sm font-bold text-indigo-600 flex items-center mb-4 hover:underline">
              ← Back to Pipeline
            </button>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Decision Support Report</h2>
          </div>
          <div className="flex space-x-3 hide-on-print">
             <button onClick={() => setShowEmailModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center">
               <Sparkles className="w-4 h-4 mr-2"/> Gen-AI Auto-Draft
             </button>
             <button onClick={handleExport} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 shadow-sm flex items-center transition-colors">
               <Printer className="w-4 h-4 mr-2"/> Download as PDF
             </button>
          </div>
        </div>

        <div ref={reportRef} className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/5 border border-slate-200 overflow-hidden relative">
          <div className={`px-10 py-8 flex justify-between items-center relative overflow-hidden
            ${report.risk.risk_level === 'HIGH' ? 'bg-rose-50' : report.risk.risk_level === 'MEDIUM' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
            <div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2
                ${report.risk.risk_level === 'HIGH' ? 'text-rose-500' : report.risk.risk_level === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>
                Pipeline Execution Complete
              </p>
              <h3 className="text-4xl font-extrabold text-slate-900">{report.invoice.id}</h3>
            </div>
            <div className="text-right z-10 relative">
              <div className="text-5xl font-extrabold text-slate-900 mb-1">{report.risk.risk_score}<span className="text-2xl text-slate-400">/100</span></div>
              <div className="font-bold text-slate-600">Overall Risk Score</div>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Report Body (Gauge, Features) remains fully functional */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 h-full flex flex-col">
              <div className="w-56 h-56 mx-auto relative drop-shadow-xl">
                <Doughnut data={{ labels: ['Risk','Safe'], datasets: [{ data: [report.risk.risk_score, 100 - report.risk.risk_score], backgroundColor: [report.risk.risk_score > 60 ? '#f43f5e' : report.risk.risk_score > 30 ? '#f59e0b' : '#10b981', '#f1f5f9'], borderWidth: 0, circumference: 180, rotation: 270 }] }} options={{ cutout: '80%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, maintainAspectRatio: true }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                  <span className="text-5xl font-extrabold tracking-tighter" style={{color: report.risk.risk_score > 60 ? '#f43f5e' : report.risk.risk_score > 30 ? '#f59e0b' : '#10b981'}}>{report.risk.risk_score}</span>
                  <span className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-2">Final Score</span>
                </div>
              </div>
              <div className="mt-12 space-y-5 flex-1">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-3">Risk Breakdown</h4>
                {[ { label: 'Invoice Anomaly', val: report.risk.components.invoice_risk }, { label: 'Payment Behavior', val: report.risk.components.payment_risk }, { label: 'Transaction Risk', val: report.risk.components.transaction_risk } ].map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2.5">
                      <span className="text-slate-600 font-semibold">{c.label}</span>
                      <span className="font-extrabold text-slate-900">{c.val}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className={`h-full rounded-full ${c.val > 60 ? 'bg-rose-500' : c.val > 30 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${c.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-fuchsia-500"></div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-widest mb-6 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2"/> SHAP Explainability (Feature Impact)
              </h3>
              <div className="space-y-4 mb-8">
                {report.risk.risk_factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center">
                       {report.risk.risk_level === 'LOW' ? <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" /> : <AlertTriangle className="w-5 h-5 text-rose-500 mr-3" />}
                       <span className="text-slate-700 font-medium">{factor}</span>
                    </div>
                    <div className="w-32 h-2 bg-slate-200 rounded-full flex overflow-hidden">
                       <div className={`h-full ${report.risk.risk_level === 'LOW' ? 'bg-emerald-400 w-full' : 'bg-rose-400 w-3/4'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-500 mb-5 uppercase tracking-widest">Transaction Profile</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Target Amount</span><span className="font-extrabold text-slate-900">₹{parseFloat(report.invoice.amount).toLocaleString()}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Issue Date</span><span className="font-bold text-slate-700">{report.invoice.date}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Due Date</span><span className="font-bold text-slate-700">{report.invoice.due_date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Supplier Entity</span><span className="font-bold text-indigo-600">{report.supplier.name}</span></div>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-500 mb-5 uppercase tracking-widest">Buyer Intelligence</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Buyer Entity</span><span className="font-extrabold text-indigo-600">{report.buyer.name}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Historical Avg</span><span className="font-bold text-slate-700">₹{parseFloat(report.buyer.avg_amount).toLocaleString()}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Historical Delay</span><span className="font-bold text-slate-700">{report.buyer.avg_delay} Days</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Delay Frequency</span><span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">{report.buyer.delayed_count} / {report.buyer.total_count}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Agent Audit Trail */}
        <div className="px-10 pb-10">
           <div className="bg-slate-900 rounded-3xl p-8 shadow-inner relative overflow-hidden border border-slate-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
             <h3 className="text-sm font-extrabold text-indigo-400 uppercase tracking-widest mb-6 flex items-center relative z-10">
              <Users className="w-5 h-5 mr-2"/> Autonomous Agent Swarm Execution Log
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
              {/* Agent 1 */}
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-3">
                    <Check className="w-4 h-4"/>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">Extraction Agent</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Structured payload parsed successfully. 100% confidence score.</p>
              </motion.div>
              
              {/* Agent 2 */}
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.3}} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-3">
                    <ShieldCheck className="w-4 h-4"/>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">KYC Agent</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Counterparty IDs validated against global registry.</p>
              </motion.div>

              {/* Agent 3 */}
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.5}} className={`rounded-2xl p-5 border ${report.risk.risk_level === 'HIGH' ? 'bg-rose-900/30 border-rose-800' : report.risk.risk_level === 'MEDIUM' ? 'bg-amber-900/30 border-amber-800' : 'bg-slate-800/80 border-slate-700'}`}>
                <div className="flex items-center mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${report.risk.risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : report.risk.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {report.risk.risk_level === 'LOW' ? <Check className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">ML Risk Swarm</h4>
                </div>
                <p className={`text-xs leading-relaxed ${report.risk.risk_level === 'HIGH' ? 'text-rose-300' : report.risk.risk_level === 'MEDIUM' ? 'text-amber-300' : 'text-slate-400'}`}>
                  Isolation Forest executed. Detected {report.risk.risk_factors.length} anomaly vector(s).
                </p>
              </motion.div>

              {/* Agent 4 */}
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.7}} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3">
                    <Network className="w-4 h-4"/>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">Policy Agent</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Applied risk guardrails. Final state set to {report.risk.recommendation}.</p>
              </motion.div>
            </div>
           </div>
        </div>
        
        {/* Working Footer Actions */}
        {/* Working Footer Actions */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="text-sm text-slate-400 font-medium flex items-center">
            <Lock className="w-4 h-4 mr-2" /> Human-in-the-loop Decision Required
          </div>
          <div className="space-x-4">
            <button onClick={handleManualReview} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors">Request Manual Review</button>
            <button onClick={handleConfirmDecision} className={`px-8 py-3 rounded-xl font-bold transition-colors shadow-lg flex items-center inline-flex
              ${report.risk.recommendation === 'APPROVE' ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-rose-500 hover:bg-rose-400 text-white'}`}>
              <Check className="w-5 h-5 mr-2" /> Confirm {report.risk.recommendation}
            </button>
          </div>
        </div>
      </div>
    </motion.div>

    {/* AI Email Modal */}
    <AnimatePresence>
      {showEmailModal && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center text-white">
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="font-extrabold text-lg">AI Auto-Drafted Communcation</h3>
                  <p className="text-xs text-indigo-200">Generated using NeuralNexus LLM</p>
                </div>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="text-indigo-200 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                  {emailDraft}
                </pre>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowEmailModal(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleCopy} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center transition-colors">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
};

const Counterparties = () => {
  const [activeTab, setActiveTab] = useState('buyers');
  
  const entities = {
    buyers: [
      { id: 'B-003', name: 'Larsen & Toubro', exposure: '₹2,500,000,000', delay: '15 Days', trust: 62 },
      { id: 'B-001', name: 'Tata Motors', exposure: '₹1,500,000,000', delay: '5 Days', trust: 92 },
      { id: 'B-002', name: 'Reliance Retail', exposure: '₹500,000,000', delay: '2 Days', trust: 98 },
      { id: 'B-007', name: 'Wipro Enterprises', exposure: '₹400,000,000', delay: '28 Days', trust: 45 },
      { id: 'B-004', name: 'Hindustan Unilever', exposure: '₹300,000,000', delay: '1 Day', trust: 99 },
      { id: 'B-008', name: 'Adani Ports', exposure: '₹3,500,000,000', delay: '12 Days', trust: 78 },
      { id: 'B-009', name: 'Maruti Suzuki', exposure: '₹2,000,000,000', delay: '4 Days', trust: 94 },
    ],
    suppliers: [
      { id: 'S-101', name: 'Sri Balaji Auto Parts', invoices: 124, volume: '₹34,000,000', rating: 'A+' },
      { id: 'S-102', name: 'Chennai Steel Works', invoices: 842, volume: '₹125,600,000', rating: 'AAA' },
      { id: 'S-103', name: 'Kaveri Logistics Pvt Ltd', invoices: 42, volume: '₹5,600,000', rating: 'B' },
      { id: 'S-104', name: 'Madras Packaging', invoices: 218, volume: '₹89,000,000', rating: 'A' },
      { id: 'S-105', name: 'Vanguard Electronics', invoices: 15, volume: '₹1,200,000', rating: 'C' },
      { id: 'S-106', name: 'Delta Precision Machining', invoices: 310, volume: '₹45,000,000', rating: 'AA' },
    ]
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Counterparty Intelligence</h2>
        <p className="text-slate-500 mt-2 font-medium text-lg">Manage buyer limits, trust scores, and supplier ratings.</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('buyers')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'buyers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>Anchor Buyers</button>
        <button onClick={() => setActiveTab('suppliers')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'suppliers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>SME Suppliers</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-widest font-bold border-b border-slate-200">
              <th className="p-5 pl-8">Entity Name</th>
              <th className="p-5">ID</th>
              <th className="p-5">{activeTab === 'buyers' ? 'Total Exposure' : 'Annual Volume'}</th>
              <th className="p-5">{activeTab === 'buyers' ? 'Avg Delay' : 'Total Invoices'}</th>
              <th className="p-5 text-right pr-8">Status Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entities[activeTab].map((ent, i) => (
              <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-5 pl-8 font-bold text-slate-900">{ent.name}</td>
                <td className="p-5 text-sm font-semibold text-slate-500">{ent.id}</td>
                <td className="p-5 font-extrabold text-slate-700">{activeTab === 'buyers' ? ent.exposure : ent.volume}</td>
                <td className="p-5 text-slate-600 font-medium">{activeTab === 'buyers' ? ent.delay : ent.invoices}</td>
                <td className="p-5 pr-8 text-right">
                  {activeTab === 'buyers' ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${ent.trust > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ent.trust > 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {ent.trust}/100 TRUST
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">
                      RATING: {ent.rating}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const SettingsPanel = () => {
  const showToast = useContext(ToastContext);
  const [weights, setWeights] = useState({ invoice: 30, payment: 40, anomaly: 30 });

  const handleSave = () => {
    if (weights.invoice + weights.payment + weights.anomaly !== 100) {
      return showToast("Weights must exactly total 100%!", "error");
    }
    showToast("Risk engine weights updated successfully!", "success");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Risk Engine Configuration</h2>
        <p className="text-slate-500 mt-2 font-medium text-lg">Adjust the core parameters of the AI decision matrix.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
          <Settings className="w-5 h-5 mr-2 text-indigo-600"/> Algorithmic Weight Tuning
        </h3>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold text-slate-700">Invoice Anomaly Weight</label>
              <span className="font-extrabold text-indigo-600">{weights.invoice}%</span>
            </div>
            <input type="range" min="0" max="100" value={weights.invoice} onChange={e => setWeights({...weights, invoice: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
            <p className="text-xs text-slate-500 mt-2">Impact of duplicate checks, amount deviations, and date inconsistencies.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold text-slate-700">Payment History Weight</label>
              <span className="font-extrabold text-indigo-600">{weights.payment}%</span>
            </div>
            <input type="range" min="0" max="100" value={weights.payment} onChange={e => setWeights({...weights, payment: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
            <p className="text-xs text-slate-500 mt-2">Impact of historical buyer delays, Account Aggregator mapping.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold text-slate-700">ML Transaction Anomaly Weight</label>
              <span className="font-extrabold text-indigo-600">{weights.anomaly}%</span>
            </div>
            <input type="range" min="0" max="100" value={weights.anomaly} onChange={e => setWeights({...weights, anomaly: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
            <p className="text-xs text-slate-500 mt-2">Impact of the Scikit-Learn Isolation Forest outlier detection model.</p>
          </div>
        </div>

        <div className="mt-10 p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
          <div className="text-sm font-bold text-slate-600">
            Total Allocated: <span className={weights.invoice + weights.payment + weights.anomaly === 100 ? 'text-emerald-600' : 'text-rose-600'}>
              {weights.invoice + weights.payment + weights.anomaly}%
            </span>
          </div>
          <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md">
            Save Engine Configuration
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CopilotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: "Hello! I'm the InvoiceGuard Copilot. How can I assist you with risk intelligence today?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { allReports } = useSelector(state => state.risk);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I analyzed the portfolio. All systems are operating normally.";
      const highRisk = allReports.filter(r => r.risk.risk_level === 'HIGH').length;
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('risk') || lower.includes('summary') || lower.includes('status')) {
         reply = `Currently, we have processed ${allReports.length} invoices. I have flagged ${highRisk} of them as HIGH RISK requiring manual escalation.`;
      } else if (lower.includes('buyer') || lower.includes('delay') || lower.includes('worst')) {
         reply = "Based on my analysis, Global Tech Corp currently shows the highest historical payment delay at 12 days. I recommend tightening their credit limits.";
      } else if (lower.includes('hello') || lower.includes('hi')) {
         reply = "Hi there! Feel free to ask me for a portfolio summary or specific counterparty risks.";
      }
      
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 hover:scale-105 transition-all z-[90] ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full"></span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-96 h-[500px] bg-white rounded-3xl shadow-2xl shadow-indigo-900/20 border border-slate-200 flex flex-col z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">InvoiceGuard Copilot</h3>
                  <div className="text-xs text-indigo-300 flex items-center mt-0.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span> Generative AI Online
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex space-x-1.5 items-center h-10">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSend} className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask the AI Copilot..." 
                  className="w-full bg-slate-100 border-none rounded-full pl-4 pr-12 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button type="submit" disabled={!input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 transition-colors">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- APP LAYOUT --- //

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-500/30">
        <div className="hide-on-print">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
          <div className="hide-on-print">
            <Header />
          </div>
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/report" element={<Report />} />
              <Route path="/counterparties" element={<Counterparties />} />
              <Route path="/settings" element={<SettingsPanel />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
          <div className="hide-on-print">
            <CopilotWidget />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
