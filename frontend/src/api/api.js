import axios from 'axios';

const API_URL ='http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        if (error.code === 'ERR_NETWORK') {
            console.error('⚠️ Impossible de se connecter au serveur. Vérifie que le backend tourne sur le port 3000.');
        }
        return Promise.reject(error);
    }
);
export const getUsers = () => api.get('/users');    
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);   

export default api;