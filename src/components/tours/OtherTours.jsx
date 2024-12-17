import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea, Chip } from '@mui/material';
import { Link, useParams, useLocation } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchTourTemplates } from '@services/TourTemplateService';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';

const OtherTours = ({ pros, tourId }) => {
  const [tours, setTours] = useState([]);
  const location = useLocation();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

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
        if (filteredTours.length === 0) {
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
            <Grid item key={tour.id} md={3.5}>
              <Card key={tour.tourTemplateId} sx={{
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)'
                },
                height: '350px', minHeight: '400px',
                width: '100%'
              }}>
                <CardActionArea
                  component={Link}
                  to={`/tour-du-lich/${tour.tourTemplateId}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <CardMedia
                    component="img"
                    image={tour.imageUrl}
                    alt={tour.tourName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/path/to/fallback/image.jpg';
                    }}
                    sx={{
                      width: '100%',
                      objectFit: 'cover', height: '190px'
                    }}
                  />
                  <CardContent sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 1.5
                  }}>
                    <Box>
                      <Chip
                        label={`${tour.provinces.join(' - ')}`}
                        size="small"
                        sx={{ height: 25, fontSize: '0.75rem', mb: 1 }}
                      />
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontSize: 17,
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.3,
                        }}
                      >
                        {tour.tourName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <SubtitlesOutlinedIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
                          Mã: {tour.code}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
                          Khởi hành từ: {tour.startingProvince}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsTransitOutlinedIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
                          Phương tiện: {tour.transportation}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #dfdfdf',
                      pt: 1,
                      mt: 1
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        {tour.duration}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontSize: 14, fontWeight: 600 }}>
                        {formatCurrency(tour.minPrice)}
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
