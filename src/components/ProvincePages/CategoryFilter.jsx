import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import ExploreIcon from '@mui/icons-material/Explore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const [activeIndex, setActiveIndex] = useState(0); // State to track the current active category index

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'explore':
        return <ExploreIcon />;
      case 'eat':
        return <RestaurantIcon />;
      case 'stay':
        return <HotelIcon />;
      case 'activities':
        return <LocalActivityIcon />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const index = categories.indexOf(selectedCategory);
    setActiveIndex(index);
  }, [selectedCategory, categories]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    onCategoryChange(categories[index]);
  };

  return (
    <Box sx={{ mb: 2, marginTop: 3, marginBottom: 3 }}>
      <ScrollMenu>
        {categories.map((category, index) => (
          <Chip
            key={category}
            icon={getCategoryIcon(category)}
            label={
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {category}
              </Typography>
            }
            onClick={() => handleDotClick(index)}
            sx={{
              m: 0.5,
              p: 2,
              borderRadius: '20px',
              backgroundColor: 'white',
              border: activeIndex === index ? '2px solid #000' : '1px solid #ccc',
              '&:hover': { backgroundColor: '#e0e0e0' },
              transition: 'all 0.3s',
              '& .MuiChip-icon': { fontSize: '1.5rem', marginRight: '8px' },
            }}
          />
        ))}
      </ScrollMenu>
    </Box>
  );
};

export default CategoryFilter;
