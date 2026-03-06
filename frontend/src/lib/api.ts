const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api';

export const apiCall = async (endpoint: string, options: any = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && endpoint !== '/auth/login') {
        localStorage.removeItem('accessToken');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    return response;
};
