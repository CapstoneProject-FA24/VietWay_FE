import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Divider, CircularProgress, Snackbar } from "@mui/material";
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
import { fetchCreatePayment } from "@services/PaymentService";
import { getCookie } from "@services/AuthenService";
import { saveNavigationHistory, getPreviousPageBooking } from '@utils/NavigationHistory';

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

const BookingDetail = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      navigate('/');
    }
    saveNavigationHistory(window.location.pathname);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const searchParams = new URLSearchParams(location.search);
        const vnpAmount = searchParams.get('vnp_Amount');
        const vnpCode = searchParams.get('vnp_ResponseCode');
        //remove when use online payment
        //start from here
        const vnPayIPN = `?vnp_TmnCode=${searchParams.get('vnp_TmnCode')}&vnp_Amount=${searchParams.get('vnp_Amount')}&vnp_BankCode=${searchParams.get('vnp_BankCode')}&vnp_BankTranNo=${searchParams.get('vnp_BankTranNo')}&vnp_CardType=${searchParams.get('vnp_CardType')}&vnp_PayDate=${searchParams.get('vnp_PayDate')}&vnp_OrderInfo=${searchParams.get('vnp_OrderInfo').replace(/\+/g, '%2B')}&vnp_TransactionNo=${searchParams.get('vnp_TransactionNo')}&vnp_ResponseCode=${searchParams.get('vnp_ResponseCode')}&vnp_TransactionStatus=${searchParams.get('vnp_TransactionStatus')}&vnp_TxnRef=${searchParams.get('vnp_TxnRef')}&vnp_SecureHash=${searchParams.get('vnp_SecureHash')}`;
        const response = await fetchCreatePayment(vnPayIPN);
        if (response.rspCode === '00') {
          setOpenSnackbar(true);
        }
        //end here

        const data = await fetchBookingData(id);
        if (vnpAmount && vnpCode === '00') {
          //setOpenSnackbar(true);
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

  const handleGoBack = () => {
    const previousPage = getPreviousPageBooking();
    navigate(previousPage);
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src="/loading.gif" alt="Loading..." />
        </Box>
      </Box>
    );
  }

  if (!bookingData) return null;

  return (
    <Box sx={{ width: "89vw" }}>
      <Header />
      <ContentContainer>
        <StyledBox>
          <div
            onClick={handleGoBack}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
              marginTop: 10,
              cursor: "pointer"
            }}
          >
            <ArrowBackIcon style={{ marginLeft: 15 }} /> Quay lại
          </div>
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
                  <Typography>{bookingData.paymentMethod}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Số tiền đã thanh toán:</Typography>
                  <Typography>{bookingData.paidAmount.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Tình trạng:</Typography>
                  <Typography sx={{ color: getBookingStatusInfo(bookingData.status).color }}>{getBookingStatusInfo(bookingData.status).text}</Typography>
                </SummaryItem>
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
                <SummaryTitle variant="h6">THÔNG TIN BOOKING</SummaryTitle>
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

export default BookingDetail;