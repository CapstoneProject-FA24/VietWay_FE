import React from 'react';
import { Box, TextField, Paper, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TourStatusTab from '@components/TourStatusTab';
import RegisteredTourCard from '@components/RegisteredTourCard';

const BookedTour = ({ statusTab, handleStatusTabChange, searchTerm, handleSearchChange, filteredTours }) => {
    return (
        <Box sx={{ my: 5 }}>
            <TextField 
                fullWidth 
                placeholder="Tìm kiếm theo Tên tour và Mã tour"
                value={searchTerm} 
                onChange={handleSearchChange} 
                sx={{ 
                    mb: 2, 
                    backgroundColor: 'white', 
                    borderRadius: '10px',
                    display: 'flex', 
                    justifyContent: 'center', 
                }}
                InputProps={{ 
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ) 
                }} 
            />
            <Paper sx={{ p: 2, borderRadius: '8px' }}>
                <TourStatusTab 
                    statusTab={statusTab} 
                    handleStatusTabChange={handleStatusTabChange} 
                    searchTerm={searchTerm} 
                    handleSearchChange={handleSearchChange} 
                />
                <Box sx={{ mt: 2 }}>
                    {filteredTours.map((tour) => (
                        <RegisteredTourCard key={tour.id} tour={tour} />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default BookedTour;

