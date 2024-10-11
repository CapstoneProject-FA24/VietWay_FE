import baseURL from '@api/BaseURL'
import axios from 'axios';

export const fetchProvinces = async () => {
    try {
        const response = await axios.get(`https://localhost:7144/api/Province`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};