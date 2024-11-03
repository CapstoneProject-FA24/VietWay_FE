import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import SideSavedFolderTab from '@components/saved/SideSavedFolderTab';

const AttractionCard = ({ attraction }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSavedTabOpen, setIsSavedTabOpen] = useState(false);

    const handleLikeClick = (e) => {
        e.preventDefault();
        setIsLiked(!isLiked);
        setIsSavedTabOpen(true);
    };

    const handleCloseSavedTab = () => {
        setIsSavedTabOpen(false);
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
                            fontSize: '0.75rem', fontWeight: 'bold',
                            bgcolor: 'rgba(255,255,255,0.8)', color: 'black', height: '25px'
                        }} />
                </CardContent>
                <IconButton 
                    onClick={handleLikeClick}
                    sx={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'white', width: '35px', height: '35px', '&:hover': { backgroundColor: 'white', transform: 'scale(1.1)' }, zIndex: 2 }}>
                    {isLiked ? (
                        <FavoriteIcon sx={{ color: 'red', fontSize: '23px' }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: '#666', fontSize: '23px' }} />
                    )}
                </IconButton>
            </Card>
            
            {isSavedTabOpen && (
                <SideSavedFolderTab 
                    onClose={handleCloseSavedTab} 
                    attraction={attraction}
                    isLiked={isLiked}
                />
            )}
        </>
    );
};

export default AttractionCard;