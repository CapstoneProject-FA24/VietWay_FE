import axios from 'axios';
import baseURL from '@api/baseURL';

export const fetchToursByTemplateId = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/Tour/by-template-ids`, {
            params: {
                tourTemplateIds: id,
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
        console.error('Error fetching tour template:', error);
        throw error;
    }
};