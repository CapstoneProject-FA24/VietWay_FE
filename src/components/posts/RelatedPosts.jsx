import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { fetchRelatedPosts } from '@hooks/MockPost';
import PostCard from '@components/provinces/PostCard';

export default function RelatedPosts({ provinceId, currentPostId }) {
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        const loadRelatedPosts = async () => {
            const posts = await fetchRelatedPosts(provinceId, currentPostId);
            setRelatedPosts(posts);
        };
        loadRelatedPosts();
    }, [provinceId, currentPostId]);

    if (relatedPosts.length === 0) return null;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bài viết liên quan
            </Typography>
            {/* <PostCard posts={relatedPosts}/> */}
        </Box>
    );
}
