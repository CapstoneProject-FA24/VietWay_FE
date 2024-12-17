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

        console.log('Fetched Booking Data:', bookingData);

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
            transportation: bookingData.transportation,
            participants: bookingData.participants.map(participant => ({
                fullName: participant.fullName,
                phoneNumber: participant.phoneNumber,
                gender: participant.gender,
                dateOfBirth: new Date(participant.dateOfBirth),
                price: participant.price,
                PIN: participant.pin
            })),
            refundRequests: bookingData.refundRequests?.map(refund => ({
                refundAmount: refund.refundAmount,
                refundStatus: refund.refundStatus,
                refundDate: new Date(refund.refundDate)
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
                dateOfBirth: passenger.dateOfBirth,
                PIN: passenger.PIN
            })),
            contactFullName: bookingData.fullName,
            contactEmail: bookingData.email,
            contactPhoneNumber: bookingData.phone,
            contactAddress: bookingData.address,
            note: bookingData.note,
        };

        console.log('Request Data:', requestData);

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
                isReviewed: booking.isReviewed,
                havePendingRefund: booking.havePendingRefund
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

export const getBookingHistory = async (bookingId) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(
            `${baseURL}/api/bookings/${bookingId}/history`,
            {
                headers: {
                    'Authorization': `Bearer ${customerToken}`
                }
            }
        );
        return {
            statusCode: response.data.statusCode,
            message: response.data.message,
            data: response.data.data.map(history => ({
                modifierRole: history.modifierRole,
                reason: history.reason,
                action: history.action,
                timestamp: history.timestamp,
                oldStatus: history.oldStatus,
                newStatus: history.newStatus
            }))
        };
    } catch (error) {
        console.error('Error fetching booking history:', error);
        throw error;
    }
};

export const confirmTourChange = async (bookingId) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.patch(
            `${baseURL}/api/bookings/${bookingId}/confirm-tour-change`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${customerToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error confirming tour change:', error);
        throw error;
    }
};

export const denyTourChange = async (bookingId) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.patch(
            `${baseURL}/api/bookings/${bookingId}/deny-tour-change`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${customerToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error denying tour change:', error);
        throw error;
    }
};

export const fetchTourByBookingId = async (id) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(`${baseURL}/api/bookings/${id}/tour-info`,
            {
                headers: {
                    'Authorization': `Bearer ${customerToken}`
                }
            });
        const item = response.data.data;
        const tour = {
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            price: item.defaultTouristPrice,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            createdAt: new Date(item.createdAt),
            currentParticipant: item.currentParticipant,
            refundPolicies: item.refundPolicies.map(policy => ({
                cancelBefore: new Date(policy.cancelBefore),
                refundPercent: policy.refundPercent
            })),
            pricesByAge: item.pricesByAge.map(price => ({
                name: price.name,
                price: price.price,
                ageFrom: price.ageFrom,
                ageTo: price.ageTo
            })),
            registerOpenDate: new Date(item.registerOpenDate),
            registerCloseDate: new Date(item.registerCloseDate),
            depositPercent: item.depositPercent,
            paymentDeadline: new Date(item.paymentDeadline),
        };
        return tour;
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};

export const getBookingById = async (bookingId) => {
  try {
    const customerToken = getCookie('customerToken');
    const response = await axios.get(`${baseURL}/api/bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    
    // Make sure the API returns participant data including PIN
    return response.data;
  } catch (error) {
    console.error('Error fetching booking data:', error);
    throw error;
  }
};