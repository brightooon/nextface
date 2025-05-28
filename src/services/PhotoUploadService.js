import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Change this to your backend URL

class PhotoUploadService {
  static async uploadAndAnalyze(imageAsset) {
    try {
      // Create FormData to send the image
      const formData = new FormData();
      
      // Add the image file
      formData.append('file', {
        uri: imageAsset.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      // Configure request
      const config = {
        method: 'POST',
        url: `${BASE_URL}/api/analyze-face`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      };

      // Make the request
      const response = await axios(config);
      
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Photo upload service error:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else if (error.code === 'TIMEOUT') {
        throw new Error('Request timed out. Please try again.');
      } else if (error.response) {
        // Server responded with an error
        const message = error.response.data?.message || 'Server error occurred';
        throw new Error(message);
      } else {
        throw new Error('An unexpected error occurred during analysis');
      }
    }
  }

  static async getAnalysisHistory() {
    try {
      const response = await axios.get(`${BASE_URL}/api/analysis-history`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
      throw error;
    }
  }

  static async deleteAnalysis(analysisId) {
    try {
      const response = await axios.delete(`${BASE_URL}/api/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      throw error;
    }
  }
}

export default PhotoUploadService;