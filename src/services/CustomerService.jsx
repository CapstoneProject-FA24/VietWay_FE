import baseURL from '@api/baseURL';
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
        const response = await axios.get(`${baseURL}/api/Customer`);
        return {
            phone: response.data.data.phoneNumber,
            email: response.data.data.email,
            fullName: response.data.data.fullName,
            birthday: response.data.data.dateOfBirth,
            genderId: response.data.data.gender,
            genderName: getGender(response.data.data.gender),
        }
    } catch (error) {
        console.error('Get customer information failed:', error);
    }
};