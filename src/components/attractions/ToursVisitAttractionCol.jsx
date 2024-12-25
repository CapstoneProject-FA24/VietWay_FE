import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea, Chip } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { fetchToursByAttractionId } from '@services/TourTemplateService';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ToursVisitAttractionCol = () => {
  const { id } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetchToursByAttractionId(id, 10);
        setTours(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchTours();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box sx={{ mt: 3, mb: 5 }}>
      {tours.length > 0 && (
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 700, 
          mb: 2, 
          textAlign: 'left', 
          fontSize: '1.5rem'
        }}>
          Các tour du lịch liên quan
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 3.5, pr: 3.5, maxHeight: '870px', overflowY: 'auto' }}>
        {tours.map((tour) => (
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
                    {formatCurrency(tour.price)}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ToursVisitAttractionCol;
