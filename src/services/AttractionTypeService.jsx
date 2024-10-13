import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchAttractionType = async () => {
    try {
        const response = await axios.get(`https://localhost:7144/api/AttractionType`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};