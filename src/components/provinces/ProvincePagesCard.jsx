import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ProvincePagesCard = ({ attraction }) => {
  return (
    <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', border: 'none' }}>
      <CardMedia component="img" height="250" image={attraction.imageUrl} alt={attraction.name} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Chip
          label={attraction.attractionType} size="small"
          sx={{ alignSelf: 'flex-start', mb: 1, fontSize: '1rem', pt: 1.8, pb: 1.8, pl: 0.5, pr: 0.5 }}
        />
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {attraction.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon sx={{ fontSize: 'medium', mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {attraction.address}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProvincePagesCard;
