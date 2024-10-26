import React, { useState } from 'react';
import { Card, CardMedia, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ProvinceCard = ({ province }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            sx={{
                position: 'relative',
                height: '350px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardMedia
                component="img"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
                image={province.imageURL}
                alt={province.provinceName}
            />
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(5,7,60,0) 0%, rgba(5,7,60,0.3) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    background: 'linear-gradient(90deg, rgba(4, 6, 21,0.1) 5%, rgba(4, 6, 21,0.7) 35%, rgba(4, 6, 21,0.85) 80%)',
                },
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                    <Typography variant="h4" component="div" sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,1)',
                    }}>
                        {province.provinceName}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    mr: 4,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                }}>
                    <img src="/province-detail.png" alt="Province detail" style={{ width: '13.5rem', height: '13.5rem', marginTop: 15 }} />
                    <Box sx={{ position: 'absolute', right: 85, top: 5 }}>
                        <Typography sx={{ color: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>{province.attractionsCount}</Typography>
                        <Typography sx={{ color: 'white', mt: -1, fontSize: '0.9rem' }} >Điểm đến</Typography>
                    </Box>
                    <Box sx={{ position: 'absolute', right: -25, top: 68 }}>
                        <Typography sx={{ color: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>{province.toursCount}</Typography>
                        <Typography sx={{ color: 'white', mt: -1, fontSize: '0.9rem' }} >Tour</Typography>
                    </Box>
                    <Box sx={{ position: 'absolute', right: -10, bottom: 15 }}>
                        <Typography sx={{ color: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>{province.postsCount}</Typography>
                        <Typography sx={{ color: 'white', mt: -1, fontSize: '0.9rem' }}>Bài viết</Typography>
                    </Box>
                    <Box sx={{ position: 'absolute', right: 222, bottom: 33, textAlign: 'right' }}>
                        <Typography sx={{ color: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>{province.eventsCount}</Typography>
                        <Typography sx={{ color: 'white', mt: -1, fontSize: '0.9rem' }} >Sự kiện</Typography>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    /* opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out', */
                }}>
                    <Link to={`/tinh-thanh/${province.provinceId}`} style={{ textDecoration: 'none' }}>
                        <Typography variant="button" sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                        }}>
                            Xem chi tiết
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Card>
    );
};

export default ProvinceCard;
