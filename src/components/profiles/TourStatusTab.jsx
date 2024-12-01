import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const TourStatusTab = ({ statusTab, handleStatusTabChange, searchTerm, handleSearchChange }) => {
  return (
    <Box>
      <Tabs value={statusTab} onChange={handleStatusTabChange} variant="scrollable" scrollButtons="auto" 
      sx={{ '& .MuiTab-root': { color: '#000', '&.Mui-selected': { color: '#000', fontWeight: 'bold' }, flex: 1, textAlign: 'center' }, 
      '& .MuiTabs-indicator': { backgroundColor: '#000' }, backgroundColor: 'white', borderRadius: '8px', mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Tab label="Tất cả" />
        <Tab label="Chờ thanh toán" />
        <Tab label="Đã đặt cọc" />
        <Tab label="Đã thanh toán" />
        <Tab label="Hoàn tất" />
        <Tab label="Đã hủy" />
      </Tabs>
    </Box>
  );
};

export default TourStatusTab;
