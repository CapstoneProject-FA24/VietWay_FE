const baseURL = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { getCookie } from '@services/AuthenService';

export const fetchPosts = async (params) => {
    const customerToken = getCookie('customerToken');
    try {
        const queryParams = new URLSearchParams();
        
        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        
        if (params.postCategoryIds && params.postCategoryIds.length > 0) {
            params.postCategoryIds.forEach(id => queryParams.append('postCategoryIds', id));
        }
        
        if (params.provinceIds && params.provinceIds.length > 0) {
            params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        }

        const headers = {};
        if (customerToken) {
            headers['Authorization'] = `Bearer ${customerToken}`;
        }

        const response = await axios.get(`${baseURL}/api/post?${queryParams.toString()}`, { headers });
        const items = response.data?.data?.items;
        
        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const posts = items.map(item => ({
            postId: item.postId,
            title: item.title,
            imageUrl: item.imageUrl,
            postCategory: item.postCategoryName,
            createdAt: new Date(item.createdAt),
            provinceName: item.provinceName,
            description: item.description,
            isLiked: item.isLiked
        }));
        
        return {
            data: posts,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        };
        
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};


export const fetchPostById = async (id) => {
    const customerToken = getCookie('customerToken');
    try {
        const headers = {};
        if (customerToken) {
            headers['Authorization'] = `Bearer ${customerToken}`;
        }

        const response = await axios.get(`${baseURL}/api/post/${id}`, { headers });
        const item = response.data.data;
        
        const post = {
            id: item.postId,
            title: item.title,
            image: item.imageUrl,
            content: item.content,
            category: item.postCategoryName,
            createDate: item.createdAt,
            provinceId: item.provinceId,
            provinceName: item.provinceName,
            isEvent: item.isEvent || false,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            isLiked: item.isLiked
        };
        
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

export const likePost = async (postId, isLike) => {
    const customerToken = getCookie('customerToken');
    try {
        const response = await axios.patch(`${baseURL}/api/post/${postId}/like`, {
            isLike: isLike
        }, {
            headers: {
                'Authorization': `Bearer ${customerToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

export const fetchLikedPosts = async (pageSize = 10, pageIndex = 1) => {
    const customerToken = getCookie('customerToken');
    try {
        const headers = {};
        if (customerToken) {
            headers['Authorization'] = `Bearer ${customerToken}`;
        }

        const response = await axios.get(`${baseURL}/api/post/liked`, {
            headers,
            params: {
                pageSize: pageSize,
                pageIndex: pageIndex
            }
        });
        const data = response.data.data;
        const likedPosts = data.items.map(item => ({
            postId: item.postId,
            title: item.title,
            imageUrl: item.imageUrl,
            postCategoryName: item.postCategoryName,
            provinceName: item.provinceName,
            description: item.description,
            isLiked: item.isLiked,
            createdAt: item.createdAt
        }));
        return {
            total: data.total,
            pageSize: data.pageSize,
            pageIndex: data.pageIndex,
            items: likedPosts
        };
    } catch (error) {
        console.error('Error fetching liked posts:', error);
        throw error;
    }
};
