import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChairAltOutlinedIcon from '@mui/icons-material/ChairAltOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';
import { fetchTourTemplates } from '@services/TourTemplateService';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@styles/Slider.css'

const SuggestTours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const params = { pageSize: 6, pageIndex: 1, searchTerm: '' };
      const response = await fetchTourTemplates(params);
      console.log(response);
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
  }));

  const settings = { dots: false, infinite: false, speed: 500,
    slidesToShow: 4, slidesToScroll: 4, arrows: true, className: 'slider-start-date custom-arrows' };

  return (
    <Box className="tour-cards">
      <Grid container spacing={3}>
        {tours && tours.slice(0, 6).map((tour) => (
          <Grid item xs={12} md={6} lg={4} key={tour.id}>
            <Card component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left', borderRadius: '7px' }}>
              <CardMedia
                component="img"
                sx={{ height: '200px', objectFit: 'cover', borderRadius: '7px 7px 0 0' }}
                image={tour.imageUrl}
                alt={tour.tourName}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom
                  sx={{marginBottom: '5px', fontWeight: 'bold', fontSize: '1.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main', } }}>
                  {tour.tourName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SubtitlesOutlinedIcon sx={{marginBottom: '5px', marginRight: '8px' }} />
                  Mã tour: {tour.code}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{marginBottom: '5px', display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MapOutlinedIcon sx={{ marginRight: '8px' }} />
                  Điểm đến: {tour.provinces.join(', ')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{marginBottom: '5px', display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon sx={{ marginRight: '8px' }} />
                  Thời lượng: {tour.duration}
                </Typography>
                <Box color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonthOutlinedIcon sx={{ marginRight: '8px' }} />
                  <Box sx={{ width: '80%' }}>
                    {tour.startDates.length >= 5 ? (
                      <Slider {...settings}>
                        {tour.startDates.map((date, index) => (
                          <div key={index}>
                            <Typography variant="body2" sx={{
                              fontSize: '0.8rem', textAlign: 'center',
                              border: '1px solid #3572EF', width: '3.5rem', color: 'primary.main',
                              borderRadius: 2.5, p: 0.7
                            }}>
                              {formatDate(date)}
                            </Typography>
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tour.startDates.map((date, index) => (
                          <Typography key={index} variant="body2" sx={{
                            fontSize: '0.8rem', textAlign: 'center',
                            border: '1px solid #3572EF', width: '3.5rem', color: 'primary.main',
                            borderRadius: 2.5, p: 0.7
                          }}>
                            {formatDate(date)}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 4 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Chỉ từ:</Typography>
                  <Typography variant="h6" color="red" sx={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '-60px' }}>
                    {tour.minPrice.toLocaleString()} đ
                  </Typography>
                  <StyledButton component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`} sx={{ color: 'primary', textTransform: 'none', borderRadius: '10px', border: '1px solid #3572EF', height: '50px' }}>Xem chi tiết</StyledButton>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SuggestTours;
