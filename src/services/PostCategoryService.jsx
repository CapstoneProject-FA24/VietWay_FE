import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

export const fetchPostCategories = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/post-category`);
        const postCategories = response.data.data.map(item => ({
            postCategoryId: item.postCategoryId,
            name: item.name,
            description: item.description,
        }));
        return postCategories;
    } catch (error) {
        console.error('Error fetching post categories:', error);
        throw error;
    }
};