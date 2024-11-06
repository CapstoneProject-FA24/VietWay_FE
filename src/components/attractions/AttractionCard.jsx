import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, IconButton, Alert, Snackbar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import SideSavedTab from '@components/saved/SideSavedTab';

const AttractionCard = ({ attraction }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSavedTabOpen, setIsSavedTabOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [savedCount, setSavedCount] = useState(0);
    const TEN_MINUTES = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Check if attraction is liked on component mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
        const isAttractionSaved = saved.some(item => item.id === attraction.attractionId);
        setIsLiked(isAttractionSaved);
    }, [attraction.attractionId]);

    const handleLikeClick = (e) => {
        e.preventDefault();
        
        if (isLiked) {
            setIsSavedTabOpen(true);
            return;
        }

        setIsLiked(true);
        
        const lastShownTime = localStorage.getItem('savedTabLastShown');
        const currentTime = Date.now();
        
        if (!lastShownTime || (currentTime - parseInt(lastShownTime)) >= TEN_MINUTES) {
            setIsSavedTabOpen(true);
            localStorage.setItem('savedTabLastShown', currentTime.toString());
            setSavedCount(1);
        } else {
            setSavedCount(prev => prev + 1);
            setShowNotification(true);
        }

        const saved = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
        if (!saved.some(item => item.id === attraction.attractionId)) {
            const newSaved = [{
                id: attraction.attractionId,
                name: attraction.name,
                imageUrl: attraction.imageUrl,
                address: attraction.address,
                province: attraction.province,
                attractionType: attraction.attractionType,
                rating: attraction.rating || 5
            }, ...saved];
            localStorage.setItem('savedAttractions', JSON.stringify(newSaved));
        }
    };

    const handleUnlike = (attractionId) => {
        setIsLiked(false);
        const saved = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
        const newSaved = saved.filter(item => item.id !== attractionId);
        localStorage.setItem('savedAttractions', JSON.stringify(newSaved));
    };

    // Update isLiked state whenever savedAttractions changes in localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const saved = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
            const isAttractionSaved = saved.some(item => item.id === attraction.attractionId);
            setIsLiked(isAttractionSaved);
        };

        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);
        // Initial check
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [attraction.attractionId]);

    const handleCloseSavedTab = () => {
        setIsSavedTabOpen(false);
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowNotification(false);
    };

    const handleNotificationClick = () => {
        setIsSavedTabOpen(true);
        setShowNotification(false);
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
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'lightGray',
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
                    sx={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'white', width: '35px', height: '35px', zIndex: 2,
                        '&:hover': { backgroundColor: 'white' } }}>
                    {isLiked ? (
                        <FavoriteIcon sx={{ color: 'red', fontSize: '23px' }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: '#666', fontSize: '23px' }} />
                    )}
                </IconButton>
            </Card>
            
            {isSavedTabOpen && <SideSavedTab onClose={handleCloseSavedTab} attraction={attraction} isLiked={isLiked} onUnlike={handleUnlike} />}

            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ position: 'fixed', top: '24px', right: '24px' }}>
                <Alert onClose={handleCloseNotification} severity="success" action={
                    <Typography
                        component="span"
                        sx={{
                            cursor: 'pointer',
                            color: 'primary.main',
                            fontWeight: 600,
                            '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={handleNotificationClick}
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
                    Đã lưu vào lưu trữ của bạn ({savedCount} địa điểm)
                </Alert>
            </Snackbar>
        </>
    );
};

export default AttractionCard;