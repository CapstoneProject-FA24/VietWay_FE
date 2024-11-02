import baseURL from '@api/BaseURL'
import axios from 'axios';

export const fetchProvinces = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/provinces`);
        const provinces = response.data.data.map(province => ({
            provinceId: province.provinceId,
            provinceName: province.name,
            imageURL: province.imageUrl
        }));
        return provinces;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const fetchProvinceWithCountDetails = async (params) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);

        const response = await axios.get(`${baseURL}/api/provinces/province-detail?${queryParams.toString()}`);
        const items = response.data?.data?.items;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const provinces = items.map(province => ({
            provinceId: province.provinceId,
            provinceName: province.provinceName,
            imageURL: province.imageUrl,
            postsCount: province.postsCount,
            eventsCount: province.eventsCount,
            toursCount: province.toursCount,
            attractionsCount: province.attractionsCount,
        }));

        return {
            data: provinces,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        };
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const fetchProvinceInfo = async (provinceId) => {
    try {
        const response = await axios.get(`${baseURL}/api/provinces/${provinceId}/images/?imageCount=20`);
        const provinceInfo = response.data.data;
        return {
            provinceId: provinceInfo.provinceId,
            provinceName: provinceInfo.name,
            imageUrls: provinceInfo.images.map(image => image.url)
        };
    } catch (error) {
        console.error('Error fetching province info:', error);
        throw error;
    }
};
