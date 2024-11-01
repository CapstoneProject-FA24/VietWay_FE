import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Container, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { mockPaymentDetails } from '@hooks/MockProfile';
import { getCookie } from '@services/AuthenService';

const PaymentDetail = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
            navigate('/');
        }
        const paymentDetail = mockPaymentDetails.find(p => p.paymentId === id);
        if (paymentDetail) {
          setPayment(paymentDetail);
        } else {
          setError('Payment not found');
        }
      } catch (err) {
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!payment) return <Typography>Payment not found</Typography>;

  return (
    <Box sx={{ width: '98vw', ml: '-60px', mr: '-60px'}}>
      <Header />
      <Container maxWidth="md" sx={{ my: 5 }}>
        <Button
          component={Link}
          to="/tai-khoan"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom>Chi tiết thanh toán</Typography>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>{payment.booking.tourName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Mã Giao Dịch</Typography>
              <Typography variant="h6">{payment.paymentId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Mã Đặt Tour</Typography>
              <Typography variant="h6">{payment.booking.bookingId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Mã Tour</Typography>
              <Typography variant="h6">{payment.booking.tourId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Số Tiền</Typography>
              <Typography variant="h6" color="primary.main">{payment.amount.toLocaleString()} VND</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Ngân Hàng</Typography>
              <Typography variant="h6">{payment.bankCode}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Thời Gian Thanh Toán</Typography>
              <Typography variant="h6">{new Date(payment.payTime).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Trạng Thái</Typography>
              <Chip
                label={payment.status}
                color={payment.status.toLowerCase() === 'thành công' ? 'success' : payment.status.toLowerCase() === 'thất bại' ? 'error' : 'info'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">Ghi Chú</Typography>
              <Typography variant="body1">{payment.note}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default PaymentDetail;
