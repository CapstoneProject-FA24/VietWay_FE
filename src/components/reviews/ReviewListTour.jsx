import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography, Chip, Menu, MenuItem, CircularProgress, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from '@mui/material';
import ReviewCard from '@components/reviews/ReviewCard';
import ReviewBreakdown from '@components/reviews/ReviewBreakdown';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchTourReviews } from '@services/TourTemplateService';
import ReviewInput from '@components/reviews/ReviewInput';
import { getCookie } from '@services/AuthenService';

const ReviewListTour = ({ tourTemplateId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('helpful');
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, content: '' });
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetchTourReviews({
        tourTemplateId,
        pageSize,
        pageIndex,
        ratingValues: selectedRatings.length > 0 ? selectedRatings : undefined
      });
      console.log(response);
      setReviews(response.items);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourTemplateId) {
      fetchReviews();
    }
  }, [tourTemplateId, selectedRatings, pageIndex]);

  const handleRatingFilter = (rating) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newRatings);
    setPageIndex(1);
  };

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPageIndex(1);
    handleSortMenuClose();
  };

  const loadMoreReviews = () => {
    setVisibleReviews(prevVisible => prevVisible + 5);
  };

  const closeAdditionalReviews = () => {
    setVisibleReviews(3);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmClose = () => {
    setShowReviewInput(false);
    setReviewData({ rating: 0, content: '' });
    setOpenConfirmDialog(false);
  };

  const handleReviewDataChange = (data) => {
    setReviewData(data);
  };

  const handleReviewSubmitSuccess = async () => {
    await fetchReviews();
  };

  return (
    <>
      <Grid container spacing={0} sx={{ width: '100%' }}>
        <Grid item xs={12} md={3.2}>
          <ReviewBreakdown reviews={reviews} />
        </Grid>
        <Grid item xs={12} md={8.3} sx={{ ml: 5 }}>
          {(showReviewInput || existingReview) && (
            <Box sx={{ mb: 3 }}>
              <ReviewInput 
                onDataChange={handleReviewDataChange} 
                attractionId={attractionId}
                initialRating={existingReview?.rating || 0}
                initialContent={existingReview?.review || ''}
                onSubmitSuccess={handleReviewSubmitSuccess}
              />
            </Box>
          )}
          <Typography variant="h5" fontWeight="bold" mb={2}>Lọc theo đánh giá</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              {[5, 4, 3, 2, 1].map(rating => (
                <Chip
                  key={rating}
                  label={`${rating} sao`}
                  onClick={() => handleRatingFilter(rating)}
                  color={selectedRatings.includes(rating) ? 'primary' : 'default'}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Button
              startIcon={<FilterListIcon />}
              onClick={handleSortMenuOpen}
            >
              {sortBy === 'helpful' ? 'Hữu ích nhất' : 'Gần đây'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSortMenuClose}
            >
              <MenuItem onClick={() => handleSortChange('helpful')}>Hữu ích nhất</MenuItem>
              <MenuItem onClick={() => handleSortChange('date')}>Gần đây</MenuItem>
            </Menu>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              {reviews.slice(0, visibleReviews).map((review) => (
                <ReviewCard
                  key={review.reviewId}
                  review={{
                    ...review,
                    date: new Date(review.createdAt).toLocaleDateString('vi-VN'),
                    userName: review.reviewer.fullName,
                    userAvatar: review.reviewer.avatarUrl
                  }}
                />
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                {visibleReviews < reviews.length && (
                  <Button
                    variant="outlined"
                    onClick={loadMoreReviews}
                    sx={{ textTransform: 'none' }}
                  >
                    Xem thêm đánh giá
                  </Button>
                )}
                {visibleReviews > 3 && (
                  <Button
                    variant="outlined"
                    onClick={closeAdditionalReviews}
                    sx={{ textTransform: 'none' }}
                  >
                    Đóng bớt đánh giá
                  </Button>
                )}
              </Box>

              {visibleReviews >= reviews.length && reviews.length > 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                  Đã hiển thị tất cả đánh giá
                </Typography>
              )}
              {reviews.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                  Không có đánh giá nào phù hợp với bộ lọc
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận đóng đánh giá"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn đóng review này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Hủy</Button>
          <Button onClick={handleConfirmClose} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showLoginAlert}
        autoHideDuration={3000}
        onClose={() => setShowLoginAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowLoginAlert(false)}
          severity="warning"
          sx={{
            width: '100%',
            bgcolor: '#ffeee1',
            color: 'black',
            mt: 10,
            '& .MuiAlert-icon': { color: 'warning.main' }
          }}
        >
          Vui lòng đăng nhập để thêm đánh giá
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReviewListTour;
