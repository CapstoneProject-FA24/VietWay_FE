import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchBookingData = async (bookingId) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(`${baseURL}/api/bookings/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        const bookingData = response.data.data;
        return {
            bookingId: bookingData.bookingId,
            tourId: bookingData.tourId,
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
            tourName: bookingData.tourName,
            imageUrl: bookingData.imageUrl,
            code: bookingData.code,
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

export const createBooking = async (bookingData) => {
    const customerToken = getCookie('customerToken');
    try {
        const requestData = {
            tourId: bookingData.tourId,
            numberOfParticipants: bookingData.passengers.length,
            tourParticipants: bookingData.passengers.map(passenger => ({
                fullName: passenger.fullName,
                phoneNumber: passenger.phoneNumber,
                gender: passenger.gender,
                dateOfBirth: passenger.dateOfBirth
            })),
            contactFullName: bookingData.fullName,
            contactEmail: bookingData.email,
            contactPhoneNumber: bookingData.phone,
            contactAddress: bookingData.address,
            note: bookingData.note,
        };
        const response = await axios.post(`${baseURL}/api/bookings`, requestData, {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const fetchBookingList = async (pageCount, pageIndex) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(`${baseURL}/api/bookings`, {
            params: {
                pageCount,
                pageIndex
            },
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        
        const bookingListData = response.data.data;
        return {
            total: bookingListData.total,
            pageSize: bookingListData.pageSize,
            pageIndex: bookingListData.pageIndex,
            items: bookingListData.items.map(booking => ({
                bookingId: booking.bookingId,
                tourId: booking.tourId,
                customerId: booking.customerId,
                numberOfParticipants: booking.numberOfParticipants,
                totalPrice: booking.totalPrice,
                status: booking.status,
                bookingDate: booking.createdOn,
                tourName: booking.tourName,
                imageUrl: booking.imageUrl,
                code: booking.code,
                startDate: booking.startDate,
            }))
        };
    } catch (error) {
        console.error('Error fetching booking list:', error);
        throw error;
    }
};

export const cancelBooking = async (bookingId, reason) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.patch(
            `${baseURL}/api/bookings/${bookingId}`,
            {
                reason: `${reason}`
            },
            {
                headers: {
                    'Authorization': `Bearer ${customerToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error canceling booking:', error);
        throw error;
    }
};
