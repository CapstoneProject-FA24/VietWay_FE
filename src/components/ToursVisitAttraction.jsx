import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { mockTours } from '../hooks/MockTours';

const ToursVisitAttraction = () => {
  const { id } = useParams();

  // Get tours that visit the current attraction
  const getToursByAttraction = (attractionId) => {
    return mockTours.filter(tour => tour.attractions.includes(parseInt(attractionId)));
  };

  const tours = getToursByAttraction(id);

  return (
    <Box sx={{ mt: 3, mb: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1, textAlign: 'left', fontSize: '1.5rem', ml: 1 }}>
        Các tour du lịch tham quan điểm này
      </Typography>
      <Box sx={{ overflowX: 'auto', display: 'flex', pb: 2, width: '100%', position: 'relative' }}>
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap', width: 'max-content', margin: '0 auto' }}>
          {tours.map((tour) => (
            <Grid item key={tour.id}>
              <Card sx={{ width: 230, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={Link} to={`/tour-du-lich/${tour.id}`}>
                  <CardMedia
                    component="img"
                    height="150"
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
                    <Typography color="text.secondary" sx={{ fontSize: 13, textAlign: 'right', mt: -1 }}>
                      {tour.travelCompany}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ fontSize: 16, fontWeight: 700, textAlign: 'justify' }}>
                      {tour.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        {tour.days} ngày
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
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

export default ToursVisitAttraction;
