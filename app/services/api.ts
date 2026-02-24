import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2313',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (credentials: any) => {
    return api.post('/auth/admin/login', credentials);
};

export const getFamilies = async () => {
    return api.get('/family/all');
};

export const createFamily = async (data: any) => {
    return api.post('/family', data);
};

export const getFamily = async (id: string) => {
    return api.get(`/family/${id}`);
};

export const updateFamily = async (id: string, data: any) => {
    return api.patch(`/family/${id}`, data);
};

// Generic helper to create a user (either parent or child)
export const addUser = async (data: any) => {
    return api.post('/user', data);
};

// legacy export, kept for backwards compatibility
export const addParent = async (data: any) => {
    return api.post('/user', { ...data, isParent: true });
};

export const getUsers = async (familyId?: string) => {
    const query = familyId ? `?familyId=${familyId}` : '';
    return api.get(`/user/all${query}`);
};

export const getCourses = async () => {
    return api.get('/course/all');
};

export const getMetrics = async (params: {
    familyId?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
} = {}) => {
    const query = new URLSearchParams();
    if (params.familyId) query.append('familyId', params.familyId);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.date) query.append('date', params.date);
    return api.get(`/attendance/metrics?${query.toString()}`);
};

// returns min/max attendance date range optionally filtered by family
export const getAttendanceRange = async (familyId?: string) => {
    const config = familyId ? { params: { familyId } } : undefined;
    return api.get('/attendance/range', config);
};

// Admin Management (Super Admin)
export const getAdmins = async () => {
    return api.get('/admin');
};

export const createAdmin = async (data: any) => {
    return api.post('/admin', data);
};

export const deleteAdmin = async (id: string) => {
    return api.delete(`/admin/${id}`);
};

export default api;
