import axios from 'axios';

const baseURL = window.RUNTIME_CONFIG?.APPOINTMENT_API_URL
    || import.meta.env.VITE_APPOINTMENT_API_URL
    || 'http://localhost:5001/api';

const appointmentApi = axios.create({ baseURL });

appointmentApi.interceptors.response.use(
    (res) => res,
    (err) => {
        const message = err.response?.data?.message || err.message;
        return Promise.reject(new Error(message));
    }
);

export default appointmentApi;
