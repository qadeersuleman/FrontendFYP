// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http:/10.163.202.50:8000/api/';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const submitAssessment = async (assessmentData) => {
  try {
    const response = await api.post('/assessments/', assessmentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    
    if (error.response) {
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      throw new Error('No response received from server. Please check your connection.');
    } else {
      throw new Error('Request failed to be created');
    }
  }
};