import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Stack, Tabs, Tab, Backdrop } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import AttractionSavedCard from '@components/saved/AttractionSavedCard';

// Custom TabPanel component
function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`saved-tabpanel-${index}`}
      aria-labelledby={`saved-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 2, marginLeft: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SideSavedTab = ({ onClose, attraction, isLiked, onUnlike }) => {
  const [savedAttractions, setSavedAttractions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const THIRTY_MINUTES = 30 * 60 * 1000;

  useEffect(() => {
    if (isLiked && attraction) {
      const newAttraction = {
        id: attraction.attractionId,
        name: attraction.name,
        imageUrl: attraction.imageUrl,
        address: attraction.address,
        province: attraction.province,
        attractionType: attraction.attractionType,
        rating: attraction.rating
      };

      setSavedAttractions(prev => {
        if (!prev.some(item => item.id === newAttraction.id)) {
          return [newAttraction, ...prev];
        }
        return prev;
      });
    }
  }, [isLiked, attraction]);

  const handleUnlike = (attractionId) => {
    setSavedAttractions(prev => {
      const filtered = prev.filter(item => item.id !== attractionId);
      return filtered;
    });

    if (onUnlike) {
      onUnlike(attractionId);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const drawerStyles = { 
    width: 550, 
    height: '100vh', 
    bgcolor: 'background.paper', 
    boxShadow: 1, 
    position: 'fixed', 
    right: 0, 
    top: 0, 
    borderTopLeftRadius: 15, 
    borderBottomLeftRadius: 15, 
    zIndex: 1201, 
    overflowY: 'auto', 
    animation: 'slideIn 0.3s ease-out' 
  };

  return (
    <>
      <Backdrop open={true} sx={{ zIndex: 1200 }} onClick={onClose} />
      <Box sx={drawerStyles}>
        {timeRemaining && (
          <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 48, color: 'text.secondary' }}>
            Next show in: {Math.ceil(timeRemaining / (60 * 1000))} min
          </Typography>
        )}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 3, ml: 1, position: 'sticky', top: 1, bgcolor: 'background.paper', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CardTravelIcon fontSize="medium"/>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {tabValue === 0 ? 'Các điểm tham quan đã lưu' : 'Các bài viết đã lưu'}
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ ml: 'auto', '&:hover': { backgroundColor: 'transparent' } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          height: 'calc(100vh - 120px)'
        }}>
          <CustomTabPanel value={tabValue} index={0}>
            <Stack spacing={2}>
              {savedAttractions.map((attraction) => (
                <AttractionSavedCard 
                  key={attraction.id} 
                  attraction={attraction}
                  onUnlike={handleUnlike}
                />
              ))}
              {savedAttractions.length === 0 && (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Chưa có điểm đến nào được lưu
                </Typography>
              )}
            </Stack>
          </CustomTabPanel>
          
          <CustomTabPanel value={tabValue} index={1}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Chưa có bài viết nào được lưu
            </Typography>
          </CustomTabPanel>
        </Box>

        <Box sx={{ position: 'fixed', bottom: 0, width: 550, bgcolor: 'background.paper', zIndex: 1 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ minHeight: 48, position: 'relative', '& .MuiTabs-flexContainer': { gap: 0, px: 0 },
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '1rem', minHeight: 42, borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', position: 'relative', transition: 'all 0.2s ease-in-out', border: '1px solid', borderColor: 'grey.300', borderTop: 'none',
                '&::before, &::after': { content: '""', position: 'absolute', bottom: 0, width: 15, height: '100%', background: 'inherit', borderBottom: '1px solid', borderColor: 'inherit', zIndex: 1 },
                '&::before': { left: -10, transform: 'skewX(20deg)', borderLeft: '1px solid', borderColor: 'inherit' },
                '&::after': { right: -10, transform: 'skewX(-20deg)', borderRight: '1px solid', borderColor: 'inherit' },
                '&:not(.Mui-selected)': { bgcolor: 'grey.200', color: 'text.secondary', '&::after, &::before': { bgcolor: 'grey.200' },
                '&::after, &::before, &': {
                  '&::after': { content: '""', position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.1)', zIndex: 2 },
                },
                '&.Mui-selected': { color: 'primary.main', bgcolor: 'common.white', zIndex: 2, '&::after, &::before': { bgcolor: 'common.white' } }
                }
              },
              '& .MuiTabs-indicator': { display: 'none' }
            }}>
            <Tab label="Điểm tham quan" />
            <Tab label="Bài viết" />
          </Tabs>
        </Box>
      </Box>
    </>
  );
};

export default SideSavedTab;
