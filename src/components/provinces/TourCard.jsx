import React from 'react';
import { Box, Typography, Card, CardMedia, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';

const TourCard = ({ tour }) => {
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
    <Card component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left', borderRadius: '7px' }}>
      <CardMedia
        component="img"
        sx={{ height: '230px', objectFit: 'cover', borderRadius: '7px 7px 0 0' }}
        image={tour.imageUrl}
        alt={tour.tourName}
      />
      <Box sx={{ p: 2 }}>
        <Chip label={`${tour.provinces.join(' - ')}`} size="small"
          sx={{ height: 29, fontSize: '0.85rem', mb: 1, p: 0.5 }}
        />
        <Typography variant="h6" gutterBottom
          sx={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '1.3rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textDecoration: 'none', '&:hover': { color: 'primary.main', }, lineHeight: 1.3 }}>
          {tour.tourName}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.7, fontSize: '0.95rem' }}>
          <SubtitlesOutlinedIcon sx={{ marginRight: '8px', fontSize: '1.25rem' }} />
          Mã tour: {tour.code}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: '0.95rem' }}>
          <AccessTimeIcon sx={{ marginRight: '8px', fontSize: '1.25rem' }} />
          Thời lượng: {tour.duration}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: '0.95rem' }}>
          <MapOutlinedIcon sx={{ marginRight: '8px', fontSize: '1.25rem' }} />
          Khởi hành từ: {tour.startingProvince}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{  display: 'flex', alignItems: 'center', mb: 1, fontSize: '0.95rem' }}>
          <DirectionsTransitOutlinedIcon sx={{ marginRight: '8px', fontSize: '1.25rem' }} />
          Phương tiện: {tour.transportation}
        </Typography>
        <Box color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarMonthOutlinedIcon sx={{ marginRight: '8px', fontSize: '1.25rem' }} />
          <Box sx={{ width: '80%' }}>
            {tour.startDates.length >= 5 ? (
              <Slider {...settings}>
                {tour.startDates.map((date, index) => (
                  <div key={index}>
                    <Typography variant="body2" sx={{
                      fontSize: '0.75rem', textAlign: 'center',
                      border: '1px solid #3572EF', width: '3.3rem', color: 'primary.main',
                      borderRadius: 2.5, p: 0.65
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
                    fontSize: '0.75rem', textAlign: 'center',
                    border: '1px solid #3572EF', width: '3.3rem', color: 'primary.main',
                    borderRadius: 2.5, p: 0.65
                  }}>
                    {formatDate(date)}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'grey' }}>Chỉ từ:</Typography>
            <Typography variant="h6" color="red" sx={{ fontSize: '1.6rem', fontWeight: 'bold', mt: -1 }}>
              {tour.minPrice.toLocaleString()} đ
            </Typography>
          </Box>
          <StyledButton component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`} sx={{ color: 'primary', textTransform: 'none', borderRadius: '10px', border: '1px solid #3572EF', height: '45px' }}>Xem chi tiết</StyledButton>
        </Box>
      </Box>
    </Card>
  );
};

export default TourCard;
