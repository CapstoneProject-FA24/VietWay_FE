import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, Chip, Divider, Snackbar, Alert } from '@mui/material';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FeedbackPopup from '@components/profiles/FeedbackPopup';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import { Link, useNavigate } from 'react-router-dom';
import CancelBooking from '@components/profiles/CancelBooking';
import { cancelBooking } from '@services/BookingService';
import { BookingStatus } from '@hooks/Statuses';
import { getBookingStatusInfo } from "@services/StatusService";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ViewFeedback from '@components/profiles/ViewFeedback';

const RegisteredTourCard = ({ tour, onBookingCancelled }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false);
  const navigate = useNavigate();

  const handleFeedbackOpen = () => setIsFeedbackOpen(true);
  const handleFeedbackClose = () => setIsFeedbackOpen(false);
  const handlePayment = () => navigate(`/thanh-toan/${tour.bookingId}`);
  const handleCancelOpen = () => setIsCancelOpen(true);
  const handleCancelClose = () => setIsCancelOpen(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleViewFeedbackOpen = () => setIsViewFeedbackOpen(true);
  const handleViewFeedbackClose = () => setIsViewFeedbackOpen(false);

  const handleCancelConfirm = async (reason) => {
    try {
      setCancelLoading(true);
      await cancelBooking(tour.bookingId, reason);
      handleCancelClose();
      setSnackbar({
        open: true,
        message: 'Hủy đặt tour thành công',
        severity: 'success'
      });
      // Refresh the booking list
      if (onBookingCancelled) {
        onBookingCancelled();
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setSnackbar({
        open: true,
        message: 'Không thể hủy đặt tour. Vui lòng thử lại sau.',
        severity: 'error'
      });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0.5, mb: 2, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 2 }}>
      <Card
        sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'none', position: 'relative' }}>
        <StatusChip status={tour.bookedTourStatus} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={3} component={Link} to={`/booking/${tour.bookingId}`}>
            <CardMedia component="img" sx={{ margin: '12px', borderRadius: '8px', width: '100%' }}
              image={tour.imageUrl} alt={tour.name} />
          </Grid>
          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }} component={Link} to={`/booking/${tour.bookingId}`}>
                {tour.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} component={Link} to={`/booking/${tour.bookingId}`}>
                  <InfoItem icon={<SubtitlesOutlinedIcon />} label="Mã booking" value={tour.bookingId} />
                  <InfoItem icon={<TourOutlinedIcon />} label="Mã tour" value={tour.code} />
                  <InfoItem icon={<CalendarMonthOutlinedIcon />} label="Ngày đặt" value={formatDate(tour.bookingDate)} />
                </Grid>
                <Grid item xs={12} md={6} component={Link} to={`/booking/${tour.bookingId}`}>
                  <InfoItem icon={<GroupOutlinedIcon />} label="Số lượng khách" value={tour.numberOfParticipants} />
                  <InfoItem icon={<AccessTimeIcon />} label="Thời gian khởi hành" value={`${formatDate(tour.startDate)}`} />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'inline' }}>
                      Tổng tiền:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'inline', ml: 1 }}>
                      {tour.totalPrice.toLocaleString()} đ
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid item xs={12} sm={2} md={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', p: 2, pb: 5 }}>
            {renderActionButtons(handleFeedbackOpen, handlePayment, handleCancelOpen, tour)}
          </Grid>
        </Grid>
        {isFeedbackOpen && 
          <FeedbackPopup 
            onClose={handleFeedbackClose} 
            tourId={tour.id} 
            onSubmitSuccess={() => {
              handleFeedbackClose();
              if (onBookingCancelled) {
                onBookingCancelled();
              }
            }} 
          />
        }
        {isViewFeedbackOpen && 
          <ViewFeedback 
            onClose={handleViewFeedbackClose}
            feedback={tour.feedback}
          />
        }
        <CancelBooking
          open={isCancelOpen}
          onClose={handleCancelClose}
          onConfirm={handleCancelConfirm}
          loading={cancelLoading}
          tour={tour}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {React.cloneElement(icon, { sx: { mr: 1, fontSize: '1.5rem' } })}
    <Typography variant="body2" color="text.primary">
      <strong>{label}:</strong>
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
      {value}
    </Typography>
  </Box>
);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const StatusChip = ({ status }) => {
  return (
    <Chip
      label={getBookingStatusInfo(status).text}
      sx={{
        position: 'absolute',
        top: 20,
        right: 15,
        zIndex: 1,
        fontSize: '0.75rem',
        height: '24px',
        backgroundColor: getBookingStatusInfo(status).color,
        color: 'white',
      }}
    />
  );
};

const renderActionButtons = (handleFeedbackOpen, handlePayment, handleCancelOpen, tour) => {
  switch (tour.bookedTourStatus) {
    case BookingStatus.Completed:
      return (
        <>
          <ActionButton 
            onClick={tour.hasFeedback ? handleViewFeedbackOpen : handleFeedbackOpen} 
            variant="contained" 
            color="primary"
          >
            {tour.hasFeedback ? 'Xem lại đánh giá' : 'Đánh giá'}
          </ActionButton>
        </>
      );
    case BookingStatus.Confirmed:
      return <ActionButton onClick={handleCancelOpen} variant="outlined" color="primary">Hủy Đặt</ActionButton>;
    case BookingStatus.Pending:
      return (
        <>
          <ActionButton variant="contained" color="error" onClick={handlePayment}>Thanh Toán</ActionButton>
          <ActionButton variant="outlined" color="primary" onClick={handleCancelOpen}>Hủy Đặt</ActionButton>
        </>
      );
    default:
      return <></>;
  }
};

const ActionButton = ({ children, ...props }) => (
  <Button {...props} sx={{ mb: 1, width: '100%', height: '40px', borderRadius: '8px' }}>
    {children}
  </Button>
);

export default RegisteredTourCard;