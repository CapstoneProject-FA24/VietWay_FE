import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchAttractionType = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/attraction-types`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};