import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { mockTours } from '../hooks/MockTours';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChairAltOutlinedIcon from '@mui/icons-material/ChairAltOutlined';
import { styled } from '@mui/material/styles';

const SuggestTours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    // Simulate fetching data from a mock
    setTours(mockTours);
  }, []);

  const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
  }));

  return (
    <Box component="section" className="suggest-tours">
      <Box className="tour-cards">
        <Grid container spacing={3}>
          {tours && tours.slice(0, 8).map((tour) => (
            <Grid item xs={12} md={6} lg={3} key={tour.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left', borderRadius: '7px' }}>
                <CardMedia
                  component="img"
                  sx={{ height: '200px', objectFit: 'cover', borderRadius: '7px 7px 0 0' }}
                  image={tour.images[0].url}
                  alt={tour.images[0].alt}
                />
                <Box sx={{ p: 2 }}>
                  <Typography 
                    variant="h6" 
                    component={Link} 
                    to={`/tour-du-lich/${tour.id}`}
                    gutterBottom 
                    sx={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 1, 
                      WebkitBoxOrient: 'vertical',
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {tour.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SubtitlesOutlinedIcon sx={{ marginRight: '8px' }} />
                    Mã tour: {tour.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MapOutlinedIcon sx={{ marginRight: '8px' }} />
                    Khởi hành từ: {tour.pickupPoints[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonthOutlinedIcon sx={{ marginRight: '8px' }} />
                    Ngày khởi hành: {tour.startDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ChairAltOutlinedIcon sx={{ marginRight: '8px' }} />
                    Số chỗ còn nhận: {tour.totalAcceptedParticipants}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary">
                      {tour.price.adult.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                    <StyledButton component={Link} to={`/tour-du-lich/${tour.id}`} sx={{ color: 'primary', textTransform: 'none', borderRadius: '10px', border: '1px solid #3572EF', height: '50px' }}>Đặt ngay</StyledButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SuggestTours;
