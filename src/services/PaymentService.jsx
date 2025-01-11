import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';
export const fetchPaymentURL = async (bookingId, paymentMethod,isFullPayment) => {
    try {
        const customerToken = getCookie('customerToken');
        const response = await axios.get(`${baseURL}/api/bookings/${bookingId}/payment-url?paymentMethod=${paymentMethod}&isFullPayment=${isFullPayment}`, {
            headers: {
            'Authorization': `Bearer ${customerToken}`
        }});
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};


export const fetchCreatePayment = async (url, paymentMethod) => {
    try {
        let apiUrl;
        if (paymentMethod === 'ZaloPay') {
            apiUrl = `https://management-vietway.azurewebsites.net/api/booking-payments/ZaloPayCallback/local/${url}`;
        } else if (paymentMethod === 'VNPay'){
            apiUrl = `https://management-vietway.azurewebsites.net/api/booking-payments/VnPayIPN/${url}`;
        }
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error(`Error processing ${paymentMethod} payment:`, error);
        throw error;
    }
};