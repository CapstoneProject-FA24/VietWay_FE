import React, { useState, useEffect } from 'react';
import { Box, TextField, Paper, InputAdornment, CircularProgress, Pagination, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TourStatusTab from '@components/profiles/TourStatusTab';
import RegisteredTourCard from '@components/profiles/RegisteredTourCard';
import { fetchBookingList, cancelBooking, submitBookingReview } from '@services/BookingService';

const BookedTour = () => {
    const [statusTab, setStatusTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const loadBookings = async () => {
            try {
                setLoading(true);
                const result = await fetchBookingList(pageSize, page);
                setBookings(result.items);
                setTotalItems(result.total);
                setError(null);
            } catch (err) {
                setError('Failed to load bookings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [page, pageSize]);

    const handleStatusTabChange = (event, newValue) => {
        setStatusTab(newValue);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredBookings = bookings.filter(booking =>
        (booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (
            statusTab === 0 ||
            booking.status === statusTab - 1
        )
    );

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1); // Reset to first page when changing page size
    };

    const handleBookingCancelled = async (bookingId, reason) => {
        try {
            await cancelBooking(bookingId, reason);
            setSnackbar({
                open: true,
                message: 'Hủy đặt tour thành công',
                severity: 'success'
            });
            const result = await fetchBookingList(pageSize, page);
            setBookings(result.items);
            setTotalItems(result.total);
            setError(null);
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            setSnackbar({
                open: true,
                message: 'Không thể hủy đặt tour. Vui lòng thử lại sau.',
                severity: 'error'
            });
        }
    };

    const handleBookingFeedback = async (bookingId, rating, feedback, isPublic) => {
        try {
            await submitBookingReview(bookingId, rating, feedback, isPublic);
            setSnackbar({
                open: true,
                message: 'Đánh giá tour thành công',
                severity: 'success'
            });
            const result = await fetchBookingList(pageSize, page);
            setBookings(result.items);
            setTotalItems(result.total);
            setError(null);
        } catch (err) {
            console.error('Failed to feedback booking:', err);
            setSnackbar({
                open: true,
                message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
                severity: 'error'
            });
        }
    };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

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
                        <>
                            {filteredBookings.map((booking) => (
                                <RegisteredTourCard
                                    key={booking.bookingId}
                                    tour={{
                                        tourId: booking.tourId,
                                        bookingId: booking.bookingId,
                                        name: booking.tourName,
                                        code: booking.code,
                                        bookedTourStatus: booking.status,
                                        imageUrl: booking.imageUrl,
                                        numberOfParticipants: booking.numberOfParticipants,
                                        totalPrice: booking.totalPrice,
                                        bookingDate: booking.bookingDate,
                                        startDate: booking.startDate,
                                        isReviewed: booking.isReviewed,
                                        havePendingRefund: booking.havePendingRefund
                                    }}
                                    onBookingCancelled={handleBookingCancelled}
                                    onBookingFeedback={handleBookingFeedback}
                                />
                            ))}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2
                            }}>
                                <Box sx={{ width: '10%' }} />
                                <Pagination
                                    count={Math.ceil(totalItems / pageSize)}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <InputLabel>Tour/trang</InputLabel>
                                    <Select
                                        value={pageSize}
                                        label="Tour/trang"
                                        onChange={handlePageSizeChange}
                                    >
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </>
                    )}
                </Box>
            </Paper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        mt: 8
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BookedTour;
