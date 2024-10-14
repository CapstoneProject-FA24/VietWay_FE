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
            customerId: "4",
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
        const response = await axios.post(`${baseURL}/api/Booking/BookTour`, requestData);

        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};