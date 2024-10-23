import axios from 'axios';
import baseURL from '@api/BaseURL';

export const fetchPaymentURL = async (bookingId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/payments/${bookingId}/vnpay`, {
            headers: {
            'Authorization': `Bearer ${token}`
        }});
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};


export const fetchCreatePayment = async (url) => {
    try {
        const response = await axios.get(`https://localhost:7144/api/BookingPayment/${url}` );
        return response.data;
    } catch (error) {
        console.error('Error processing VnPay IPN:', error);
        throw error;
    }
};