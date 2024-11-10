import React from 'react';
import { Card, CardMedia, Box, Typography, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const PostSavedCard = ({ post, onUnbookmark }) => {
    const handleUnbookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onUnbookmark(post.postId);
    };

    const handleCardClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Card 
            onClick={handleCardClick}
            sx={{ 
                display: 'flex', 
                borderRadius: 2, 
                p: 1, 
                cursor: 'pointer',
                position: 'relative',
                '&:hover': { bgcolor: 'action.hover' } 
            }}
        >
            <CardMedia 
                component="img"
                sx={{ width: 100, height: 100, borderRadius: 2, m: 1 }}
                image={post.imageUrl}
                alt={post.title}
            />
            <Box sx={{ flex: 1, pt: 0.5, pr: 3.5 }}>
                <Typography variant="h7" component="div" fontWeight={600} gutterBottom>
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    {post.postCategory}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {post.provinceName}
                    </Typography>
                </Box>
            </Box>
            <IconButton 
                onClick={handleUnbookmark}
                sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'white',
                    width: '35px',
                    height: '35px',
                    '&:hover': {
                        backgroundColor: 'white'
                    }
                }}
            >
                <BookmarkIcon sx={{ color: 'primary.main', fontSize: '23px' }} />
            </IconButton>
        </Card>
    );
};

export default PostSavedCard;
