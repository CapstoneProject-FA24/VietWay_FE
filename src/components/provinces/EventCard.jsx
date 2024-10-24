import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';

const EventCard = ({ event }) => {
  console.log(event);

  // Format the start and end dates
  const formattedStartDate = new Date(event.startDate).toLocaleDateString();
  const formattedEndDate = new Date(event.endDate).toLocaleDateString();

  return (
    <Card sx={{ 
      maxWidth: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: '10px', 
      overflow: 'hidden', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
      position: 'relative',
      '&:hover .details': { opacity: 1 }, // Show details on hover
    }}>
      <CardMedia component="img" height="350" image={event.imageUrl} alt={event.title} sx={{ objectFit: 'cover' }} />
      <Box className="overlay" sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'rgba(0, 0, 0, 0.7)', // Light dark overlay
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-end', 
        padding: '16px',
        opacity: 0, // Initially hidden
        transition: 'opacity 0.3s ease', // Smooth transition
        '&:hover': { opacity: 1 } // Show overlay on hover
      }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white', marginBottom: '4px' }}>
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
          {formattedStartDate} - {formattedEndDate}
        </Typography>
      </Box>
      <CardContent className="details" sx={{ 
        position: 'absolute',
        top: '16px',
        left: '16px',
        padding: 0,
        opacity: 0, // Initially hidden
        transition: 'opacity 0.3s ease' // Smooth transition
      }}>
        <Chip label={event.eventCategory} size="medium" sx={{ fontSize: '0.75rem', fontWeight: 'bold', bgcolor: 'white', color: 'black' }} />
      </CardContent>
    </Card>
  );
};

export default EventCard;
