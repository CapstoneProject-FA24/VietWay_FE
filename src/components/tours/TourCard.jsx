import React from 'react';
import { Card, CardMedia, Box, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@styles/Slider.css'

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
}));

const TourCard = ({ tour }) => {
  console.log(tour);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const settings = {
    dots: false, infinite: false, speed: 500,
    slidesToShow: 4, slidesToScroll: 4, arrows: true, className: 'slider-start-date custom-arrows'
  };

  return (
    <Card sx={{ display: 'flex', height: '252px', textAlign: 'left', borderRadius: '7px', width: '100%', mb: 2 }}>
      <CardMedia component="img" sx={{ width: '37%', objectFit: 'cover', margin: '7px', borderRadius: '7px' }}
        image={tour.imageUrl} alt={tour.tourName} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '43%', p: 1.5 }}>
        <Chip label={tour.tourCategory} size="small"
          sx={{ alignSelf: 'flex-start', mb: 1, fontSize: '0.85rem', pt: 1.5, pb: 1.5, pl: 0.5, pr: 0.5 }} />
        <Typography variant="h5" component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`}
          sx={{
            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, fontSize: '1.3rem',
            WebkitBoxOrient: 'vertical', textDecoration: 'none', color: 'inherit', lineHeight: 1.2, height: 'fit-content', mb: 1, mt: 1
          }}>
          {tour.tourName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <SubtitlesOutlinedIcon sx={{ marginRight: '8px' }} />
          Mã tour: {tour.code}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <LocationOnOutlinedIcon sx={{ marginRight: '8px' }} />
          Khởi hành từ: {tour.startingProvince}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          {tour.transportation === 'Máy bay' && (<FlightOutlinedIcon sx={{ marginRight: '8px' }} />)}
          {tour.transportation === 'Tàu hỏa' && (<DirectionsTransitOutlinedIcon sx={{ marginRight: '8px' }} />)}
          {tour.transportation === 'Xe du lịch' && (<DirectionsCarFilledOutlinedIcon sx={{ marginRight: '8px' }} />)}
          Phương tiện: {tour.transportation}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <CalendarMonthOutlinedIcon sx={{ marginRight: '8px' }} />
            Ngày khởi hành:
          </Typography>
          <Box sx={{ width: '55%' }}>
            {tour.startDates.length >= 5 ? (
              <Slider {...settings}>
                {tour.startDates.map((date, index) => (
                  <div key={index}>
                    <Typography variant="body2" sx={{
                      fontSize: '0.8rem', textAlign: 'center',
                      border: '1px solid #3572EF', width: '3.5rem', color: 'primary.main',
                      borderRadius: 2.5, p: 0.5
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
      </Box>
      <Box sx={{ width: '1px', backgroundColor: '#e0e0e0' }} />
      <Box sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        width: '20%', p: '15px 15px 15px 5px'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AccessTimeOutlinedIcon sx={{ marginRight: '8px', fontSize: '1.7rem' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {tour.duration}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
            Giá từ:
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {tour.minPrice.toLocaleString()} đ
          </Typography>
        </Box>
        <StyledButton component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`} sx={{ color: 'primary', textTransform: 'none', alignSelf: 'center', borderRadius: '10px', border: '1px solid #3572EF', height: '50px', width: '80%' }}>Xem chi tiết</StyledButton>
      </Box>
    </Card>
  );
};

export default TourCard;
