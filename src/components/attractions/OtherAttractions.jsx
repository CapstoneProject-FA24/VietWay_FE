import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CardActionArea, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchAttractions } from '@services/AttractionService';

const OtherAttractions = ({ provinceId, attractionId }) => {
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    const loadSuggestedAttractions = async () => {
      try {
        const provinceIds = Array.isArray(provinceId) ? provinceId : [provinceId];
        let params = {
          pageSize: 10,
          pageIndex: 1,
          provinceIds: provinceIds,
        };
        let suggestedAttractions = await fetchAttractions(params);
        let filteredAttractions = suggestedAttractions.data.filter(attraction => attraction.attractionId !== attractionId);

        if (filteredAttractions.length === 0) {
          params = {
            pageSize: 10,
            pageIndex: 1
          };
          suggestedAttractions = await fetchAttractions(params);
          filteredAttractions = suggestedAttractions.data.filter(attraction => attraction.attractionId !== attractionId);
        }

        setAttractions(filteredAttractions);
      } catch (error) {
        console.error('Error loading suggested attractions:', error);
      }
    };

    loadSuggestedAttractions();
  }, [provinceId, attractionId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2, textAlign: 'left', fontSize: '2rem' }}>
        Các điểm tham quan nổi bật khác
      </Typography>
      <Box sx={{ overflowX: 'auto', display: 'flex', pb: 2, width: '100%', position: 'relative' }}>
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap', width: 'max-content', margin: '0 auto' }}>
          {attractions.map((attraction) => (
            <Grid item key={attraction.attractionId}>
              <Card sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={Link} to={`/diem-tham-quan/${attraction.attractionId}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={attraction.imageUrl || '/path/to/fallback/image.jpg'}
                    alt={attraction.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/path/to/fallback/image.jpg';
                    }}
                    sx={{
                      objectFit: 'cover',
                      aspectRatio: '16 / 9',
                      padding: 1,
                      borderRadius: 3,
                    }}
                  />
                  <CardContent sx={{ textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={`${attraction.attractionType}`}
                        size="small"
                        sx={{ height: 25, fontSize: '0.8rem', mt: -0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 13 }}>
                        {attraction.province}
                      </Typography>
                    </Box>
                    <Typography variant="h6" component="div" sx={{ fontSize: 23, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attraction.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {attraction.address}
                    </Typography>
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

export default OtherAttractions;
