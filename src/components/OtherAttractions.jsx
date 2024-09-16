import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { mockAttractions } from '../hooks/MockAttractions';

const OtherAttractions = () => {
  // Use the imported mockAttractions data
  const attractions = mockAttractions.map(attraction => ({
    id: attraction.id,
    title: attraction.name,
    province: attraction.province,
    image: attraction.images[0].url
  }));

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2, textAlign:'left', fontSize: '2rem' }}>
        Các điểm tham quan nổi bật khác
      </Typography>
      <Box sx={{ overflowX: 'auto', display: 'flex', pb: 2, width: '100%', position: 'relative' }}>
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap', width: 'max-content', margin: '0 auto' }}>
          {attractions.map((attraction) => (
            <Grid item key={attraction.id}>
              <Card sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={Link} to={`/diem-tham-quan/${attraction.id}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={attraction.image}
                    alt={attraction.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/path/to/fallback/image.jpg'; // Replace with your fallback image path
                    }}
                    sx={{
                      objectFit: 'cover',
                      aspectRatio: '16 / 9',
                      padding: 1,
                      borderRadius: 3,
                    }}
                  />
                  <CardContent sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{fontSize: 13}}>
                      {attraction.province}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{fontSize: 19, fontWeight: 500}}>
                      {attraction.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default OtherAttractions;
