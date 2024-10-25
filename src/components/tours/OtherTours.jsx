import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea } from '@mui/material';
import { Link, useParams, useLocation } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchTourTemplates } from '@services/TourTemplateService';

const OtherTours = ({ pros, tourId }) => {
  const [tours, setTours] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadSuggestedTours = async () => {
      try {
        let params = {
          pageSize: 10,
          pageIndex: 1,
          provinceIds: pros,
        };
        let suggestedTours = await fetchTourTemplates(params);
        let filteredTours = suggestedTours.data.filter(tour => tour.tourTemplateId !== tourId);
        if(filteredTours.length === 0){
          params = {
            pageSize: 10,
            pageIndex: 1
          };
          suggestedTours = await fetchTourTemplates(params);
          filteredTours = suggestedTours.data.filter(tour => tour.tourTemplateId !== tourId);
        }
        setTours(filteredTours);
      } catch (error) {
        console.error('Error loading suggested tours:', error);
      }
    };

    loadSuggestedTours();
  }, [pros, tourId, location.pathname]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2, textAlign: 'left', fontSize: '2rem' }}>
        Các tour du lịch khác
      </Typography>
      <Box sx={{ overflowX: 'auto', display: 'flex', pb: 2, width: '100%', position: 'relative' }}>
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap', width: 'max-content' }}>
          {tours.map((tour) => (
            <Grid item key={tour.id}>
              <Card sx={{ width: 290, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`}>
                  <CardMedia
                    component="img"
                    height="210"
                    image={tour.imageUrl || '/path/to/fallback/image.jpg'}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 13 }}>
                        {tour.provinces.map(province => province).join(' - ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 13 }}>
                        {tour.tourCategory}
                      </Typography>
                    </Box>
                    <Typography variant="h6" component="div" sx={{ fontSize: 19, fontWeight: 500, textAlign: 'justify' }}>
                      {tour.tourName}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        {tour.duration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        Giá: {tour.minPrice.toLocaleString()} VND
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
