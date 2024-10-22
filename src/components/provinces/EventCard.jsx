import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';

const EventCard = ({ image, title, eventType, startDate, endDate}) => {
  return (
    <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px', 
                overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', position: 'relative' }}>
      <CardMedia component="img" height="350" image={image} alt={title} sx={{ objectFit: 'cover' }} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 150%)', 
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px' }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white', marginBottom: '4px' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
          {startDate} - {endDate}
        </Typography>
      </Box>
      <CardContent sx={{ 
        position: 'absolute',
        top: '16px',
        left: '16px',
        padding: 0,
      }}>
        <Chip label={eventType} size="medium" sx={{ fontSize: '0.75rem', fontWeight: 'bold', bgcolor: 'white', color: 'black' }} />
      </CardContent>
    </Card>
  );
};

export default EventCard;
