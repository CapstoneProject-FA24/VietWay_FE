import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, IconButton, Alert, Snackbar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import UnsavedConfirmPopup from '@components/saved/UnsavedConfirmPopup';
import { likeAttraction } from '@services/AttractionService';
import { getCookie } from '@services/AuthenService';

const AttractionCard = ({ attraction }) => {
    const [showNotification, setShowNotification] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isUnsaveConfirmOpen, setIsUnsaveConfirmOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isApiError, setIsApiError] = useState(false);

    useEffect(() => {
        setIsSaved(attraction.isLiked);
    }, [attraction.attractionId]);

    const handleLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const customerToken = getCookie('customerToken');
        if (!customerToken) {
            setIsApiError(true);
            setNotificationMessage('Vui lòng đăng nhập để lưu điểm tham quan');
            setShowNotification(true);
            return;
        }

        try {
            if (isSaved) {
                setIsUnsaveConfirmOpen(true);
            } else {
                await likeAttraction(attraction.attractionId, true);
                setIsSaved(true);
                setNotificationMessage('Đã lưu vào lưu trữ của bạn');
                setShowNotification(true);
            }
        } catch (error) {
            console.error('Error handling like:', error);
            setIsApiError(true);
            setNotificationMessage('Không thể lưu điểm tham quan. Vui lòng thử lại sau');
            setShowNotification(true);
        }
    };

    const handleUnsave = async () => {
        const customerToken = getCookie('customerToken');
        if (!customerToken) return;

        try {
            await likeAttraction(attraction.attractionId, false);
            setIsSaved(false);
            setIsUnsaveConfirmOpen(false);
            setNotificationMessage('Đã xóa khỏi lưu trữ của bạn');
            setShowNotification(true);
        } catch (error) {
            console.error('Error handling unsave:', error);
            setNotificationMessage('Không thể xóa điểm tham quan. Vui lòng thử lại sau');
            setShowNotification(true);
        }
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowNotification(false);
    };

    const handleOpenStorage = (e) => {
        e.preventDefault();
        window.open('/luu-tru', '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Card
                component={Link} to={`/diem-tham-quan/${attraction.attractionId}`}
                sx={{
                    maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px',
                    overflow: 'hidden', boxShadow: '0 0px 8px rgba(0,0,0,0.3)', position: 'relative'
                }}>
                <CardMedia component="img" height="270" image={attraction.imageUrl} alt={attraction.title} sx={{ objectFit: 'cover' }} />
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 65%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px'
                }}>
                    <Chip
                        label={attraction.province} size="medium" sx={{
                            fontSize: '0.75rem', fontWeight: 'bold', mr: 1, width: 'fit-content', mb: 0.5,
                            bgcolor: 'rgba(0,0,0,0.15)', color: 'white', height: '25px', border: '1px solid rgba(255,255,255)'
                        }} />
                    <Typography variant="h4" component="div" sx={{
                        fontWeight: 'bold', fontSize: '1.25rem', color: 'white', marginBottom: '4px',
                        overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                        {attraction.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ color: 'lightGray', marginRight: '8px', fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{
                            fontSize: '0.9rem', color: 'lightGray',
                            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}>
                            {attraction.address}
                        </Typography>
                    </Box>
                </Box>
                <CardContent sx={{ position: 'absolute', top: '16px', left: '16px', padding: 0 }}>
                    <Chip
                        label={attraction.attractionType} size="medium" sx={{
                            fontSize: '0.75rem', fontWeight: 'bold', bgcolor: 'rgba(255,255,255,0.8)', color: 'black', height: '25px'
                        }} />
                </CardContent>
                <IconButton
                    onClick={handleLikeClick}
                    sx={{
                        position: 'absolute', top: '16px', right: '16px', backgroundColor: 'white', width: '35px', height: '35px', zIndex: 2,
                        '&:hover': { backgroundColor: 'white' }
                    }}>
                    {isSaved ? (
                        <FavoriteIcon sx={{ color: 'red', fontSize: '23px' }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: '#666', fontSize: '23px' }} />
                    )}
                </IconButton>
            </Card>

            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    '& .MuiPaper-root': {
                        minWidth: '300px'
                    }
                }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={isApiError ? "error" : "success"}
                    sx={{ width: '100%', mt: 10, bgcolor: 'rgba(0, 0, 0, 0.8)', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '& .MuiAlert-icon': { color: '#4caf50' },
                        '& .MuiSvgIcon-root': { color: 'white' },
                        fontSize: '0.95rem', py: 1.5
                    }}
                    variant="filled"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {notificationMessage} {getCookie('customerToken') && (
                            <> - 
                                <Box
                                    component="span"
                                    onClick={handleOpenStorage}
                                    sx={{
                                        textDecoration: 'underline',
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.8
                                        }
                                    }}
                                >
                                    Mở lưu trữ
                                </Box>
                            </>
                        )}
                    </Box>
                </Alert>
            </Snackbar>

            <UnsavedConfirmPopup
                open={isUnsaveConfirmOpen}
                onClose={() => setIsUnsaveConfirmOpen(false)}
                onConfirm={handleUnsave}
            />
        </>
    );
};

export default AttractionCard;