import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

export const fetchAttractionType = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/attraction-types`);
        const attractionTypes = response.data.data.map(item => ({
            attractionTypeId: item.attractionCategoryId,
            name: item.name,
            description: item.description,
        }));
        return attractionTypes;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};