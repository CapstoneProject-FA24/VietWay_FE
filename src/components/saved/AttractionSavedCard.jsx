import React from 'react';
import { Card, CardMedia, Box, Typography, Rating, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';

const AttractionSavedCard = ({ attraction, onUnlike }) => {
  const handleUnlike = (e) => {
    e.stopPropagation();
    onUnlike(attraction.id);
  };

  return (
    <Card sx={{ 
      display: 'flex', 
      borderRadius: 2, 
      p: 1, 
      cursor: 'pointer', 
      position: 'relative',
      '&:hover': { bgcolor: 'action.hover' } 
    }}>
      <CardMedia 
        component="img" 
        sx={{ width: 100, height: 100, borderRadius: 2, m: 1 }} 
        image={attraction.imageUrl} 
        alt={attraction.name} 
      />
      <Box sx={{ flex: 1, p: 0.5 }}>
        <Typography variant="h7" component="div" fontWeight={600} gutterBottom>
          {attraction.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {attraction.attractionType}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {attraction.address}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Rating value={attraction.rating || 5} readOnly size="small" sx={{ mr: 1 }} />
        </Box>
      </Box>
      <IconButton 
        onClick={handleUnlike}
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
        <FavoriteIcon sx={{ color: 'red', fontSize: '23px' }} />
      </IconButton>
    </Card>
  );
};

export default AttractionSavedCard;
