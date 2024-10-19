import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Container, Button, Chip, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardMedia } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';

const PaymentDetail = () => {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        // Simulated API call
        const data = {
          paymentId: 'PAY-123456',
          bookingId: 'BOOK-789012',
          tourCode: 'TOUR-001',
          tourName: 'Đà Lạt - Thung Lũng Tình Yêu - 2 ngày 1 đêm',
          tourImage: 'https://static.vinwonders.com/production/gioi-thieu-ve-da-lat-1.jpg', // Add this line
          amount: 3500000,
          bankName: 'VNPay',
          payTime: '2023-07-15T10:30:00Z',
          status: 'Thành công',
          note: 'Thanh toán đầy đủ',
          bookingDetails: [
            { type: 'Người lớn', quantity: 2, price: 1500000 },
            { type: 'Trẻ em', quantity: 1, price: 500000 }
          ]
        };
        setPayment(data);
      } catch (err) {
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!payment) return <Typography>Payment not found</Typography>;

  return (
    <Box>
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
          <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="200"
              image={payment.tourImage}
              alt={payment.tourName}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>{payment.tourName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Mã Giao Dịch</Typography>
              <Typography variant="h6">{payment.paymentId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Mã Đặt Tour</Typography>
              <Typography variant="h6">{payment.bookingId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Mã Tour</Typography>
              <Typography variant="h6">{payment.tourCode}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Số Tiền</Typography>
              <Typography variant="h6" color="primary.main">{payment.amount.toLocaleString()} VND</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Ngân Hàng</Typography>
              <Typography variant="h6">{payment.bankName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Thời Gian Thanh Toán</Typography>
              <Typography variant="h6">{new Date(payment.payTime).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">Trạng Thái</Typography>
              <Chip
                label={payment.status}
                color={payment.status === 'Thành công' ? 'success' : 'error'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">Ghi Chú</Typography>
              <Typography variant="body1">{payment.note}</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Chi tiết đặt tour</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loại</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell align="right">Tổng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payment.bookingDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{detail.type}</TableCell>
                    <TableCell align="right">{detail.quantity}</TableCell>
                    <TableCell align="right">{detail.price.toLocaleString()} VND</TableCell>
                    <TableCell align="right">{(detail.quantity * detail.price).toLocaleString()} VND</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right"><strong>Tổng cộng</strong></TableCell>
                  <TableCell align="right"><strong>{payment.amount.toLocaleString()} VND</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default PaymentDetail;
