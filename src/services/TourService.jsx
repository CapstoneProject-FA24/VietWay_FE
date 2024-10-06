import axios from 'axios';
import baseURL from '@api/baseURL';

export const fetchToursByTemplateId = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/Tour/by-template-ids/${id}`, {
            params: {
                pageSize: 10,
                pageIndex: 1
            }
        });
        const tours = response.data.data.items.map(item => ({
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: item.startTime,
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
        const response = await axios.get(`${baseURL}/api/Tour/by-id/${id}`);
        const tours = {
            id: response.data.data.tourId,
            tourTemplateId: response.data.data.tourTemplateId,
            startLocation: response.data.data.startLocation,
            startTime: response.data.data.startTime,
            startDate: new Date(response.data.data.startDate),
            endDate: new Date(response.data.data.endDate),
            price: response.data.data.price,
            maxParticipant: response.data.data.maxParticipant,
            minParticipant: response.data.data.minParticipant,
            currentParticipant: response.data.data.currentParticipant,
            status: response.data.data.status
        };
        return tours;
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};