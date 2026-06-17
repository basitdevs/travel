import axios from 'axios';

const apiRoot = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const baseURL = apiRoot.endsWith('/api') ? apiRoot : `${apiRoot}/api`;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  toggleWishlist: (tourId) => api.post(`/users/wishlist/${tourId}`),
  getAll: () => api.get('/users'),
  block: (id) => api.put(`/users/${id}/block`),
  delete: (id) => api.delete(`/users/${id}`),
};

export const tourAPI = {
  getAll: (params) => api.get('/tours', { params }),
  getById: (id) => api.get(`/tours/${id}`),
  getFeatured: () => api.get('/tours/featured'),
  create: (data) => api.post('/tours', data),
  update: (id, data) => api.put(`/tours/${id}`, data),
  delete: (id) => api.delete(`/tours/${id}`),
};

export const destinationAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getPopular: () => api.get('/destinations/popular'),
  getById: (id) => api.get(`/destinations/${id}`),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id) => api.delete(`/destinations/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getAll: () => api.get('/bookings/all'),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  getById: (id) => api.get(`/bookings/${id}`),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByTour: (tourId) => api.get(`/reviews/${tourId}`),
  getAll: () => api.get('/reviews/all'),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
