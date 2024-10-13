import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const ProvincePagesCard = ({ image, title, description }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="img" height="200" image={image} alt={title} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProvincePagesCard;
