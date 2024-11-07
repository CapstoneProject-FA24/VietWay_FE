import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

export const fetchEventCategories = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/event-category`);
        const eventCategories = response.data.data.map(item => ({
            eventCategoryId: item.eventCategoryId,
            name: item.name,
            description: item.description,
        }));
        return eventCategories;
    } catch (error) {
        console.error('Error fetching event categories:', error);
        throw error;
    }
};