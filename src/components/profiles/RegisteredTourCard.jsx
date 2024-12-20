import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, Chip, Divider, Snackbar, Alert, Portal } from '@mui/material';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FeedbackPopup from '@components/profiles/FeedbackPopup';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import { Link, useNavigate } from 'react-router-dom';
import CancelBooking from '@components/profiles/CancelBooking';
import { BookingStatus } from '@hooks/Statuses';
import { getBookingStatusInfo } from "@services/StatusService";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ViewFeedback from '@components/profiles/ViewFeedback';

const RegisteredTourCard = ({ tour, onBookingCancelled, onBookingFeedback }) => {
  console.log(tour);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false);
  const navigate = useNavigate();

  const handleFeedbackOpen = () => setIsFeedbackOpen(true);
  const handleFeedbackClose = () => setIsFeedbackOpen(false);
  const handlePayment = () => navigate(`/booking/${tour.bookingId}`);
  const handleCancelOpen = () => setIsCancelOpen(true);
  const handleCancelClose = () => setIsCancelOpen(false);
  const handleViewFeedbackClose = () => setIsViewFeedbackOpen(false);

  const handleCancelConfirm = async (reason) => {
    try {
      setCancelLoading(true);
      onBookingCancelled(tour.bookingId, reason);
      handleCancelClose();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0.5, mb: 2, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 2 }}>
      <Card
        sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'none', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 1, mb: -6 }}>
          {tour.havePendingRefund && <Chip label="Chờ hoàn tiền" sx={{ fontSize: '0.75rem', height: '24px', backgroundColor: '#FF9800', color: 'white' }} />}
          <Chip label={getBookingStatusInfo(tour.bookedTourStatus).text}
            sx={{ fontSize: '0.75rem', height: '24px', backgroundColor: getBookingStatusInfo(tour.bookedTourStatus).color, color: 'white', mr: 2 }}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={3} component={Link} to={`/booking/${tour.bookingId}`}>
            <CardMedia component="img" sx={{ margin: '12px', borderRadius: '8px', width: '100%', height: '190px' }}
              image={tour.imageUrl} alt={tour.name} />
          </Grid>
          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.35rem' }} component={Link} to={`/booking/${tour.bookingId}`}>
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
            bookingId={tour.bookingId}
            onSubmitSuccess={(bookingId, rating, feedback, isPublic) => {
              handleFeedbackClose();
              if (onBookingFeedback) {
                onBookingFeedback(bookingId, rating, feedback, isPublic);
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

const renderActionButtons = (handleFeedbackOpen, handlePayment, handleCancelOpen, tour) => {
  const isCancellationAllowed = () => {
    const today = new Date();
    const startDate = new Date(tour.startDate);
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    return today < startDate;
  };

  switch (tour.bookedTourStatus) {
    case BookingStatus.Completed:
      return (
        <>
          {(() => {
            const tourEndDate = new Date(tour.startDate);
            tourEndDate.setDate(tourEndDate.getDate() + tour.numberOfDay);
            const feedbackDeadline = new Date(tourEndDate);
            feedbackDeadline.setDate(feedbackDeadline.getDate() + 7);
            
            const currentDate = new Date();
            
            return currentDate <= feedbackDeadline && (
              <ActionButton
                onClick={handleFeedbackOpen}
                variant="contained"
                color="primary"
              >
                {tour.isReviewed ? 'Xem đánh giá' : 'Đánh giá'}
              </ActionButton>
            );
          })()}
        </>
      );
    case BookingStatus.Paid:
      return isCancellationAllowed() ? (
        <ActionButton onClick={handleCancelOpen} variant="outlined" color="primary">
          Hủy Đặt
        </ActionButton>
      ) : null;
    case BookingStatus.Pending:
      return (
        <>
          <ActionButton variant="contained" color="error" onClick={handlePayment}>Thanh Toán</ActionButton>
          <ActionButton variant="outlined" color="primary" onClick={handleCancelOpen}>Hủy Đặt</ActionButton>
        </>
      );
    case BookingStatus.Deposited:
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