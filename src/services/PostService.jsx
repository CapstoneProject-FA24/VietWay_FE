const baseURL = import.meta.env.VITE_API_URL;
import axios from 'axios';

export const fetchPosts = async (params) => {
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

        const response = await axios.get(`${baseURL}/api/post?${queryParams.toString()}`);
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
            description: item.description
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
    try {
        const response = await axios.get(`${baseURL}/api/post/${id}`);
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
            description: item.description
        };
        
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};