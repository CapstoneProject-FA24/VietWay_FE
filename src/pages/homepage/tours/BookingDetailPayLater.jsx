import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Divider, CircularProgress, Snackbar, Radio, FormControlLabel } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from '@mui/icons-material/Phone';
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchBookingData } from "@services/BookingService";
import { getBookingStatusInfo } from "@services/StatusService";
import { fetchPaymentURL } from "@services/PaymentService";
import { getCookie } from "@services/AuthenService";
import { Helmet } from 'react-helmet';

// Styled components (reuse from BookTour)
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
  marginRight: 0,
  '& .MuiFormControlLabel-label': {
    fontSize: '0.9rem',
  },
}));

const BookingDetailPayLater = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('customerToken');
    if (!token) {
      navigate('/');
    }
  }, []);

  const handlePayment = async () => {
    if (paymentMethod === 'VNPay') {
      const response = await fetchPaymentURL(id);
      if (response !== null && response !== '') {
        window.location.href = response;
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBookingData(id);
        const searchParams = new URLSearchParams(location.search);
        const vnpAmount = searchParams.get('vnp_Amount');
        const vnpCode = searchParams.get('vnp_ResponseCode');
        if (vnpCode === "00") {
          setOpenSnackbar(true);
        }
        if (vnpAmount) {
          const paidAmount = parseInt(vnpAmount) / 100;
          data.paymentMethod = "VNPay";
          data.paidAmount = paidAmount;
        }

        setBookingData(data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box>
        <Helmet> <title>Hoàn thành</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
      </Box>
    );
  }

  if (!bookingData) return null;

  return (
    <Box sx={{ width: '89vw' }}>
      <Helmet> <title>Hoàn thành</title> </Helmet>
      <Header />
      <ContentContainer>
        <StyledBox>
          <Link to={`/trang-chu`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", marginBottom: 16, marginTop: 10 }}>
            <ArrowBackIcon style={{ marginLeft: 15 }} /> Quay lại trang chủ
          </Link>
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bolder", fontSize: 45, marginBottom: 30, marginTop: 40, color: "#3572EF" }}>
            ĐẶT TOUR
          </Typography>
          <StepBox>
            <StepItem active>NHẬP THÔNG TIN</StepItem>
            <ArrowIcon src="/icon/arrow-right-active.png" alt="arrow" />
            <StepItem active>THANH TOÁN</StepItem>
            <ArrowIcon src="/icon/arrow-right-active.png" alt="arrow" />
            <StepItem active>HOÀN TẤT</StepItem>
          </StepBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <SummaryBox>
                <SummaryTitle variant="h6">THÔNG TIN LIÊN LẠC</SummaryTitle>
                <SummaryItem>
                  <Typography>Họ Tên:</Typography>
                  <Typography>{bookingData.contactFullName}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Email:</Typography>
                  <Typography>{bookingData.contactEmail}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Điện thoại:</Typography>
                  <Typography>{bookingData.contactPhoneNumber}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Địa chỉ:</Typography>
                  <Typography>{bookingData.contactAddress}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Ghi chú:</Typography>
                  <Typography>{bookingData.note || ''}</Typography>
                </SummaryItem>
              </SummaryBox>
              <SummaryBox>
                <SummaryTitle variant="h6">CHI TIẾT BOOKING</SummaryTitle>
                <SummaryItem>
                  <Typography>Số booking:</Typography>
                  <Typography>{bookingData.bookingId}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Ngày đặt tour:</Typography>
                  <Typography>{new Date(bookingData.createdOn).toLocaleDateString()}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Trị giá booking:</Typography>
                  <Typography>{bookingData.totalPrice.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Hình thức thanh toán:</Typography>
                  <Typography>{bookingData.status === 0 ? 'Thanh toán sau' : 'VNPay'}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Tình trạng:</Typography>
                  <Typography sx={{ color: getBookingStatusInfo(bookingData.status).color }}>{getBookingStatusInfo(bookingData.status).text}</Typography>
                </SummaryItem>
                {bookingData.status === 0 && (
                  <SummaryItem>
                    <Typography>Thời hạn thanh toán:</Typography>
                    <Typography>
                      {new Date(new Date(bookingData.createdOn).getTime() + 24 * 60 * 60 * 1000).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} (Theo giờ Việt Nam)
                    </Typography>
                  </SummaryItem>
                )}
                {bookingData.status === 0 && (
                  <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                    Nếu quá thời hạn trên mà Quý khách chưa thanh toán, VietWay sẽ hủy booking này.
                  </Typography>
                )}
                {/* <SummaryItem>
                  <Typography>Số tiền còn lại:</Typography>
                  <Typography>{(bookingData.totalPrice - bookingData.paidAmount).toLocaleString()} đ</Typography>
                </SummaryItem> */}
              </SummaryBox>
              <SummaryBox>
                <SummaryTitle variant="h6">DANH SÁCH HÀNH KHÁCH</SummaryTitle>
                {bookingData.participants.map((participant, index) => (
                  <Box key={index} mb={2}>
                    <SummaryItem>
                      <Typography>Họ tên:</Typography>
                      <Typography>{participant.fullName}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography>Số điện thoại:</Typography>
                      <Typography>{participant.phoneNumber}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography>Giới tính:</Typography>
                      <Typography>{participant.gender === 0 ? 'Nam' : 'Nữ'}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography>Ngày sinh:</Typography>
                      <Typography>{participant.dateOfBirth.toLocaleDateString() || 'Không xác định'}</Typography>
                    </SummaryItem>
                    {index < bookingData.participants.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </SummaryBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <SummaryBox>
                <Box sx={{ mb: 2 }}>
                  <img src={bookingData.imageUrl} alt={bookingData.tourName} style={{ width: "100%", height: "auto" }} />
                </Box>
                <Typography variant="h6" style={{ fontWeight: "bold" }} gutterBottom>
                  {bookingData.tourName}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Số booking: {bookingData.bookingId}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" color="textPrimary" gutterBottom>
                  Mã tour: {bookingData.code}
                </Typography>
                <Typography variant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Ngày bắt đầu:</span>
                  {bookingData.startDate.toLocaleDateString()}
                </Typography>
                {/* <Typography variant="body1" cvariant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Ngày kết thúc:</span>
                  {
                    (() => {
                      const end = sessionStorage.getItem('endDate');
                      return end ? end : '';
                    })()
                  }
                </Typography> */}
                <TotalPrice variant="h6">
                  Tổng tiền: {bookingData.totalPrice.toLocaleString()} đ
                </TotalPrice>
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
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: '500px', fontSize: '1.5rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center', backgroundColor: '#CEECA2'
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="large" />
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 5 }}>
            Thanh toán thành công!
          </Box>
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default BookingDetailPayLater;