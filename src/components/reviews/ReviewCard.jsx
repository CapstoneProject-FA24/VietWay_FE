import React from 'react';
import { Paper, Stack, Avatar, Typography, IconButton, Rating } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const getInitials = (name) => {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name) => {
  const colors = [
    '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', 
    '#00796b', '#f57c00', '#0288d1', '#512da8'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const ReviewCard = ({ review }) => (
  <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            src={review.avatarUrl} 
            sx={{ 
              bgcolor: getRandomColor(review.userName),
              width: 48,
              height: 48
            }}
          >
            {getInitials(review.userName)}
          </Avatar>
          <Stack>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.userName}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating 
                value={review.rating} 
                readOnly 
                size="small"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: 'primary.main',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'primary.main',
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                • {review.date}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <IconButton size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Typography variant="body1">
        {review.content}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <ThumbUpIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {review.helpful} lượt hữu ích
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default ReviewCard;
