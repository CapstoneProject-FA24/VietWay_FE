import axios from 'axios';
import baseURL from '@api/BaseURL';

export const fetchAttractions = async (params) => {
    console.log(params);
    try {
        const queryParams = new URLSearchParams();

        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);

        if (params.attractionTypeIds && params.attractionTypeIds.length > 0) {
            params.attractionTypeIds.forEach(id => queryParams.append('attractionTypeIds', id));
        }

        if (params.provinceIds && params.provinceIds.length > 0) {
            params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        }

        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);

        const response = await axios.get(`${baseURL}/api/attractions?${queryParams.toString()}`);
        const items = response.data?.data?.items;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const attractions = items.map(item => ({
            attractionId: item.attractionId,
            name: item.name,
            address: item.address,
            province: item.province,
            attractionType: item.attractionType,
            status: item.status,
            createdDate: item.createdDate,
            creatorName: item.creatorName,
            imageUrl: item.imageUrl
        }));

        return {
            data: attractions,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        };

    } catch (error) {
        console.error('Error fetching attractions:', error);
        throw error;
    }
};

export const getAttractionById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/attractions/${id}`);
        const data = response.data.data;
        const attraction = {
            attractionId: data.attractionId,
            name: data.name,
            address: data.address,
            contactInfo: data.contactInfo,
            website: data.website,
            description: data.description,
            googlePlaceId: data.googlePlaceId,
            provinceId: data.province.provinceId,
            provinceName: data.province.provinceName,
            attractionTypeId: data.attractionCategory.attractionCategoryId,
            attractionTypeName: data.attractionCategory.name,
            images: data.images.map(image => ({
                imageId: image.imageId,
                url: image.url
            }))
        };
        return attraction;
    } catch (error) {
        console.error('Error fetching attraction:', error);
        throw error;
    }
};

