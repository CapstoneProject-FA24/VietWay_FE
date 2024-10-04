import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';

const RegisteredTourCard = ({ tour }) => {
  return (
    <Card sx={{ display: 'flex', mb: 2, borderRadius: '8px', overflow: 'hidden', boxShadow: 3 }}>
      <CardMedia component="img" 
      sx={{ width: '28%', height: '23%', margin: '10px' }} 
      image={tour.images[0].url} alt={tour.name} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
        <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography component="div" variant="h6" sx={{ fontWeight: 'bold' }}>
              {tour.name}
            </Typography>
            <Chip label="2N2Đ" size="small" sx={{ backgroundColor: '#E0E0E0', fontWeight: 'bold' }} />
          </Box>
          <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ mb: 1 }}>
            Mã tour: {tour.id}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ngày khởi hành: {tour.startDate}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Thời gian: {tour.beginTime}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Tổng tiền: {tour.price.adult.toLocaleString()} đ
          </Typography>
          <Box>
            <Button variant="contained" color="error" sx={{ mr: 1, textTransform: 'none' }}>
              Thanh Toán
            </Button>
            <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }}>
              Hủy Đặt
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default RegisteredTourCard;
