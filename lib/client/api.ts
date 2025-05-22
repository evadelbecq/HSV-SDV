import { verify } from "crypto";

// lib/client/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
};

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { method = 'GET', headers = {}, body, credentials = 'include' } = options;
  
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      credentials,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

const api = {
  // Auth endpoints
  login: (email: string, password: string) => 
    fetchAPI('/login', { method: 'POST', body: { email, password } }),
  register: (userData: any) => 
    fetchAPI('/register', { method: 'POST', body: userData }),
  
  // Doctor endpoints
  getDoctors: () => fetchAPI('/doctors'),
  getDoctorById: (id: number) => fetchAPI(`/doctors/${id}`),
  
  // Patient endpoints
  getPatientById: (id: number) => fetchAPI(`/patients/${id}`),
  
  // Appointment endpoints
  createAppointment: (appointmentData: any) => 
    fetchAPI('/appointments', { method: 'POST', body: appointmentData }),
  getAppointments: () => fetchAPI('/appointments'),
  getPatientAppointments: (patientId: number) =>
    fetchAPI(`/patients/${patientId}/appointments`),
  getSpecializations: () => fetchAPI('/specializations'),

  verifyToken: () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      return fetchAPI('/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`
        }
      });
    }
};

export default api;