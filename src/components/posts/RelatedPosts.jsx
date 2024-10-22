import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { fetchRelatedPosts } from '@hooks/MockPost';
import { PostsGrid } from '@components/provinces/PostsCard';

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
            <PostsGrid posts={relatedPosts}/>
        </Box>
    );
}
