import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(' Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        console.log(' Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error(' API Error:', error.response?.status, error.response?.data);
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getMe = () => api.get('/users/me');

export const register = (userData) => api.post('/api/auth/register', userData);
export const login = (userData) => api.post('/api/auth/login', userData);

export default api;