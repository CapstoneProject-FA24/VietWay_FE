import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, Chip } from '@mui/material';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FeedbackPopup from '@components/profiles/FeedbackPopup';

const RegisteredTourCard = ({ tour }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleFeedbackOpen = () => {
    setIsFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setIsFeedbackOpen(false);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden', boxShadow: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3} md={3}>
          <CardMedia component="img" sx={{ margin: '6px', borderRadius: '10px', width: '100%', height: '180px', objectFit: 'cover' }} image={tour.image} alt={tour.name} />
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {tour.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5.5}>
              <CardContent>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SubtitlesOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
                  Mã booking: {tour.bookingId}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MapOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
                  Ngày đặt: {new Date(tour.bookingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonthOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
                  Số lượng khách: {tour.totalParticipants}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', mr: 1 }}>
                    Tổng tiền:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {tour.totalPrice.toLocaleString()} đ
                  </Typography>
                </Box>
              </CardContent>
            </Grid>
            <Grid item xs={6} md={6.5} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SubtitlesOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
                Mã tour: {tour.code}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MapOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
                Khởi hành từ: {tour.startProvince}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarMonthOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
                Thời gian tour: {new Date(tour.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date(tour.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>


        <Grid item xs={6} sm={1.6} md={1.6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {tour.bookedTourStatus === "Đã hoàn tất" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2, width: '100%', height: '50px', borderRadius: '10px' }}
                onClick={handleFeedbackOpen}
              >
                Đánh giá
              </Button>
              <Button variant="outlined" color="primary" sx={{ width: '100%', height: '50px', borderRadius: '10px' }}>
                Đặt Lại
              </Button>
            </>
          ) : tour.bookedTourStatus === "Đã thanh toán" ? (
            <Button variant="outlined" color="primary" sx={{ width: '100%', height: '50px', borderRadius: '10px' }}>
              Hủy Đặt
            </Button>
          ) : tour.bookedTourStatus === "Đã hủy" || tour.bookedTourStatus === "Quá hạn thanh toán" ? (
            <Button variant="contained" color="primary" sx={{ width: '100%', height: '50px', borderRadius: '10px' }}>
              Đặt Lại
            </Button>
          ) : (
            <>
              <Button variant="contained" color="error" sx={{ mb: 2, width: '100%', height: '50px', borderRadius: '10px' }}>
                Thanh Toán
              </Button>
              <Button variant="outlined" color="primary" sx={{ width: '100%', height: '50px', borderRadius: '10px' }}>
                Hủy Đặt
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      {isFeedbackOpen && <FeedbackPopup onClose={handleFeedbackClose} tourId={tour.id} />}
    </Card >
  );
};

export default RegisteredTourCard;
