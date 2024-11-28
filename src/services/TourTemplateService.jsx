import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

const getStatusText = (status) => {
    switch (status) {
        case 0: return 'Bản nháp';
        case 1: return 'Chờ duyệt';
        case 2: return 'Đã duyệt';
        case 3: return 'Từ chối';
        default: return 'Không xác định';
    }
};

export const fetchTourTemplates = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        
        if (params.templateCategoryIds && params.templateCategoryIds.length > 0) {
            params.templateCategoryIds.forEach(id => queryParams.append('templateCategoryIds', id));
        }
        
        if (params.provinceIds && params.provinceIds.length > 0) {
            params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        }
        
        if (params.numberOfDay && params.numberOfDay.length > 0) {
            params.numberOfDay.forEach(day => queryParams.append('numberOfDay', day));
        }
        
        if (params.startDateFrom) queryParams.append('startDateFrom', params.startDateFrom);
        if (params.startDateTo) queryParams.append('startDateTo', params.startDateTo);
        
        if (params.minPrice) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
        
        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);

        const response = await axios.get(`${baseURL}/api/tour-templates?${queryParams.toString()}`);
        const items = response.data?.data.items;
        
        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const templates = items.map(item => ({
            tourTemplateId: item.tourTemplateId,
            code: item.code,
            tourName: item.tourName,
            duration: item.duration,
            tourCategory: item.tourCategory,
            provinces: item.provinces,
            imageUrl: item.imageUrl,
            minPrice: item.minPrice,
            startDates: item.startDate.sort((a, b) => new Date(a) - new Date(b))
        }));
        
        return ({
            data: templates,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        })
        
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};

export const fetchTourTemplateById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/tour-templates/${id}`);
        return {
            tourTemplateId: response.data.data.tourTemplateId,
            code: response.data.data.code,
            tourName: response.data.data.tourName,
            description: response.data.data.description,
            duration: response.data.data.duration.durationName,
            numberOfDay: response.data.data.duration.numberOfDay,
            tourCategoryId: response.data.data.tourCategory.tourCategoryId,
            tourCategoryName: response.data.data.tourCategory.name,
            policy: response.data.data.policy,
            note: response.data.data.note,
            status: response.data.data.status,
            statusName: getStatusText(response.data.data.status),
            createdDate: response.data.data.createdDate,
            creatorName: response.data.data.creatorName,
            provinces: response.data.data.provinces,
            schedule: response.data.data.schedules,
            imageUrls: response.data.data.images
        };
    } catch (error) {
        console.error('Error fetching tour template:', error);
        throw error;
    }
};

export const fetchToursByAttractionId = async (attractionId, previewCount) => {
    try {
        const response = await axios.get(`${baseURL}/api/attractions/${attractionId}/tour-templates?previewCount=${previewCount}`);
        const items = response.data.data;
        if (!Array.isArray(items)) {
            throw new Error('Invalid response structure: tourTemplates not found or not an array');
        }
        const templates = items.map(item => ({
            tourTemplateId: item.tourTemplateId,
            code: item.code,
            tourName: item.tourName,
            duration: item.duration,
            tourCategory: item.tourCategory,
            provinces: item.provinces,
            imageUrl: item.imageUrl,
            price: item.price
        }));
        return templates;
    } catch (error) {
        console.error('Error fetching tour templates by attraction ID:', error);
        throw error;
    }
};

export const fetchTourReviews = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.ratingValues && params.ratingValues.length > 0) {
            params.ratingValues.forEach(value => queryParams.append('ratingValue', value));
        }
        
        if (params.hasReviewContent !== undefined) {
            queryParams.append('hasReviewContent', params.hasReviewContent);
        }
        
        if (params.pageSize) {
            queryParams.append('pageSize', params.pageSize);
        }
        
        if (params.pageIndex) {
            queryParams.append('pageIndex', params.pageIndex);
        }
        
        const response = await axios.get(`${baseURL}/api/tour-templates/${params.tourTemplateId}/reviews?${queryParams.toString()}`);
        const data = response.data.data;
        return {
            total: data.total,
            pageSize: data.pageSize,
            pageIndex: data.pageIndex,
            items: data.items.map(item => ({
                reviewId: item.reviewId,
                rating: item.rating,
                review: item.review,
                createdAt: item.createdAt,
                reviewer: item.reviewer
            }))
        };
    } catch (error) {
        console.error('Error fetching tour reviews:', error);
        throw error;
    }
};
