import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, Typography, Box, CardActionArea } from '@mui/material';
import { fetchProvinceWithCountDetails } from '@services/ProvinceService';
import { useNavigate } from 'react-router-dom';

const SuggestProvinces = () => {
    const [provinces, setProvinces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProvinceData();
    }, []);

    const fetchProvinceData = async () => {
        try {
            const params = { pageIndex: 1, pageSize: 6 };
            const response = await fetchProvinceWithCountDetails(params);
            if (response.data && Array.isArray(response.data) && response.data.length >= 6) {
                setProvinces(response.data.slice(0, 6));
            } else {
                console.error('Invalid or insufficient data received from fetchProvinces');
            }
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const handleCardClick = (id) => {
        navigate(`/tinh-thanh/${id}`);
    };

    if (provinces.length < 6) {
        return null; // or return a loading indicator
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Card sx={{ position: 'relative' }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[0].provinceId)}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={provinces[0].imageURL}
                            alt={provinces[0].provinceName}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                color: 'white',
                                textShadow: ' -1px 0 #2F2F2F, 0 1px #2F2F2F, 1px 0 #2F2F2F, 0 -1px #2F2F2F, 2px 2px 4px black',
                                padding: '4px 8px',
                                borderRadius: '4px',
                            }}
                        >
                            {provinces[0].provinceName}
                        </Typography>
                    </CardActionArea>
                </Card>

                <Card sx={{ position: 'relative', mt: 2.3 }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[1].provinceId)}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={provinces[1].imageURL}
                            alt={provinces[1].provinceName}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                color: 'white',
                                textShadow: '-1px 0 #2F2F2F, 0 1px #2F2F2F, 1px 0 #2F2F2F, 0 -1px #2F2F2F, 2px 2px 4px black',
                                padding: '4px 8px',
                                borderRadius: '4px',
                            }}
                        >
                            {provinces[1].provinceName}
                        </Typography>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={3.5}>
                <Card sx={{ position: 'relative' }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[2].provinceId)}>
                        <CardMedia
                            component="img"
                            height="419"
                            image={provinces[2].imageURL}
                            alt={provinces[2].provinceName}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                color: 'white',
                                textShadow: '-1px 0 #2F2F2F, 0 1px #2F2F2F, 1px 0 #2F2F2F, 0 -1px #2F2F2F, 2px 2px 4px black',
                                padding: '4px 8px',
                                borderRadius: '4px',
                            }}
                        >
                            {provinces[2].provinceName}
                        </Typography>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={3} sm={5.5}>
                <Card sx={{ position: 'relative' }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[3].provinceId)}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={provinces[3].imageURL}
                            alt={provinces[3].provinceName}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                color: 'white',
                                textShadow: '-1px 0 #2F2F2F, 0 1px #2F2F2F, 1px 0 #2F2F2F, 0 -1px #2F2F2F, 2px 2px 4px black',
                                padding: '4px 8px',
                                borderRadius: '4px',
                            }}
                        >
                            {provinces[3].provinceName}
                        </Typography>
                    </CardActionArea>
                </Card>
                <Grid container spacing={2} mt={0.3}>
                    <Grid item xs={3} sm={6}>
                        <Card sx={{ position: 'relative' }}>
                            <CardActionArea onClick={() => handleCardClick(provinces[4].provinceId)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={provinces[4].imageURL}
                                    alt={provinces[4].provinceName}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: 16,
                                        color: 'white',
                                        textShadow: '-1px 0 #2F2F2F, 0 1px #2F2F2F, 1px 0 #2F2F2F, 0 -1px #2F2F2F, 2px 2px 4px black',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {provinces[4].provinceName}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={3} sm={6}>
                        <Card sx={{ position: 'relative' }}>
                            <CardActionArea onClick={() => handleCardClick(provinces[5].provinceId)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={provinces[5].imageURL}
                                    alt={provinces[5].provinceName}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: 16,
                                        color: 'white',
                                        textShadow: '-1px 0 #2F2F2F, 0 1px #2F2F2F, 1px 0 #2F2F2F, 0 -1px #2F2F2F, 2px 2px 4px black',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {provinces[5].provinceName}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SuggestProvinces;
