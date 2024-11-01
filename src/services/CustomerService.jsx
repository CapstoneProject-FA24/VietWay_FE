import baseURL from '@api/BaseURL';
import axios from 'axios';
import { getCookie } from '@services/AuthenService';
const token = getCookie('token');

const getGender = (gender) => {
    switch (gender) {
        case 0: return 'Nữ';
        case 1: return 'Nam';
        default: return 'Khác';
    }
};

export const getCustomerInfo = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/Customer/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
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
            provinceName: response.data.data.provinceName
        }
    } catch (error) {
        console.error('Get customer information failed:', error);
        throw error;
    }
};

export const updateCustomerInfo = async (customerData) => {
    try {
        const response = await axios.put(`${baseURL}/api/Customer/profile`, {
            fullName: customerData.fullName,
            dateOfBirth: customerData.birthday,
            provinceId: customerData.provinceId,
            gender: customerData.genderId,
            email: customerData.email
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Update customer information failed:', error);
        throw error;
    }
};
