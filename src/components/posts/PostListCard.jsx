import React from 'react';
import { Card, CardMedia, Box, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
}));

const PostListCard = ({ post }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    return (
        <Card sx={{ display: 'flex', height: '225px', textAlign: 'left', borderRadius: '7px', width: '100%', mb: 2 }}>
            <CardMedia
                component="img"
                sx={{ width: '36%', objectFit: 'cover', margin: '7px', borderRadius: '7px' }}
                image={post.image}
                alt={post.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '60%', p: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                        label={post.category}
                        size="small"
                        sx={{ fontSize: '1rem', pt: 1.8, pb: 1.8, pl: 0.5, pr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        Ngày đăng: {formatDate(post.createDate)}
                    </Typography>
                </Box>
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/bai-viet/${post.id}`}
                    gutterBottom
                    sx={{
                        overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textDecoration: 'none',
                        color: 'inherit', lineHeight: 1.2, fontSize: '1.9rem'
                    }}
                >
                    {post.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: '1.1rem' }}>
                            <LocationOnIcon sx={{ marginRight: '8px' }} />
                            {post.provinceName}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                fontSize: '0.9rem',
                                height: '2.7em',
                                flex: 1,
                                mr: 2
                            }}
                        >
                            {post.description}
                        </Typography>
                        <StyledButton
                            component={Link}
                            to={`/bai-viet/${post.id}`}
                            sx={{
                                color: 'primary',
                                textTransform: 'none',
                                borderRadius: '10px',
                                border: '1px solid #3572EF',
                                height: '40px',
                                width: '120px',
                                minWidth: '120px'
                            }}
                        >
                            Xem chi tiết
                        </StyledButton>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default PostListCard;
