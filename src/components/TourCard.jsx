import React from 'react';
import { Card, CardMedia, Box, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const settings = { dots: false, infinite: false, speed: 500,
    slidesToShow: 4, slidesToScroll: 4, arrows: true, className: 'slider-start-date custom-arrows' };

  return (
    <Card sx={{ display: 'flex', height: '225px', textAlign: 'left', borderRadius: '7px', width: '100%', mb: 2 }}>
      <CardMedia component="img" sx={{ width: '32%', objectFit: 'cover', margin: '7px', borderRadius: '7px' }}
        image={tour.imageUrl} alt={tour.tourName} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '47%', p: 1.5 }}>
        <Chip  label={tour.tourCategory}  size="small" 
          sx={{ alignSelf: 'flex-start', mb: 1, fontSize: '1rem', pt: 1.8, pb: 1.8, pl: 0.5, pr: 0.5 }} />
        <Typography variant="h5"  component={Link}  to={`/tour-du-lich/${tour.tourTemplateId}`} gutterBottom 
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', textDecoration: 'none', color: 'inherit', lineHeight: 1.2, height: '2.4em' }}>
          {tour.tourName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SubtitlesOutlinedIcon sx={{ marginRight: '8px' }} />
          Mã tour: {tour.code}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1  }}>
          <MapOutlinedIcon sx={{ marginRight: '8px' }} />
          Điểm đến: {tour.provinces.join(', ')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarMonthOutlinedIcon sx={{ marginRight: '8px' }} />
          <Box sx={{ width: '80%' }}>
            {tour.startDates.length >= 5 ? (
              <Slider {...settings}>
                {tour.startDates.map((date, index) => (
                  <div key={index}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', textAlign: 'center', 
                      border: '1px solid #3572EF', width: '3.5rem', color: 'primary.main', 
                      borderRadius: 2.5, p: 0.7 }}>
                      {formatDate(date)}
                    </Typography>
                  </div>
                ))}
              </Slider>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tour.startDates.map((date, index) => (
                  <Typography key={index} variant="body2" sx={{ fontSize: '0.8rem', textAlign: 'center', 
                    border: '1px solid #3572EF', width: '3.5rem', color: 'primary.main', 
                    borderRadius: 2.5, p: 0.7 }}>
                    {formatDate(date)}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '1px', backgroundColor: '#e0e0e0' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
        width: '20%', p: '15px 15px 15px 5px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AccessTimeOutlinedIcon sx={{ marginRight: '8px', fontSize: '1.7rem' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {tour.duration.replace(/(\d+)\s*ngày/, '$1N').replace(/(\d+)\s*đêm/, '$1Đ').replace(/\s+/g, '')}
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
