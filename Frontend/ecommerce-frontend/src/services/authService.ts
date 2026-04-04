import axios from 'axios';

const API_URL = '/api/auth';

export const register = async (userData: { name: string; email: string; password: string; confirmPassword: string }) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const login = async (userData: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};