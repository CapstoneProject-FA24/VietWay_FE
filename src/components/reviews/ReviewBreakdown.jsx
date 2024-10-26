import React from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { mockReviews } from '@hooks/MockReviews';

const ratingLabels = ['Tuyệt vời', 'Tốt', 'Khá tốt', 'Tệ', 'Rất tệ'];
const ratingColors = ['primary.main', 'primary.main', 'primary.main', 'primary.main', 'primary.main'];

const totalReviews = mockReviews.length;
const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
const ratings = [0, 0, 0, 0, 0];
mockReviews.forEach(review => {
  ratings[5 - review.rating]++;
});

const ReviewBreakdown = () => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarIcon key={i} sx={{ color: 'primary.main', fontSize: '1.5rem' }} />);
      } else if (i === fullStars + 1 && decimalPart > 0) {
        const partialStarPercentage = decimalPart * 100;
        stars.push(
          <Box key={i} sx={{ position: 'relative', display: 'inline-flex', fontSize: '1.5rem' }}>
            <StarOutlineIcon sx={{ color: '#e0e0e0' }} />
            <Box
              sx={{
                position: 'absolute',
                overflow: 'hidden',
                display: 'flex',
                width: `${partialStarPercentage}%`,
              }}
            >
              <StarIcon sx={{ color: 'primary.main' }} />
            </Box>
          </Box>
        );
      } else {
        stars.push(<StarOutlineIcon key={i} sx={{ color: '#e0e0e0', fontSize: '1.5rem' }} />);
      }
    }
    return stars;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h3" fontWeight="bold">
          {averageRating.toFixed(1)}
        </Typography>
        <Stack>
          <Stack direction="row" spacing={0.5}>
            {renderStars(averageRating)}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {totalReviews} đánh giá
          </Typography>
        </Stack>
      </Stack>

      {ratingLabels.map((label, index) => (
        <Box key={label} sx={{ mb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">{label}</Typography>
            <Typography variant="body1" color="text.secondary">
              {ratings[index]}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(ratings[index] / totalReviews) * 100}
            sx={{
              height: 15,
              borderRadius: 3,
              [`& .MuiLinearProgress-bar`]: {
                borderRadius: 3,
                backgroundColor: ratingColors[index],
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ReviewBreakdown;
