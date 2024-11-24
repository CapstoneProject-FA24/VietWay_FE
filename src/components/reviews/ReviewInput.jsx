import React, { useState, useEffect } from 'react';
import { Box, Paper, Rating, TextField, Button, Typography, Stack, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon } from '@mui/icons-material';
import { addAttractionReview, updateAttractionReview } from '@services/AttractionService';

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

const ReviewInput = ({ 
  onDataChange, 
  attractionId, 
  initialRating = 0, 
  initialContent = '',
  onSubmitSuccess
}) => {
  const countWords = (text) => {
    const trimmedText = text.trim();
    return trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;
  };

  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(countWords(initialContent));
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const isOverLimit = wordCount > WORD_LIMIT;

  const [isEditMode, setIsEditMode] = useState(false);
  const hasExistingReview = initialRating > 0 || initialContent.length > 0;

  useEffect(() => {
    if (typeof onDataChange === 'function') {
      onDataChange({ rating, content });
    }
  }, [rating, content, onDataChange]);

  useEffect(() => {
    setRating(initialRating);
    setContent(initialContent);
    setWordCount(countWords(initialContent));
  }, [initialRating, initialContent]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(countWords(newContent));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOverLimit || !rating || !content.trim()) return;

    try {
      if (hasExistingReview) {
        await updateAttractionReview(attractionId, {
          rating: rating,
          review: content.trim()
        });
        setSnackbarState({
          open: true,
          severity: 'success',
          message: 'Đánh giá của bạn đã được cập nhật thành công!'
        });
        setIsEditMode(false);
      } else {
        await addAttractionReview(attractionId, {
          rating: rating,
          review: content.trim()
        });
        setSnackbarState({
          open: true,
          severity: 'success',
          message: 'Đánh giá của bạn đã được gửi thành công!'
        });
      }
      
      if (onSubmitSuccess) {
        await onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbarState({
        open: true,
        severity: 'error',
        message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.'
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState(prev => ({ ...prev, open: false }));
  };

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <>
      <StyledPaper elevation={2}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Trải nghiệm của bạn
          </Typography>

          <Stack spacing={1}>
            <StyledRating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
              readOnly={hasExistingReview && !isEditMode}
            />
          </Stack>

          {hasExistingReview && !isEditMode ? (
            <>
              <Typography 
                variant="body1" 
                sx={{ whiteSpace: 'pre-wrap', my: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}
              >
                {content}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButton variant="outlined" onClick={handleToggleEdit} color="primary" endIcon={<EditIcon />}>
                  Chỉnh sửa
                </StyledButton>
              </Box>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <StyledTextField multiline rows={3} value={content} onChange={handleContentChange} placeholder="Chia sẻ trải nghiệm của bạn..." error={isOverLimit} helperText={
                    <Typography variant="caption" color={isOverLimit ? 'error' : 'textSecondary'}>
                      {`${wordCount}/${WORD_LIMIT} từ${isOverLimit ? ' - Vượt quá giới hạn' : ''}`}
                    </Typography>
                  } fullWidth variant="outlined" />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  {hasExistingReview && (
                    <StyledButton variant="outlined" onClick={handleToggleEdit} color="inherit">
                      Hủy
                    </StyledButton>
                  )}
                  <StyledButton variant="contained" type="submit" disabled={isOverLimit || !rating || !content.trim()} color="primary" endIcon={<EditIcon />}>
                    {hasExistingReview ? 'Cập nhật' : 'Gửi đánh giá'}
                  </StyledButton>
                </Box>
              </Stack>
            </form>
          )}
        </Stack>
      </StyledPaper>

      <Snackbar open={snackbarState.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarState.severity} variant="filled" sx={{ width: '100%', mt: 10 }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReviewInput;
