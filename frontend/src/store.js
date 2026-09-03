import { configureStore, createSlice } from '@reduxjs/toolkit';

const riskSlice = createSlice({
  name: 'risk',
  initialState: {
    invoices: [],
    currentReport: null,
    allReports: [],
    loading: false,
    error: null,
  },
  reducers: {
    setInvoices: (state, action) => { state.invoices = action.payload; },
    addInvoice: (state, action) => { state.invoices.unshift(action.payload); },
    setLoading: (state, action) => { state.loading = action.payload; },
    setReport: (state, action) => { 
      state.currentReport = action.payload; 
      const existingIdx = state.allReports.findIndex(r => r.invoice.id === action.payload.invoice.id);
      if (existingIdx >= 0) {
          state.allReports[existingIdx] = action.payload;
      } else {
          state.allReports.unshift(action.payload);
      }
    },
    setError: (state, action) => { state.error = action.payload; },
    clearReport: (state) => { state.currentReport = null; }
  }
});

export const { setInvoices, addInvoice, setLoading, setReport, setError, clearReport } = riskSlice.actions;

export const store = configureStore({
  reducer: {
    risk: riskSlice.reducer
  }
});
