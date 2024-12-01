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
            customerId: bookingData.customerId,
            numberOfParticipants: bookingData.numberOfParticipants,
            contactFullName: bookingData.contactFullName,
            contactEmail: bookingData.contactEmail,
            contactPhoneNumber: bookingData.contactPhoneNumber,
            contactAddress: bookingData.contactAddress,
            totalPrice: bookingData.totalPrice,
            paidAmount: bookingData.paidAmount,
            status: bookingData.status,
            createdOn: bookingData.createdOn,
            note: bookingData.note,
            startLocation: bookingData.startLocation,
            depositPercent: bookingData.depositPercent,
            paymentDeadline: new Date(bookingData.paymentDeadline),
            startDate: new Date(bookingData.startDate),
            durationName: bookingData.durationName,
            numberOfDay: bookingData.numberOfDay,
            tourName: bookingData.tourName,
            imageUrl: bookingData.imageUrl,
            code: bookingData.code,
            participants: bookingData.participants.map(participant => ({
                fullName: participant.fullName,
                phoneNumber: participant.phoneNumber,
                gender: participant.gender,
                dateOfBirth: new Date(participant.dateOfBirth),
                price: participant.price
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
                isReviewed: booking.isReviewed
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

export const fetchBookingPayments = async (bookingId, pageIndex = 1, pageSize = 10) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(`${baseURL}/api/bookings/${bookingId}/payments`, {
            params: {
                pageSize,
                pageIndex
            },
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });

        const paymentListData = response.data.data;
        return {
            total: paymentListData.total,
            pageSize: paymentListData.pageSize, 
            pageIndex: paymentListData.pageIndex,
            items: paymentListData.items.map(payment => ({
                paymentId: payment.paymentId,
                bookingId: payment.bookingId,
                amount: payment.amount,
                note: payment.note,
                createAt: payment.createAt,
                bankCode: payment.bankCode,
                bankTransactionNumber: payment.bankTransactionNumber,
                payTime: payment.payTime,
                thirdPartyTransactionNumber: payment.thirdPartyTransactionNumber,
                status: payment.status
            }))
        };
    } catch (error) {
        console.error('Error fetching booking payments:', error);
        throw error;
    }
};

export const submitBookingReview = async (bookingId, rating, content, isPublic) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.post(
            `${baseURL}/api/bookings/${bookingId}/review`,
            {
                rating,
                content,
                isPublic
            },
            {
                headers: {
                    'Authorization': `Bearer ${customerToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting booking review:', error);
        throw error;
    }
};

export const getBookingReview = async (bookingId) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(
            `${baseURL}/api/bookings/${bookingId}/review`,
            {
                headers: {
                    'Authorization': `Bearer ${customerToken}`
                }
            }
        );
        const reviewData = response.data.data;
        return {
            statusCode: 200,
            message: "Success",
            data: {
                reviewId: reviewData.reviewId,
                rating: reviewData.rating,
                review: reviewData.review,
                createdAt: reviewData.createdAt,
                reviewer: reviewData.reviewer
            }
        };
    } catch (error) {
        console.error('Error fetching booking review:', error);
        throw error;
    }
};