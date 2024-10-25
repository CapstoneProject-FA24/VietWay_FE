import React, { useState, useEffect } from 'react';
import { Box, Paper, Rating, TextField, Button, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon } from '@mui/icons-material';

const WORD_LIMIT = 300;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  background: theme.palette.background.paper,
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  fontSize: '2rem',
  color: theme.palette.primary.main,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const ReviewInput = ({ onDataChange }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const wordCount = content.trim().split(/\s+/).length;
  const isOverLimit = wordCount > WORD_LIMIT;

  useEffect(() => {
    if (typeof onDataChange === 'function') {
      onDataChange({ rating, content });
    }
  }, [rating, content, onDataChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOverLimit || !rating || !content.trim()) return;
    console.log({ rating, content });
  };

  return (
    <StyledPaper elevation={2}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Để lại trải nghiệm của bạn
          </Typography>
          
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight="medium">Đánh giá của bạn:</Typography>
            <StyledRating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
            />
          </Stack>

          <StyledTextField
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            error={isOverLimit}
            helperText={
              <Typography variant="caption" color={isOverLimit ? 'error' : 'textSecondary'}>
                {`${wordCount}/${WORD_LIMIT} từ${isOverLimit ? ' - Vượt quá giới hạn' : ''}`}
              </Typography>
            }
            fullWidth
            variant="outlined"
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <StyledButton
              variant="contained"
              type="submit"
              disabled={isOverLimit || !rating || !content.trim()}
              color="primary"
              endIcon={<EditIcon />}
            >
              Gửi đánh giá
            </StyledButton>
          </Box>
        </Stack>
      </form>
    </StyledPaper>
  );
};

export default ReviewInput;
