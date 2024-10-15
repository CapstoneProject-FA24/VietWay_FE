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

export const register = async (userData) => {
    try {
        const registerRequest = {
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
            fullName: userData.fullName,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            provinceId: userData.provinceId
        };
        const response = await axios.post(`${baseURL}/api/Account/CreateCustomerAccount`, registerRequest);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};