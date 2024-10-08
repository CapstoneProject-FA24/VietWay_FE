import axios from 'axios';
import baseURL from '@api/BaseURL';

export const fetchBookingData = async (bookingId) => {
    try {
        const response = await axios.get(`${baseURL}/api/Booking/${bookingId}`);
        const bookingData = response.data.data;
        return {
            bookingId: bookingData.bookingId,
            tourId: bookingData.tourId,
            customerId: bookingData.customerId,
            numberOfParticipants: bookingData.numberOfParticipants,
            contactFullName: bookingData.contactFullName,
            contactEmail: bookingData.contactEmail,
            contactPhoneNumber: bookingData.contactPhoneNumber,
            contactAddress: bookingData.contactAddress,
            totalPrice: bookingData.totalPrice,
            status: bookingData.status,
            createdOn: bookingData.createdOn,
            startLocation: bookingData.startLocation,
            startDate: new Date(bookingData.startDate),
            endDate: new Date(bookingData.endDate),
            tourName: bookingData.tourName,
            imageUrl: bookingData.imageUrl,
            participants: bookingData.participants.map(participant => ({
                fullName: participant.fullName,
                phoneNumber: participant.phoneNumber,
                gender: participant.gender,
                dateOfBirth: new Date(participant.dateOfBirth)
            }))
        };
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};


export const fetchPaymentURL = async (bookingId) => {
    try {
        const response = await axios.get(`${baseURL}/api/Payment/VnPay/${bookingId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};