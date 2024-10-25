import React from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { mockReviews } from '@hooks/MockReviews';

const ratingLabels = ['Tuyệt vời', 'Tốt', 'Khá tốt', 'Tệ', 'Rất tệ'];
const ratingColors = ['#00a300', '#79bc00', '#ffb900', '#f28b00', '#e23838'];

const totalReviews = mockReviews.length;
const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
const ratings = [0, 0, 0, 0, 0];
mockReviews.forEach(review => {
  ratings[5 - review.rating]++;
});

const ReviewBreakdown = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 400, p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {averageRating.toFixed(1)}
        </Typography>
        <Stack>
          <Stack direction="row" spacing={0.5}>
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                sx={{
                  color: index < Math.floor(averageRating) ? '#00a300' : '#e0e0e0',
                  fontSize: '1rem'
                }}
              />
            ))}
            {averageRating % 1 > 0 && (
              <StarIcon
                sx={{
                  color: '#00a300',
                  clipPath: `inset(0 ${100 - (averageRating % 1) * 100}% 0 0)`,
                  position: 'absolute',
                  right: 0,
                  fontSize: '1rem'
                }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {totalReviews} đánh giá
          </Typography>
        </Stack>
      </Stack>

      {ratingLabels.map((label, index) => (
        <Box key={label} sx={{ mb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">{label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {ratings[index]}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(ratings[index] / totalReviews) * 100}
            sx={{
              height: 6,
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
