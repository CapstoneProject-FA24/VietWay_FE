import axios from 'axios';
import baseURL from '@api/BaseURL';
import { getCookie } from '@services/AuthenService';
const token = getCookie('token');

export const fetchBookingData = async (bookingId) => {
    try {
        const response = await axios.get(`${baseURL}/api/bookings/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const fetchBookingList = async (pageCount = 100, pageIndex = 1) => {
    try {
        const response = await axios.get(`${baseURL}/api/bookings`, {
            params: {
                pageCount,
                pageIndex
            },
            headers: {
                'Authorization': `Bearer ${token}`
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
                code: booking.code
            }))
        };
    } catch (error) {
        console.error('Error fetching booking list:', error);
        throw error;
    }
};
