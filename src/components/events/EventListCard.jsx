import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Slide } from '@mui/material';
import { Link } from 'react-router-dom';

const EventListCard = ({ event }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <Card
            component={Link} to={`/su-kien/${event.eventId}`}
            sx={{
                maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px',
                overflow: 'hidden', boxShadow: '0 0px 8px rgba(0,0,0,0.3)', position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardMedia component="img" height="270" image={event.imageUrl} alt={event.title} sx={{ objectFit: 'cover' }} />
            <Box sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: isHovered ? 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.85) 55%)' :
                    'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 72%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Chip
                        label={event.provinceName} size="medium" sx={{
                            fontSize: '0.75rem', fontWeight: 'bold', mr: 1, width: 'fit-content',
                            bgcolor: 'rgba(0,0,0,0.15)', color: 'white', height: '25px', border: '1px solid rgba(255,255,255)'
                        }} />
                    <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
                        {new Date(event.startDate).toLocaleDateString('vi-VN')} - {new Date(event.endDate).toLocaleDateString('vi-VN')}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{
                    fontWeight: 'bold', fontSize: '1.2rem', color: 'white', mb: isHovered ? 0.5 : -0.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>
                    {event.title}
                </Typography>
                {isHovered && (
                    <Slide direction="up" in={isHovered}>
                        <Typography
                            variant="body2" sx={{
                                fontSize: '0.9rem', color: 'lightGray', mb: -0.2,
                                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                            }}>
                            {event.description}
                        </Typography>
                    </Slide>
                )}
            </Box>
            <CardContent sx={{
                position: 'absolute', top: '0px', left: '0px', width: '100%'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Chip
                        label={event.eventCategory} size="medium" sx={{
                            fontSize: '0.8rem', fontWeight: 'bold',
                            bgcolor: 'rgba(255,255,255,0.8)', color: 'black', height: '25px'
                        }} />
                        <Chip
                        label={`Ngày đăng: ${new Date(event.createdAt).toLocaleDateString('vi-VN')}`} size="medium" sx={{
                            fontSize: '0.75rem',
                            bgcolor: 'rgba(200,200,200,0.7)', color: 'black', height: '22px'
                        }} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default EventListCard;
