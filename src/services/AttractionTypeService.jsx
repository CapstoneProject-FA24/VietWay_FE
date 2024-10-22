import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchAttractionType = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/attraction-types`);
        const attractionTypes = response.data.data.map(item => ({
            attractionTypeId: item.tourTemplateId,
            name: item.name,
            description: item.description,
        }));
        return attractionTypes;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};