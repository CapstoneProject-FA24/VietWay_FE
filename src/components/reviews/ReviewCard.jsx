import React, { useState } from 'react';
import { Paper, Stack, Avatar, Typography, IconButton, Rating, Box, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ReviewCard = ({ review, onLike }) => {
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likeCount, setLikeCount] = useState(review.likeCount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const handleLikeClick = async () => {
    try {
      const success = await onLike(!isLiked);
      if (success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={review.avatarUrl}
              sx={{
                width: 48,
                height: 48
              }}
            />
            <Stack>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.reviewer}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={review.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: 'primary.main', }, '& .MuiRating-iconEmpty': { color: 'primary.main', }, }} />
                <Typography variant="body2" color="text.secondary">
                  • {formatDate(review.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="body1">
          {review.review}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Button
            startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            onClick={handleLikeClick}
            sx={{
              marginLeft: -0.7,
              color: isLiked ? 'primary.main' : 'text.secondary',
              '&:hover': {
                bgcolor: 'transparent',
                color: 'primary.main'
              }
            }}
          >
            {likeCount > 0 && likeCount} <span style={{ fontSize: '12px',  }}>Hữu ích</span>
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ReviewCard;
