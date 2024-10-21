import baseURL from '@api/BaseURL';
import axios from 'axios';

const getGender = (gender) => {
    switch (gender) {
        case 0: return 'Nữ';
        case 1: return 'Nam';
        default: return 'Khác';
    }
};

export const getCustomerInfo = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/Customer`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data.data);
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