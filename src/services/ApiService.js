import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Change this to your backend URL

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network connection failed. Please check your internet connection.';
    } else if (error.code === 'TIMEOUT') {
      error.message = 'Request timed out. Please try again.';
    } else if (error.response) {
      error.message = error.response.data?.message || `Server error: ${error.response.status}`;
    }
    
    return Promise.reject(error);
  }
);

class ApiService {
  // Health check
  static async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload and analyze face
  static async analyzeFace(formData) {
    try {
      const response = await apiClient.post('/api/analyze-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get analysis history
  static async getAnalysisHistory() {
    try {
      const response = await apiClient.get('/api/analysis-history');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get specific analysis
  static async getAnalysis(analysisId) {
    try {
      const response = await apiClient.get(`/api/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete analysis
  static async deleteAnalysis(analysisId) {
    try {
      const response = await apiClient.delete(`/api/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get consultation recommendations
  static async getConsultationRecommendations(analysisId) {
    try {
      const response = await apiClient.get(`/api/consultation/${analysisId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiService;