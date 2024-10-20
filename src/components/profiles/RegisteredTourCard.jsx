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
          <CardMedia component="img" sx={{ margin: '6px', borderRadius: '10px', width: '100%', height: '95%', objectFit: 'cover' }} image={tour.images[0].url} alt={tour.name} />
        </Grid>

        <Grid item xs={12} sm={4} md={4}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {tour.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SubtitlesOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
              {tour.id}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MapOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
              Khởi hành từ: {tour.pickupPoints[0]}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonthOutlinedIcon sx={{ marginRight: '8px', fontSize: 'small' }} />
              Ngày khởi hành: {tour.startDate}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1, marginLeft: '20px' }}>
              Bao gồm:
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: '30px' }}>
              - Người lớn: 2x {tour.price.adult.toLocaleString()} đ
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: '30px' }}>
              - Trẻ em: 1x {tour.price.children.toLocaleString()} đ
            </Typography>
          </CardContent>
        </Grid>

        <Grid item xs={6} sm={2} md={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary'}}>
            <AccessTimeIcon sx={{ marginRight: '8px', fontSize: 'large' }} />
            {tour.duration}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1 }}>
            Tổng tiền:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {tour.price.adult.toLocaleString()} đ
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {tour.bookedTourStatus === "Đã hoàn tất" ? (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mb: 2, width: '60%', height: '50px', borderRadius: '10px' }}
                onClick={handleFeedbackOpen}
              >
                Đánh giá
              </Button>
              <Button variant="outlined" color="primary" sx={{ width: '60%', height: '50px', borderRadius: '10px' }}>
                Đặt Lại
              </Button>
            </>
          ) : tour.bookedTourStatus === "Đã thanh toán" ? (
            <Button variant="outlined" color="primary" sx={{ width: '60%', height: '50px', borderRadius: '10px' }}>
              Hủy Đặt
            </Button>
          ) : tour.bookedTourStatus === "Đã hủy" || tour.bookedTourStatus === "Quá hạn thanh toán" ? (
            <Button variant="contained" color="primary" sx={{ width: '60%', height: '50px', borderRadius: '10px' }}>
              Đặt Lại
            </Button>
          ) : (
            <>
              <Button variant="contained" color="error" sx={{ mb: 2, width: '60%', height: '50px', borderRadius: '10px' }}>
                Thanh Toán
              </Button>
              <Button variant="outlined" color="primary" sx={{ width: '60%', height: '50px', borderRadius: '10px' }}>
                Hủy Đặt
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      {isFeedbackOpen && <FeedbackPopup onClose={handleFeedbackClose} tourId={tour.id} />}
    </Card>
  );
};

export default RegisteredTourCard;
