import axios from 'axios';
import baseURL from '@api/BaseURL';

export const fetchPaymentURL = async (bookingId) => {
    try {
        const response = await axios.get(`${baseURL}/api/Payment/VnPay/${bookingId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};