import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { fetchRelatedPosts } from '@hooks/MockPost';
import PostCard from './PostCard';

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
            <Typography variant="h5" gutterBottom>
                Bài viết liên quan
            </Typography>
            <Grid container spacing={2}>
                {relatedPosts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <PostCard post={post} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

