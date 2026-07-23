import axios from 'axios';

const baseURL = window.RUNTIME_CONFIG?.API_URL
    || import.meta.env.VITE_API_URL
    || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message = err.response?.data?.message || err.message;
        return Promise.reject(new Error(message));
    }
);
