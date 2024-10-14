import baseURL from '@api/BaseURL';
import axios from 'axios';

export const login = async (credentials) => {
    try {
        const loginRequest = {
            email: credentials.email,
            password: credentials.password
        };
        const response = await axios.post(`${baseURL}/api/Account/Login`, loginRequest);
        const data = response.data;
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};