import axios from 'axios';
import baseURL from '@api/baseURL';

export const fetchToursByTemplateId = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/Tour?tourTemplateId=${id}`);
        const tours = response.data.data.map(item => ({
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            price: item.price,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status
        }));
        return tours;
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};

export const fetchTourById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/Tour/${id}`);
        const item = response.data.data;
        const tours = {
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            price: item.price,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status
        };
        return tours;
    } catch (error) {
        console.error('Error fetching tour:', error);
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
