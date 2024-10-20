import React from 'react';
import { Grid, Card, CardMedia, Typography, Box, CardActionArea } from '@mui/material';
import { provinces } from '@hooks/Provinces';
import { useNavigate } from 'react-router-dom';

const SuggestTourByProvince = () => {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/tinh-thanh/${id}`);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Card sx={{ position: 'relative' }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[0].id)}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={provinces[0].image}
                            alt={provinces[0].name}
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
                            {provinces[0].name}
                        </Typography>
                    </CardActionArea>
                </Card>

                <Card sx={{ position: 'relative', mt: 2.3 }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[1].id)}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={provinces[1].image}
                            alt={provinces[1].name}
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
                            {provinces[1].name}
                        </Typography>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={3.5}>
                <Card sx={{ position: 'relative' }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[2].id)}>
                        <CardMedia
                            component="img"
                            height="419"
                            image={provinces[2].image}
                            alt={provinces[2].name}
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
                            {provinces[2].name}
                        </Typography>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={3} sm={5.5}>
                <Card sx={{ position: 'relative' }}>
                    <CardActionArea onClick={() => handleCardClick(provinces[3].id)}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={provinces[3].image}
                            alt={provinces[3].name}
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
                            {provinces[3].name}
                        </Typography>
                    </CardActionArea>
                </Card>
                <Grid container spacing={2} mt={0.3}>
                    <Grid item xs={3} sm={6}>
                        <Card sx={{ position: 'relative' }}>
                            <CardActionArea onClick={() => handleCardClick(provinces[4].id)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={provinces[4].image}
                                    alt={provinces[4].name}
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
                                    {provinces[4].name}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={3} sm={6}>
                        <Card sx={{ position: 'relative' }}>
                            <CardActionArea onClick={() => handleCardClick(provinces[5].id)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={provinces[5].image}
                                    alt={provinces[5].name}
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
                                    {provinces[5].name}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SuggestTourByProvince;
