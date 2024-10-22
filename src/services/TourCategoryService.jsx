import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchTourCategory = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/tour-categories`);
        const tourCategories = response.data.data.map(item => ({
            tourCategoryId: item.tourTemplateId,
            tourCategoryName: item.name,
            description: item.description,
        }));
        return tourCategories;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};