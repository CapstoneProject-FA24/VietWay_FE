import baseURL from '@api/BaseURL';
import axios from 'axios';

const login = async (credentials) => {
    try {
        const response = await axios.get(`${baseURL}/Account/login`);
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token); // Save token to local storage or session storage
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
};