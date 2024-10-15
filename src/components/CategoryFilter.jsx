import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'exit':
        return <ExitToAppIcon />;
      case 'ux design':
        return <DesignServicesIcon />;
      case 'user':
        return <AccountCircleIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 2, mt: 2 }}>
      <ScrollMenu>
        {categories.map((category) => (
          <Chip
            key={category}
            icon={getCategoryIcon(category)}
            label={
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', py: 1, px: 0.5 }}>
                {category}
              </Typography>
            }
            onClick={() => onCategoryChange(category)}
            color={selectedCategory === category ? 'primary' : 'default'}
            sx={{
              m: 0.5,
              height: 'auto',
              '& .MuiChip-icon': {
                fontSize: '1.5rem',
                marginLeft: '8px',
              },
              borderRadius: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
              },
            }}
          />
        ))}
      </ScrollMenu>
    </Box>
  );
};

export default CategoryFilter;
