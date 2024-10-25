import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, Chip, Divider } from '@mui/material';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FeedbackPopup from '@components/profiles/FeedbackPopup';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import { Link } from 'react-router-dom';

const RegisteredTourCard = ({ tour }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleFeedbackOpen = () => setIsFeedbackOpen(true);
  const handleFeedbackClose = () => setIsFeedbackOpen(false);
  console.log(tour);
  return (
    <Box sx={{ 
      p: 0.5, // Padding around the card
      mb: 2, // Margin bottom to create space between cards
      bgcolor: 'background.paper', // Background color from theme
      borderRadius: '16px', // Rounded corners for the box
      boxShadow: 2, // Add some shadow to the box
    }}>
      <Card component={Link} to={`/booking/${tour.bookingId}`}
        sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'none', position: 'relative' }}>
        <StatusChip status={tour.bookedTourStatus} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={3}>
            <CardMedia
              component="img"
              sx={{
                margin: '12px',
                borderRadius: '8px',
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
              image={tour.imageUrl}
              alt={tour.name}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                {tour.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoItem icon={<SubtitlesOutlinedIcon />} label="Mã booking" value={tour.bookingId} />
                  <InfoItem icon={<TourOutlinedIcon />} label="Mã tour" value={tour.code} />
                  <InfoItem icon={<CalendarMonthOutlinedIcon />} label="Ngày đặt" value={formatDate(tour.bookingDate)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem icon={<GroupOutlinedIcon />} label="Số lượng khách" value={tour.numberOfParticipants} />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'inline' }}>
                      Tổng tiền:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'inline', ml: 1 }}>
                      {tour.totalPrice.toLocaleString()} đ
                    </Typography>
                  </Box>
                  {/* <InfoItem icon={<MapOutlinedIcon />} label="Khởi hành từ" value={tour.startProvince} />
                  <InfoItem icon={<AccessTimeIcon />} label="Thời gian tour" value={`${formatDate(tour.startDate)} - ${formatDate(tour.endDate)}`} /> */}
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid item xs={12} sm={2} md={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', p: 2, pb: 5 }}>
            {renderActionButtons(tour.bookedTourStatus, handleFeedbackOpen)}
          </Grid>
        </Grid>
        {isFeedbackOpen && <FeedbackPopup onClose={handleFeedbackClose} tourId={tour.id} />}
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

const StatusChip = ({ status }) => (
  <Chip
    label={status}
    color={
      status === "Đã hoàn tất" ? "success" :
        status === "Đã thanh toán" ? "primary" :
          status === "Đã hủy" || status === "Quá hạn thanh toán" ? "error" : "warning"
    }
    sx={{
      position: 'absolute',
      top: 20,
      right: 15,
      zIndex: 1,
      fontSize: '0.75rem',
      height: '24px'
    }}
  />
);

const renderActionButtons = (status, handleFeedbackOpen) => {
  switch (status) {
    case "Đã hoàn tất":
      return (
        <>
          <ActionButton onClick={handleFeedbackOpen} variant="contained" color="primary">Đánh giá</ActionButton>
          <ActionButton variant="outlined" color="primary">Đặt Lại</ActionButton>
        </>
      );
    case "Đã thanh toán":
      return <ActionButton variant="outlined" color="primary">Hủy Đặt</ActionButton>;
    case "Đã hủy":
    case "Quá hạn thanh toán":
      return <ActionButton variant="contained" color="primary">Đặt Lại</ActionButton>;
    default:
      return (
        <>
          <ActionButton variant="contained" color="error">Thanh Toán</ActionButton>
          <ActionButton variant="outlined" color="primary">Hủy Đặt</ActionButton>
        </>
      );
  }
};

const ActionButton = ({ children, ...props }) => (
  <Button {...props} sx={{ mb: 1, width: '100%', height: '40px', borderRadius: '8px' }}>
    {children}
  </Button>
);

export default RegisteredTourCard;
