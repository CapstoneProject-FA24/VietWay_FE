const baseURL = import.meta.env.VITE_API_URL;
import axios from 'axios';

export const login = async (credentials) => {
    try {
        const loginRequest = {
            emailOrPhone: credentials.email,
            password: credentials.password
        };
        const response = await axios.post(`${baseURL}/api/account/login`, loginRequest);
        const data = response.data;
        if (data.data) {
            setCookie('customerToken', data.data);
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
        const response = await axios.post(`${baseURL}/api/account/register`, registerRequest);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const loginWithGoogle = async (idToken) => {
    try {
        const response = await axios.post(`${baseURL}/api/account/login-with-google`, idToken, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        if (data.data) {
            setCookie('customerToken', data.data);
        }
        return data;
    } catch (error) {
        console.error('Google login failed:', error);
        throw error;
    }
};


export const registerWithGoogle = async (googleUserData) => {
    try {
        const registerRequest = {
            idToken: googleUserData.idToken,
            phoneNumber: googleUserData.phoneNumber,
            fullName: googleUserData.fullName,
            dateOfBirth: googleUserData.dateOfBirth,
            gender: googleUserData.gender,
            provinceId: googleUserData.provinceId
        };
        const response = await axios.post(`${baseURL}/api/account/register-with-google`, registerRequest);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Google registration failed:', error);
        throw error;
    }
};

export const setCookie = (name, value, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;secure;samesite=strict`;
};

export const getCookie = (name) => {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let cookie of cookies) {
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            const value = cookie.substring(cookieName.length);
            const expiresMatch = cookie.match(/expires=([^;]+)/);
            if (expiresMatch) {
                const expiryDate = new Date(expiresMatch[1]);
                if (expiryDate <= new Date()) {
                    removeCookie(name);
                    return null;
                }
            }
            return value;
        }
    }
    return null;
};

export const removeCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const requestPasswordReset = async (phoneNumber) => {
    try {
        const response = await axios.post(`${baseURL}/api/account/request-password-reset`, {
            phoneNumber: phoneNumber
        });
        return response;
    } catch (error) {
        console.error('Password reset request failed:', error);
        throw error;
    }
};

export const confirmResetPasswordOTP = async (phoneNumber, otp) => {
    try {
        const response = await axios.post(`${baseURL}/api/account/confirm-reset-password-otp`, {
            phoneNumber: phoneNumber,
            otp: otp
        });
        return response.data;
    } catch (error) {
        console.error('OTP confirmation failed:', error);
        throw error;
    }
};

export const resetPassword = async (phoneNumber, newPassword, token) => {
    try {
        const response = await axios.post(`${baseURL}/api/account/reset-password`, {
            phoneNumber: phoneNumber,
            newPassword: newPassword
        },
        {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Password reset failed:', error);
        throw error;
    }
};
