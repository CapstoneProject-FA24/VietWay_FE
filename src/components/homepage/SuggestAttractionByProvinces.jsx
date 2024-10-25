import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { fetchProvinceWithCountDetails } from '@services/ProvinceService'; // Import the fetch function

const SuggestAttractionByProvinces = () => {
  const [provinces, setProvinces] = useState([]);

  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 6,
    autoplay: true,
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
    prevArrow: <ArrowBackIosNewOutlinedIcon sx={{ color: 'black', mt: -8}} className="slick-prev" />,
    nextArrow: <ArrowForwardIosOutlinedIcon sx={{ color: 'black', mt: -8}} className="slick-next" />,
  };

  const handleProvinceClick = (provinceId) => {
    navigate(`/diem-tham-quan?tinh=${provinceId}`);
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      const params = {
        pageIndex: 1,
        pageSize: 70
      };
      const result = await fetchProvinceWithCountDetails(params);
      setProvinces(result.data);
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
    }
  };

  return (
    <Box sx={{ mt: -3 }}>
      <Slider {...settings}>
        {provinces.map((province) => {
          return (
            <Box key={province.provinceId} sx={{ px: 1 }}>
              <Card 
                sx={{ width: 170, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 'none' }}
                onClick={() => handleProvinceClick(province.provinceId)}
              >
                <CardActionArea component={Link} to={`/diem-tham-quan?tinh=${province.provinceId}`}>
                  <CardMedia
                    component="img"
                    height="170"
                    image={province.imageURL}
                    alt={province.provinceName}
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
                      {province.provinceName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 13 }}>
                      {province.attractionsCount} điểm đến
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

export default SuggestAttractionByProvinces;
