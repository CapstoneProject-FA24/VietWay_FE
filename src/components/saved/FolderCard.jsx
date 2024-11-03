import React from 'react';
import { Card, CardMedia, Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';

const FolderCard = ({ trip, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        borderRadius: 2,
        p: 1,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 100,
          height: 100,
          borderRadius: 2,
          m: 1
        }}
        image={trip.image}
        alt={trip.title}
      />
      <Box sx={{ flex: 1, p: 0.5 }}>
        <Typography variant="h7" component="div" fontWeight={600}>
          {trip.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {trip.location}
          </Typography>
        </Box>
      </Box>
      {trip.isFavorite && (
        <Box sx={{ p: 1 }}>
          <FavoriteIcon sx={{ color: 'error.main' }} />
        </Box>
      )}
    </Card>
  );
};

export default FolderCard;
