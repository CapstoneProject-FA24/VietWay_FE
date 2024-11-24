import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Divider, CircularProgress, RadioGroup, Radio, FormControlLabel, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from '@mui/icons-material/Phone';
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchBookingData } from "@services/BookingService";
import { fetchPaymentURL } from "@services/PaymentService";
import '@styles/Homepage.css'
import { styled } from "@mui/material/styles";
import { getBookingStatusInfo } from "@services/StatusService";
import { BookingStatus } from "@hooks/Statuses";
import { getCookie } from "@services/AuthenService";
import { Helmet } from 'react-helmet';
import { VnPayCode } from "@hooks/VnPayCode";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
}));

const StepBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const StepItem = styled(Typography)(({ theme, active }) => ({
  margin: "0 10px",
  color: active ? "#3572EF" : "#999",
  fontWeight: "bold",
  fontSize: 30,
}));

const ArrowIcon = styled("img")({
  width: "30px",
  height: "30px",
  margin: "0 15px",
});

const ContentContainer = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
}));

const SummaryBox = styled(Box)(({ theme }) => ({
  border: "1px solid #ddd",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  backgroundColor: "#f5f5f5",
  marginBottom: theme.spacing(2),
}));

const SummaryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(1),
}));

const TotalPrice = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  fontSize: "1.2rem",
  color: theme.palette.primary.main,
}));

const PaymentMethod = styled(FormControlLabel)(({ theme }) => ({
  border: "1px solid #ccc", borderRadius: theme.shape.borderRadius,
  width: "100%", height: '3rem', margin: "0 0 8px 0", padding: theme.spacing(1)
}));

const PayBooking = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');
  const { id } = useParams();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  
  useEffect(() => {
    const token = getCookie('customerToken');
    if (!token) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBookingData(id);
        if (data.status !== BookingStatus.Pending) {
          navigate(`/booking/${id}`);
        };
        setBookingData(data);
        const storedPaymentMethod = sessionStorage.getItem('paymentMethod');
        if (storedPaymentMethod) {
          setPaymentMethod(storedPaymentMethod);
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vnpCode = queryParams.get('vnpCode');
    
    if (vnpCode) {
      const message = VnPayCode[vnpCode] || 'Giao dịch thất bại';
      setSnackbarMessage(message);
      setSnackbarSeverity(vnpCode === '00' ? 'success' : 'error');
      setOpenSnackbar(true);
      
      // Redirect after payment result
      if (vnpCode === '00') {
        setTimeout(() => {
          navigate(`${currentPath.includes('dat-tour') ? '/dat-tour/hoan-thanh/' : '/hoan-thanh/'}${id}`);
        }, 2000);
      }
    }
  }, []);

  const handlePayment = async () => {
    if (paymentMethod !== '') {
      if (paymentMethod === 'VNPay') {
        const response = await fetchPaymentURL(id);
        if (response !== null || response !== '') {
          window.location.href = response;
        }
      }
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box>
        <Helmet> <title>Thanh toán</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
      </Box>
    );
  }

  if (!bookingData) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: '89vw' }}>
      <Helmet> <title>Thanh toán</title> </Helmet>
      <Header />
      <ContentContainer>
        <StyledBox>
          {/* <Link to={`${currentPath.includes('dat-tour') ? `/dat-tour/${bookingData.bookingId}` : `/tai-khoan`}`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", marginBottom: 16, marginTop: 10 }}>
            <ArrowBackIcon style={{ marginLeft: 15 }} /> Quay lại
          </Link> */}
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bolder", fontSize: 45, marginBottom: 30, marginTop: 40, color: "#3572EF" }}>
            ĐẶT TOUR
          </Typography>
          <StepBox>
            <StepItem active>NHẬP THÔNG TIN</StepItem>
            <ArrowIcon src="/icon/arrow-right-active.png" alt="arrow" />
            <StepItem active>THANH TOÁN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem>HOÀN TẤT</StepItem>
          </StepBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <SummaryBox>
                <SummaryTitle variant="h6">THÔNG TIN LIÊN LẠC</SummaryTitle>
                <SummaryItem>
                  <Typography sx={{ fontWeight: 'bold' }}>Họ Tên:</Typography>
                  <Typography>{bookingData.contactFullName}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography sx={{ fontWeight: 'bold' }}>Email:</Typography>
                  <Typography>{bookingData.contactEmail}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography sx={{ fontWeight: 'bold' }}>Điện thoại:</Typography>
                  <Typography>{bookingData.contactPhoneNumber}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography sx={{ fontWeight: 'bold' }}>Địa chỉ:</Typography>
                  <Typography>{bookingData.contactAddress}</Typography>
                </SummaryItem>
              </SummaryBox>
              <SummaryBox>
                <SummaryTitle variant="h6">CHI TIẾT BOOKING</SummaryTitle>
                <SummaryItem>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>Số booking:</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', fontStyle: 'italic', color: '#EF3535' }}>
                    {bookingData.bookingId}
                  </Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography sx={{ fontWeight: 'bold' }}>Trị giá booking:</Typography>
                  <Typography>{bookingData.totalPrice.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography sx={{ fontWeight: 'bold' }}>Hình thức thanh toán:</Typography>
                  <Typography>
                    {paymentMethod === 'VNPay' ? 'VNPay' :
                      paymentMethod === 'Momo' ? 'Momo' :
                        'Thanh toán sau'}
                  </Typography>
                </SummaryItem>
                <RadioGroup
                  aria-label="payment-method"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                    <PaymentMethod value="VNPay" control={<Radio />} label="VNPay" />
                    <img src="/vnpay.jpg" alt="VNPay" style={{ width: '24px', height: '24px', position: 'absolute', marginRight: 25, marginTop: -10 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                    <PaymentMethod value="Momo" control={<Radio />} label="Momo" />
                    <img src="/momo.png" alt="Momo" style={{ width: '24px', height: '24px', position: 'absolute', marginRight: 25, marginTop: -10 }} />
                  </Box>
                </RadioGroup>
                <SummaryItem>
                  <Typography>Tình trạng:</Typography>
                  <Typography sx={{ color: getBookingStatusInfo(bookingData.status).color }}>{getBookingStatusInfo(bookingData.status).text}</Typography>
                </SummaryItem>
              </SummaryBox>
              <SummaryBox>
                <SummaryTitle variant="h6">DANH SÁCH HÀNH KHÁCH</SummaryTitle>
                {bookingData.participants.map((participant, index) => (
                  <Box key={index} mb={2}>
                    <SummaryItem sx={{ fontWeight: 'bold' }}>
                      <Typography sx={{ fontWeight: 'bold' }}>Họ tên:</Typography>
                      <Typography>{participant.fullName}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography sx={{ fontWeight: 'bold' }}>Số điện thoại:</Typography>
                      <Typography>{participant.phoneNumber}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography sx={{ fontWeight: 'bold' }}>Giới tính:</Typography>
                      <Typography>{participant.gender === 0 ? 'Nam' : 'Nữ'}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography sx={{ fontWeight: 'bold' }}>Ngày sinh:</Typography>
                      <Typography>{participant.dateOfBirth.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) || 'Không xác định'}</Typography>
                    </SummaryItem>
                    {index < bookingData.participants.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </SummaryBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <SummaryBox>
                <SummaryTitle variant="h6">PHIẾU XÁC NHẬN BOOKING</SummaryTitle>
                <Box sx={{ mb: 2 }}>
                  <img src={bookingData.imageUrl} alt={bookingData.tourName} style={{ width: "100%", height: "auto" }} />
                </Box>
                <Typography variant="h6" style={{ fontWeight: "bold" }} gutterBottom>
                  {bookingData.tourName}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Số booking:</span>
                  <span style={{ color: '#EF3535', fontWeight: 'bold', fontSize: '1.2rem', fontStyle: 'italic' }}>{bookingData.bookingId}</span>
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Mã Tour:</span>
                  {bookingData.code}
                </Typography>
                <Typography variant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Ngày bắt đầu:</span>
                  {bookingData.startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Typography>
                <Typography variant="body1" cvariant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Ngày kết thúc:</span>
                  {
                    (() => {
                      const end = sessionStorage.getItem('endDate');
                      return end ? end : '';
                    })()
                  }
                </Typography>
                <TotalPrice variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Tổng tiền:</span>
                  <span style={{ color: '#3572EF', fontWeight: 'medium', fontSize: '1.4rem' }}>
                    {bookingData.totalPrice.toLocaleString()} đ
                  </span>
                </TotalPrice>
                <Button onClick={() => { handlePayment() }} variant="contained" fullWidth>
                  Thanh toán ngay
                </Button>
                <Button 
                  component={Link} 
                  to={`${currentPath.includes('dat-tour') ? '/dat-tour/hoan-thanh/' : '/hoan-thanh/'}${bookingData.bookingId}`} 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 1 }}
                >
                  Thanh toán sau
                </Button>
              </SummaryBox>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <PhoneIcon sx={{ marginRight: '10px' }} />
                <Typography>Liên hệ tư vấn: 1900 1234</Typography>
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
      </ContentContainer>
      <Footer />
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={3000} open={openSnackbar} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage || 'Vui lòng chọn phương thức thanh toán'}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default PayBooking;