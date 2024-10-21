import baseURL from '@api/BaseURL'
import axios from 'axios';

export const fetchProvinces = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/provinces`);
        const provinces = response.data.data.map(province => ({
            provinceId: province.provinceId,
            provinceName: province.provinceName,
            imageURL: province.imageUrl
        }));
        return provinces;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};