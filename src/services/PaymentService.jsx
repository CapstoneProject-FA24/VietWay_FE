import axios from 'axios';
import baseURL from '@api/BaseURL';
import { getCookie } from '@services/AuthenService';
export const fetchPaymentURL = async (bookingId) => {
    try {
        const customerToken = getCookie('customerToken');
        const response = await axios.get(`${baseURL}/api/bookings/${bookingId}/payment-url?paymentMethod=0`, {
            headers: {
            'Authorization': `Bearer ${customerToken}`
        }});
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};


export const fetchCreatePayment = async (url) => {
    try {
        console.log(url);
        const response = await axios.get(`https://localhost:7144/api/BookingPayment/VnPayIPN/${url}` );
        return response.data;
    } catch (error) {
        console.error('Error processing VnPay IPN:', error);
        throw error;
    }
};