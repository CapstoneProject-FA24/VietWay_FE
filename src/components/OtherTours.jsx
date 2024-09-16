import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getRandomTours } from '../hooks/MockTours';

const OtherTours = () => {
  const { id } = useParams();
  const allTours = getRandomTours(10); // Assuming getRandomTours can take a parameter for the number of tours
  const currentTourIndex = allTours.findIndex(tour => tour.id === id);
  
  // Get 5 tours, excluding the current one
  const getOtherTours = () => {
    let otherTours = [];
    for (let i = 1; i <= 5; i++) {
      let index = (currentTourIndex + i) % allTours.length;
      otherTours.push(allTours[index]);
    }
    return otherTours;
  };

  const tours = getOtherTours();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2, textAlign:'left', fontSize: '2rem' }}>
        Các tour du lịch khác
      </Typography>
      <Box sx={{ overflowX: 'auto', display: 'flex', pb: 2, width: '100%', position: 'relative' }}>
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap', width: 'max-content', margin: '0 auto' }}>
          {tours.map((tour) => (
            <Grid item key={tour.id}>
              <Card sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={Link} to={`/tour-du-lich/${tour.id}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={tour.images[0].url}
                    alt={tour.name}
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
                      {tour.destinationProvince}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{fontSize: 19, fontWeight: 500}}>
                      {tour.name}
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 1}}>
                      <Typography variant="body2" color="text.secondary" sx={{fontSize: 13}}>
                        {tour.days} ngày
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{fontSize: 13}}>
                        Giá: {tour.price.adult.toLocaleString()} VND
                      </Typography>
                    </Box>
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

export default OtherTours;
