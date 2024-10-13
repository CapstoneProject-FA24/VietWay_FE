import React from 'react';
import { Card, CardMedia, Box, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
}));

const AttractionCard = ({ attraction }) => {
    return (
        <Card sx={{ display: 'flex', height: '225px', textAlign: 'left', borderRadius: '7px', width: '100%', mb: 2 }}>
            <CardMedia
                component="img"
                sx={{ width: '36%', objectFit: 'cover', margin: '7px', borderRadius: '7px' }}
                image={attraction.imageUrl}
                alt={attraction.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '60%', p: 1.5 }}>
                <Chip
                    label={attraction.attractionType}
                    size="small"
                    sx={{ alignSelf: 'flex-start', mb: 1, fontSize: '1rem', pt: 1.8, pb: 1.8, pl: 0.5, pr: 0.5 }}
                />
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/diem-tham-quan/${attraction.attractionId}`}
                    gutterBottom
                    sx={{
                        overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textDecoration: 'none',
                        color: 'inherit', lineHeight: 1.2, height: '2.4em', fontSize: '1.9rem'
                    }}
                >
                    {attraction.name}
                </Typography>
                <Box sx={{ display: 'flex', minWidth: '100%', height: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: '1.1rem' }}>
                            <MapOutlinedIcon sx={{ marginRight: '8px' }} />
                            {attraction.province}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: '1.1rem' }}>
                            <LocationOnOutlinedIcon sx={{ marginRight: '8px' }} />
                            {attraction.address}
                        </Typography>
                    </Box>
                    <Box sx={{ width: '28%', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                        <StyledButton
                            component={Link}
                            to={`/diem-tham-quan/${attraction.attractionId}`}
                            sx={{
                                color: 'primary', textTransform: 'none', borderRadius: '10px',
                                border: '1px solid #3572EF', height: '50px', width: '100%'
                            }}>
                            Xem chi tiết
                        </StyledButton>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default AttractionCard;
