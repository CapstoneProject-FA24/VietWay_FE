import React from 'react';
import { Card, CardMedia, Box, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const PostSavedCard = ({ post, onUnbookmark }) => {
    const handleUnbookmark = (e) => {
        e.stopPropagation();
        onUnbookmark(post.id);
    };

    return (
        <Card sx={{ 
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
            <Box sx={{ flex: 1, p: 0.5, paddingLeft: 0.5}}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', paddingRight: 5 }}>
                    <Typography variant="h7" component={Link} to={`/bai-viet/${post.id}`} fontWeight={600} gutterBottom>
                        {post.title}
                    </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {post.category}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {post.province}
                    </Typography>
                </Box>
            </Box>
            <IconButton 
                onClick={handleUnbookmark}
                sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', width: '35px', height: '35px', '&:hover': { backgroundColor: 'white' } }}
            >
                <BookmarkIcon sx={{ color: 'primary.main', fontSize: '23px' }} />
            </IconButton>
        </Card>
    );
};

export default PostSavedCard;
