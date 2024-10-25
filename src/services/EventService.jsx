import baseURL from '@api/BaseURL'
import axios from 'axios';

export const fetchEvents = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        
        if (params.eventCategoryIds && params.eventCategoryIds.length > 0) {
            params.eventCategoryIds.forEach(id => queryParams.append('eventCategoryIds', id));
        }
        
        if (params.provinceIds && params.provinceIds.length > 0) {
            params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        }
        
        if (params.startDateFrom) queryParams.append('startDateFrom', params.startDateFrom);
        if (params.startDateTo) queryParams.append('startDateTo', params.startDateTo);

        const response = await axios.get(`${baseURL}/api/events?${queryParams.toString()}`);
        const items = response.data?.data?.items;
        
        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const events = items.map(item => ({
            eventId: item.eventId,
            title: item.title,
            imageUrl: item.imageUrl,
            eventCategory: item.eventCategory,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            provinceName: item.provinceName,
            description: item.description,
            createdAt: item.createdAt
        }));
        
        return {
            data: events,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        };
        
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};