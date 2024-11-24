const baseURL = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { getCookie } from '@services/AuthenService';

const getGender = (gender) => {
    switch (gender) {
        case 0: return 'Nữ';
        case 1: return 'Nam';
        default: return 'Khác';
    }
};

export const getCustomerInfo = async () => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(`${baseURL}/api/Customer/profile`, {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        return {
            phone: response.data.data.phoneNumber,
            email: response.data.data.email,
            fullName: response.data.data.fullName,
            birthday: response.data.data.dateOfBirth,
            genderId: response.data.data.gender,
            genderName: getGender(response.data.data.gender),
            provinceId: response.data.data.provinceId,
            provinceName: response.data.data.provinceName,
            loginWithGoogle: response.data.data.loginWithGoogle,
        }
    } catch (error) {
        console.error('Get customer information failed:', error);
        throw error;
    }
};

export const updateCustomerInfo = async (customerData) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.put(`${baseURL}/api/Customer/profile`, {
            fullName: customerData.fullName,
            dateOfBirth: customerData.birthday,
            provinceId: customerData.provinceId,
            gender: customerData.genderId,
            email: customerData.email
        }, {
            headers: {
                'Authorization': `Bearer ${customerToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Update customer information failed:', error);
        throw error;
    }
};
