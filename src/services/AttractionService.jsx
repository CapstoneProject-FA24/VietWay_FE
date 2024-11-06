import axios from 'axios';
import baseURL from '@api/BaseURL';
import { getCookie } from '@services/AuthenService';

export const fetchAttractions = async (params) => {
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
            attractionType: item.attractionCategory,
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

export const getAttractionReviews = async (attractionId, params) => {
    const customerToken = getCookie('customerToken');
    try {
        const queryParams = new URLSearchParams();

        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex);
        if (params.isOrderedByLikeNumber !== undefined) {
            queryParams.append('isOrderedByLikeNumber', params.isOrderedByLikeNumber);
        }
        if (params.isOrderedByCreatedDate !== undefined) {
            queryParams.append('isOrderedByCreatedDate', params.isOrderedByCreatedDate);
        }
        if (params.hasReviewContent) queryParams.append('hasReviewContent', params.hasReviewContent);
        if (params.ratingValues && params.ratingValues.length > 0) {
            params.ratingValues.forEach(rating => queryParams.append('ratingValue', rating));
        }

        const response = await axios.get(`${baseURL}/api/attractions/${attractionId}/reviews?${queryParams.toString()}`,
        {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        return {
            total: response.data.data.total,
            pageSize: response.data.data.pageSize,
            pageIndex: response.data.data.pageIndex,
            items: response.data.data.items.map(item => ({
                reviewId: item.reviewId,
                rating: item.rating,
                review: item.review,
                createdAt: item.createdAt,
                reviewer: item.reviewer,
                likeCount: item.likeCount
            }))
        };
    } catch (error) {
        console.error('Error getting attraction reviews:', error);
        throw error;
    }
};

export const getCurrentCustomerAttractionReviews = async (attractionId) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.get(`${baseURL}/api/attractions/${attractionId}/customer-reviews`, {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        return {
            reviewId: response.data.data.reviewId,
            rating: response.data.data.rating,
            review: response.data.data.review,
            createdAt: response.data.data.createdAt,
            reviewer: response.data.data.reviewer,
            likeCount: response.data.data.likeCount
        };
    } catch (error) {
        console.error('Error getting attraction reviews:', error);
        throw error;
    }
};

export const addAttractionReview = async (attractionId, reviewData) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.post(`${baseURL}/api/attractions/${attractionId}/customer-reviews`, {
            rating: reviewData.rating,
            review: reviewData.review
        },
        {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding attraction review:', error);
        throw error;
    }
};


export const updateAttractionReview = async (attractionId, reviewData) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.put(`${baseURL}/api/attractions/${attractionId}/customer-reviews`, {
            rating: reviewData.rating,
            review: reviewData.review
        },
        {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding attraction review:', error);
        throw error;
    }
};
