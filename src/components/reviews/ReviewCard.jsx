import React from 'react';
import { Paper, Stack, Avatar, Typography, IconButton, Rating } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
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
                  • {formatDate(review.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="body1">
          {review.review}
        </Typography>
        {review.likeCount && (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <ThumbUpIcon fontSize="small" />
            </IconButton>

            <Typography variant="body2" color="text.secondary">
              Hữu ích {`(${review.likeCount})`}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default ReviewCard;
