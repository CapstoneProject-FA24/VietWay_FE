import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { fetchPosts } from '@services/PostService';
import PostCard from '@components/provinces/PostCard';

const RelatedPosts = ({ provinceId, currentPostId }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);
    useEffect(() => {
        const loadRelatedPosts = async () => {
            const params = {
                pageSize: 10,
                pageIndex: 1,
                provinceIds: [provinceId]
            };
            const response = await fetchPosts(params);
            const posts = response.data.filter(post => post.postId !== currentPostId);
            setRelatedPosts(posts);
        };
        loadRelatedPosts();
    }, [provinceId, currentPostId]);

    if (relatedPosts.length === 0) return null;

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bài viết liên quan
            </Typography>
            <Grid container spacing={2}>
                {relatedPosts.length > 0 ? (
                    relatedPosts.map((post) => (
                        <Grid item xs={12} md={4} key={post.postId}> <PostCard post={post} /> </Grid>
                    ))
                ) : (
                    <Box sx={{ minHeight: '30rem', width: '100%' }}>
                        <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}> Không tìm thấy bài viết nào!</Typography>
                    </Box>
                )}
            </Grid>
        </Box>
    );
}

export default RelatedPosts;