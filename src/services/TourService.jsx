import axios from 'axios';
import baseURL from '@api/BaseURL';

export const fetchToursByTemplateId = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/tours?tourTemplateId=${id}`);
        const tours = response.data.data.map(item => ({
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            price: item.defaultTouristPrice,
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
        const response = await axios.get(`${baseURL}/api/tours/${id}`);
        const item = response.data.data;
        const tours = {
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            price: item.defaultTouristPrice,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status,
            refundPolicies: item.refundPolicies,
            pricesByAge: item.pricesByAge,
            registerOpenDate: item.registerOpenDate,
            registerCloseDate: item.registerCloseDate
        };
        return tours;
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};

export const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration || !duration.durationName) return null;

    try {
        const durationStr = duration.durationName;
        const nights = parseInt(durationStr.match(/\d+(?=\s*đêm)/)?.[0] || 0);
        const days = parseInt(durationStr.match(/\d+(?=\s*ngày)/)?.[0] || 0);

        if (isNaN(nights) || isNaN(days)) {
            console.error('Could not parse duration:', durationStr);
            return null;
        }

        let totalDuration;

        if (days > nights) {
            totalDuration = days - 1;
        } else if (days === nights) {
            totalDuration = days;
        } else {
            totalDuration = days;
        }

        const startDateTime = new Date(startDate);
        const endDate = new Date(startDateTime);
        endDate.setDate(startDateTime.getDate() + totalDuration);
        
        return endDate;
    } catch (error) {
        console.error('Error calculating end date:', error);
        return null;
    }
};