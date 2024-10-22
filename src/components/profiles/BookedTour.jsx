import React, { useState, useEffect } from 'react';
import { Box, TextField, Paper, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TourStatusTab from '@components/profiles/TourStatusTab';
import RegisteredTourCard from '@components/profiles/RegisteredTourCard';
import { fetchBookingList } from '@services/BookingService';

const BookedTour = () => {
    const [statusTab, setStatusTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                setLoading(true);
                const result = await fetchBookingList();
                setBookings(result.items);
                setError(null);
            } catch (err) {
                setError('Failed to load bookings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, []);

    const handleStatusTabChange = (event, newValue) => {
        setStatusTab(newValue);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const getStatusLabel = (status) => {
        const labels = ["Chờ thanh toán", "Đã thanh toán", "Đã hoàn tất", "Đã hủy", "Quá hạn thanh toán"];
        return labels[status] || "Unknown";
    };

    const filteredBookings = bookings.filter(booking => 
        (booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusTab === 0 || booking.status === statusTab - 1)
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
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        filteredBookings.map((booking) => (
                            <RegisteredTourCard 
                                key={booking.bookingId} 
                                tour={{
                                    bookingId: booking.bookingId,
                                    name: booking.tourName,
                                    code: booking.code,
                                    bookedTourStatus: getStatusLabel(booking.status),
                                    imageUrl: booking.imageUrl,
                                    numberOfParticipants: booking.numberOfParticipants,
                                    totalPrice: booking.totalPrice,
                                    bookingDate: booking.bookingDate
                                }} 
                            />
                        ))
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default BookedTour;
