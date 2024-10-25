import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea, Chip } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchToursByAttractionId } from '@services/TourTemplateService';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ToursVisitAttraction = () => {
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2, textAlign: 'left', fontSize: '1.5rem', ml: 1 }}>
          Các tour du lịch tham quan điểm này
        </Typography>
      )}
      <Box sx={{ overflowX: 'auto', display: 'flex', pb: 2, width: '100%', position: 'relative' }}>
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap', width: 'max-content' }}>
          {tours.map((tour) => (
            <Grid item key={tour.tourTemplateId}>
              <Card sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <CardActionArea component={Link} to={`/tour-du-lich/${tour.tourTemplateId}`}>
                  <CardMedia
                    component="img"
                    height="170"
                    image={tour.imageUrl}
                    alt={tour.tourName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/path/to/fallback/image.jpg';
                    }}
                    sx={{
                      objectFit: 'cover',
                      aspectRatio: '16 / 9',
                      padding: 1,
                      borderRadius: 3,
                      mb: -1
                    }}
                  />
                  <CardContent sx={{ textAlign: 'left', pt: 1 }}>
                      <Chip 
                        label={`${tour.provinces.join(' - ')}`} 
                        size="small" 
                        sx={{ height: 25, fontSize: '0.75rem', mb: 1 }} 
                      />
                    <Typography variant="h6" component="div" sx={{ fontSize: 17, fontWeight: 700, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', lineHeight: 1.3, mb: 1 }}>
                      {tour.tourName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <SubtitlesOutlinedIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        Mã: {tour.code}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        Khởi hành từ: {tour.provinces[0]}
                      </Typography>
                    </Box>
                    <hr style={{ width: '106%', marginLeft: '-3%', height: '1px', border: 'none', backgroundColor: '#dfdfdf' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
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

export default ToursVisitAttraction;
