import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Slide } from '@mui/material';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      component={Link} to={`/su-kien/${event.eventId}`}
      sx={{
        maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px',
        overflow: 'hidden', boxShadow: '0 0px 8px rgba(0,0,0,0.3)', position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardMedia component="img" height="270" image={event.imageUrl} alt={event.title} sx={{ objectFit: 'cover' }} />
      <Box sx={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: isHovered ? 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.9) 60%)' :
          'linear-gradient(to bottom, rgba(0,0,0,0) 42%, rgba(0,0,0,0.9) 78%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px'
      }}>
        <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
          {new Date(event.startDate).toLocaleDateString('vi-VN')} - {new Date(event.endDate).toLocaleDateString('vi-VN')}
        </Typography>
        <Typography variant="h4" component="div" sx={{
          fontWeight: 'bold', fontSize: '1.2rem', color: 'white', mb: isHovered ? 0.5 : -0.2,
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>
          {event.title}
        </Typography>
        {isHovered && (
          <Slide direction="up" in={isHovered}>
            <Typography
              variant="body2" sx={{
                fontSize: '0.9rem', color: 'lightGray', mb: -0.2,
                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
              }}>
              {event.description}
            </Typography>
          </Slide>
        )}
      </Box>
      <CardContent sx={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        padding: 0,
      }}>
        <Chip
          label={event.eventCategory} size="medium" sx={{
            fontSize: '0.75rem', fontWeight: 'bold',
            bgcolor: 'rgba(255,255,255,0.8)', color: 'black', height: '25px'
          }} />
      </CardContent>
    </Card>
  );
};

export default EventCard;