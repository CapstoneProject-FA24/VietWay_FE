import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Slide, IconButton, Snackbar, Alert } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Link } from 'react-router-dom';
import SideSavedTab from '@components/saved/SideSavedTab';

const PostListCard = ({ post }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isSavedTabOpen, setIsSavedTabOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [savedCount, setSavedCount] = useState(0);
    const TEN_MINUTES = 10 * 60 * 1000;

    const handleUnbookmark = (postId) => {
        setIsBookmarked(false);
        setSavedCount(prev => prev - 1);
        setIsSavedTabOpen(false);
    };

    const handleCloseSavedTab = () => {
        setIsSavedTabOpen(false);
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowNotification(false);
    };

    const handleNotificationClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSavedTabOpen(true);
        setShowNotification(false);
    };

    const handleBookmarkClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isBookmarked) {
            setIsSavedTabOpen(true);
            return;
        }
        setIsBookmarked(true);
        setSavedCount(prev => prev + 1);
        setShowNotification(true);
        setIsSavedTabOpen(true);
    };

    return (
        <Card
            component={Link} to={`/bai-viet/${post.postId}`}
            sx={{
                maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px',
                overflow: 'hidden', boxShadow: '0 0px 8px rgba(0,0,0,0.3)', position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
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
                    <IconButton 
                    onClick={handleBookmarkClick}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'white', width: '35px', height: '35px', zIndex: 2,
                        '&:hover': { backgroundColor: 'white' } }}>
                    {isBookmarked ? (
                        <BookmarkIcon sx={{ color: 'primary.main', fontSize: '23px' }} />
                    ) : (
                        <BookmarkBorderIcon sx={{ color: '#666', fontSize: '23px' }} />
                        )}
                    </IconButton>
                </Box>
            </CardContent>

            {isSavedTabOpen && 
                <SideSavedTab 
                    onClose={handleCloseSavedTab} 
                    post={post}
                    isBookmarked={isBookmarked}
                    onUnbookmark={handleUnbookmark}
                    initialTab={1}
                />
            }

            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ position: 'fixed', top: '24px', right: '24px' }}>
                <Alert onClose={handleCloseNotification} severity="success" action={
                    <Typography
                        component="span"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNotificationClick(e);
                        }}
                        sx={{
                            cursor: 'pointer',
                            color: 'primary.main',
                            fontWeight: 600,
                            '&:hover': { textDecoration: 'underline' }
                        }}
                        >
                            Mở thanh lưu trữ
                        </Typography>
                    }
                    sx={{ 
                        width: '100%', 
                        bgcolor: 'white', 
                        color: 'black', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
                        '& .MuiAlert-icon': { color: 'success.main' },
                        '& .MuiAlert-action': { 
                            alignItems: 'center', 
                            paddingTop: 0,
                            marginLeft: 1 
                        }
                    }}
                >
                    Đã lưu vào lưu trữ của bạn ({savedCount} bài viết)
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default PostListCard;
