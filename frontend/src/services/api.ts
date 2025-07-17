import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface PriceResponse {
  price: number;
  source: string;
  token: string;
  network: string;
  timestamp: number;
  interpolationData?: {
    before: { timestamp: number; price: number };
    after: { timestamp: number; price: number };
  };
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  jobId: string;
  token: string;
  network: string;
  estimatedDuration: string;
}

export const apiService = {
  async getTokenPrice(token: string, network: string, timestamp: number): Promise<PriceResponse> {
    const response = await api.get('/api/price', {
      params: { token, network, timestamp }
    });
    return response.data;
  },

  async scheduleHistoryFetch(token: string, network: string): Promise<ScheduleResponse> {
    const response = await api.post('/api/schedule', { token, network });
    return response.data;
  },

  async getHealth() {
    const response = await api.get('/health');
    return response.data;
  }
};
