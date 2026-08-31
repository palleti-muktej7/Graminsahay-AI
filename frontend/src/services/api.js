import axios from 'axios';

// Automatically use relative '/api' on Vercel or localhost:8000 when developing locally
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:8000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000,
});

export const getBusinessProfiles = async () => {
  const res = await api.get('/business-profiles');
  return res.data;
};

export const getSchemes = async () => {
  const res = await api.get('/schemes');
  return res.data;
};

export const getDistricts = async () => {
  const res = await api.get('/districts');
  return res.data;
};

export const evaluateFullProposal = async (payload) => {
  const res = await api.post('/advisory/evaluate-all', payload);
  return res.data;
};

export const calculateFinances = async (params) => {
  const res = await api.post('/finance/calculate', null, { params });
  return res.data;
};

export const registerUserApi = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const loginUserApi = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const fetchAllProposalsApi = async () => {
  const res = await api.get('/auth/all-proposals');
  return res.data;
};

export const updateProposalStatusApi = async (proposalId, status, remarks = '') => {
  const res = await api.post('/auth/update-status', {
    proposal_id: proposalId,
    status: status,
    remarks: remarks,
  });
  return res.data;
};

export const downloadDPRByIdApi = async (proposalId, applicantName = 'Applicant') => {
  const res = await api.get(`/report/download-by-id/${proposalId}`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `MoSJE_DPR_${applicantName.replace(/\s+/g, '_')}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadDPRPdf = async (fullData) => {
  const res = await api.post('/report/generate-dpr', fullData, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  const name = fullData?.entrepreneur?.full_name || fullData?.applicant_name || 'Applicant';
  const biz = fullData?.business_id || 'Business';
  link.setAttribute('download', `MoSJE_DPR_${name.replace(/\s+/g, '_')}_${biz}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;
