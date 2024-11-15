import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchTourTemplates } from '@services/TourTemplateService';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@styles/Slider.css'
import TourCard from '@components/provinces/TourCard';
const SuggestTours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const params = { pageSize: 6, pageIndex: 1, searchTerm: '' };
      const response = await fetchTourTemplates(params);
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

  const settings = {
    dots: false, infinite: false, speed: 500,
    slidesToShow: 4, slidesToScroll: 4, arrows: true, className: 'slider-start-date custom-arrows'
  };

  return (
    <Box className="tour-cards">
      <Grid container spacing={3}>
        {tours && tours.slice(0, 6).map((tour) => (
          <Grid item xs={12} md={6} lg={4} key={tour.id}>
            <TourCard tour={tour} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SuggestTours;
