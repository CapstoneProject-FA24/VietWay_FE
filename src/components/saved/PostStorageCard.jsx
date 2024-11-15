import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Slide, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';

const PostStorageCard = ({ post, isEditMode, isSelected, onSelect }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e) => {
        // If in edit mode and clicking the checkbox area, prevent navigation
        if (isEditMode && e.target.closest('.checkbox-area')) {
            e.preventDefault();
            return;
        }
    };

    return (
        <Card
            component={Link}
            to={`/bai-viet/${post.postId}`}
            onClick={handleClick}
            sx={{
                maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px',
                overflow: 'hidden', boxShadow: '0 0px 8px rgba(0,0,0,0.3)', position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isEditMode && (
                <Box
                    className="checkbox-area"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(post.postId);
                    }}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 2,
                    }}
                >
                    <Checkbox
                        checked={isSelected}
                        sx={{
                            color: 'white',
                            '&.Mui-checked': {
                                color: 'white',
                            },
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '4px',
                        }}
                    />
                </Box>
            )}
            <CardMedia component="img" height="270" image={post.imageUrl} alt={post.title} sx={{ objectFit: 'cover' }} />
            <Box sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: isHovered ? 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.85) 55%)' :
                    'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 72%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px'
            }}>
                <Chip
                    label={post.provinceName} size="medium" sx={{
                        fontSize: '0.75rem', fontWeight: 'bold', mr: 1, width: 'fit-content', mb: 0.5,
                        bgcolor: 'rgba(0,0,0,0.15)', color: 'white', height: '25px', border: '1px solid rgba(255,255,255)'
                    }} />
                <Typography variant="h4" component="div" sx={{
                    fontWeight: 'bold', fontSize: '1.2rem', color: 'white', mb: isHovered ? 0.5 : -0.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>
                    {post.title}
                </Typography>
                {isHovered && (
                    <Slide direction="up" in={isHovered}>
                        <Typography
                            variant="body2" sx={{
                                fontSize: '0.9rem', color: 'lightGray', mb: -0.2,
                                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                            }}>
                            {post.description}
                        </Typography>
                    </Slide>
                )}
            </Box>
            <CardContent sx={{
                position: 'absolute', top: '0px', left: '0px', width: '100%'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Chip
                        label={post.postCategory} size="medium" sx={{
                            fontSize: '0.8rem', fontWeight: 'bold',
                            bgcolor: 'rgba(255,255,255,0.8)', color: 'black', height: '25px'
                        }} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default PostStorageCard;
