import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { provinces } from '../hooks/Provinces'; // Importing provinces data
import { mockAttractions } from '../hooks/MockAttractions'; // Importing mockAttractions data
import { useNavigate } from 'react-router-dom';

const SuggestProvinces = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    className: 'slider-attractions-homepage',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
  };

  const handleProvinceClick = (provinceName) => {
    navigate(`/diem-tham-quan?tinh=${provinceName}`);
  };

  return (
    <Box sx={{ mt: -3 }}>
      <Slider {...settings}>
        {provinces.map((province) => {
          const provinceAttractions = mockAttractions.filter(attraction => attraction.province === province.name);
          return (
            <Box key={province.id} sx={{ px: 1 }}>
              <Card 
                sx={{ width: 180, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 'none' }}
                onClick={() => handleProvinceClick(province.name)}
              >
                <CardActionArea component={Link} to={`/diem-tham-quan?province=${province.name}`}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={province.image}
                    alt={province.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/path/to/fallback/image.jpg'; // Replace with your fallback image path
                    }}
                    sx={{
                      objectFit: 'cover',
                      padding: 1,
                      borderRadius: '50%',
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" component="div" sx={{ fontSize: 17, fontWeight: 500 }}>
                      {province.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 13 }}>
                      {provinceAttractions.length} địa điểm
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

export default SuggestProvinces;
