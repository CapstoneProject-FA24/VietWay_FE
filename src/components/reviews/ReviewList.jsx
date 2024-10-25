import React, { useState, useMemo } from 'react';
import { Box, Button, Typography, Chip, Menu, MenuItem } from '@mui/material';
import ReviewCard from '@components/reviews/ReviewCard';
import { mockReviews } from '@hooks/MockReviews';
import FilterListIcon from '@mui/icons-material/FilterList';

const ReviewList = () => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('helpful');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleRatingFilter = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    handleSortMenuClose();
  };

  const parseDate = (dateString) => {
    const [month, year] = dateString.split(' ').slice(1);
    const monthMap = {
      '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
      '7': 6, '8': 7, '9': 8, '10': 9, '11': 10, '12': 11
    };
    return new Date(parseInt(year), monthMap[month], 1);
  };

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = mockReviews;
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(review => selectedRatings.includes(review.rating));
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      return parseDate(b.date) - parseDate(a.date);
    });
  }, [selectedRatings, sortBy]);

  const loadMoreReviews = () => {
    setVisibleReviews(prevVisible => prevVisible + 5);
  };

  const closeAdditionalReviews = () => {
    setVisibleReviews(3);
  };

  return (
    <Box>
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
          {/* {selectedRatings.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Lọc {selectedRatings.length} loại đánh giá
            </Typography>
          )} */}
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

      {filteredAndSortedReviews.slice(0, visibleReviews).map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
        {visibleReviews < filteredAndSortedReviews.length && (
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

      {visibleReviews >= filteredAndSortedReviews.length && filteredAndSortedReviews.length > 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
          Đã hiển thị tất cả đánh giá
        </Typography>
      )}
      {filteredAndSortedReviews.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
          Không có đánh giá nào phù hợp với bộ lọc
        </Typography>
      )}
    </Box>
  );
};

export default ReviewList;
