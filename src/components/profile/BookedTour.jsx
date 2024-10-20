import React from 'react';
import { Box, TextField, Paper, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TourStatusTab from '@components/TourStatusTab';
import RegisteredTourCard from '@components/profile/RegisteredTourCard';

const BookedTour = ({ statusTab, handleStatusTabChange, searchTerm, handleSearchChange, filteredTours }) => {
    const getStatusLabel = (index) => {
        const labels = ["Tất cả", "Chờ thanh toán", "Đã thanh toán", "Đã hoàn tất", "Đã hủy", "Quá hạn thanh toán"];
        return labels[index];
    };

    const filteredAndStatusTours = filteredTours.filter(tour => 
        statusTab === 0 || tour.bookedTourStatus === getStatusLabel(statusTab)
    );

    return (
        <Box sx={{ my: 5 }}>
            <TextField 
                fullWidth 
                placeholder="Tìm kiếm theo Tên tour và Mã tour" 
                value={searchTerm} 
                onChange={handleSearchChange} 
                sx={{ mb: 2, backgroundColor: 'white', borderRadius: '10px', display: 'flex', justifyContent: 'center' }}
                InputProps={{ 
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ) 
                }} 
            />
            <Paper sx={{ p: 2, borderRadius: '8px' }}>
                <TourStatusTab statusTab={statusTab} handleStatusTabChange={handleStatusTabChange} />
                <Box sx={{ mt: 2 }}>
                    {filteredAndStatusTours.map((tour) => (
                        <RegisteredTourCard key={tour.id} tour={tour} />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default BookedTour;
