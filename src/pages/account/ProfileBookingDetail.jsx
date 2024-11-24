import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Divider, CircularProgress, Snackbar, Radio, FormControlLabel, Alert } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from '@mui/icons-material/Phone';
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchBookingData, fetchBookingPayments, cancelBooking } from "@services/BookingService";
import { getBookingStatusInfo } from "@services/StatusService";
import { fetchPaymentURL } from "@services/PaymentService";
import { getCookie } from "@services/AuthenService"; getCookie
import { getPreviousPage } from "@utils/NavigationHistory";
import dayjs from "dayjs";
import { Helmet } from 'react-helmet';
import { BookingStatus } from '@hooks/Statuses';
import CancelBooking from '@components/profiles/CancelBooking';
import FeedbackPopup from '@components/profiles/FeedbackPopup';
import { VnPayCode } from "@hooks/VnPayCode";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
}));

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

const ActionButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  width: '100%',
  height: '40px',
  borderRadius: '8px'
}));

const ProfileBookingDetail = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payments, setPayments] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    const customerToken = getCookie('customerToken');
    if (!customerToken) { navigate('/'); }
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
        const paymentData = await fetchBookingPayments(id);
        setPayments(paymentData.items);

        const searchParams = new URLSearchParams(location.search);
        const vnpAmount = searchParams.get('vnp_Amount');
        const vnpCode = searchParams.get('vnp_ResponseCode');
        
        // Handle VNPay response
        if (vnpCode) {
          const message = VnPayCode[vnpCode] || 'Giao dịch thất bại';
          setSnackbar({
            open: true,
            message: message,
            severity: vnpCode === '00' ? 'success' : 'error'
          });
          
          // Refresh data after successful payment
          if (vnpCode === '00') {
            const updatedData = await fetchBookingData(id);
            setBookingData(updatedData);
          }
        }

        if (vnpAmount) {
          const paidAmount = parseInt(vnpAmount) / 100;
          data.paymentMethod = "VNPay";
          data.paidAmount = paidAmount;
        }

        setBookingData(data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi tải thông tin đặt tour',
          severity: 'error'
        });
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
    navigate(-1);
  };

  const handleCancelOpen = () => setIsCancelOpen(true);
  const handleCancelClose = () => setIsCancelOpen(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleCancelConfirm = async (reason) => {
    try {
      setCancelLoading(true);
      await cancelBooking(bookingData.bookingId, reason);
      handleCancelClose();
      setSnackbar({
        open: true,
        message: 'Hủy đặt tour thành công',
        severity: 'success'
      });
      // Refresh the booking data after cancellation
      const updatedData = await fetchBookingData(id);
      setBookingData(updatedData);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Không thể hủy đặt tour. Vui lòng thử lại sau.',
        severity: 'error'
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleFeedbackOpen = () => setIsFeedbackOpen(true);
  const handleFeedbackClose = () => setIsFeedbackOpen(false);

  const renderActionButtons = () => {
    if (!bookingData) return null;

    const buttonContainer = {
      display: 'flex',
      flexDirection: 'column',
      mt: 2,
      px: 2,
      pb: 2
    };

    switch (bookingData.status) {
      case BookingStatus.Completed:
        return (
          <Box sx={buttonContainer}>
            <ActionButton
              variant="contained"
              color="primary"
              component={Link}
              to={`/feedback/${bookingData.tourId}`}
            >
              Đánh giá
            </ActionButton>
            <ActionButton
              variant="outlined"
              color="primary"
              onClick={handleFeedbackOpen}
            >
              Đánh giá
            </ActionButton>
          </Box>
        );
      case BookingStatus.Confirmed:
        return (
          <Box sx={buttonContainer}>
            <ActionButton
              variant="outlined"
              color="primary"
              onClick={handleCancelOpen}
            >
              Hủy Đặt
            </ActionButton>
          </Box>
        );
      case BookingStatus.Pending:
        return (
          <Box sx={buttonContainer}>
            <ActionButton
              variant="contained"
              color="error"
              onClick={handlePayment}
            >
              Thanh Toán
            </ActionButton>
            <ActionButton
              variant="outlined"
              color="primary"
              onClick={handleCancelOpen}
            >
              Hủy Đặt
            </ActionButton>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box>
        <Helmet> <title>Thông tin booking</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
      </Box>
    );
  }

  if (!bookingData) return null;

  return (
    <Box sx={{ width: '89vw' }}>
      <Helmet> <title>Thông tin booking</title> </Helmet>
      <Header />
      <ContentContainer>
        <StyledBox>
          {/* <div
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
          </div> */}
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bolder", fontSize: 45, marginBottom: 30, marginTop: 40, color: "#3572EF" }}>
            THÔNG TIN BOOKING
          </Typography>
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
                  <Typography>{dayjs(bookingData.createdOn).format('DD/MM/YYYY')}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Trị giá booking:</Typography>
                  <Typography>{bookingData?.totalPrice?.toLocaleString() || 0} đ</Typography>
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
                      {dayjs(bookingData.createdOn).add(24, 'hour').format('DD/MM/YYYY HH:mm')} (Theo giờ Việt Nam)
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
                      <Typography>{dayjs(participant.dateOfBirth).format('DD/MM/YYYY')}</Typography>
                    </SummaryItem>
                    {index < bookingData.participants.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </SummaryBox>
              <SummaryBox>
                <SummaryTitle variant="h6">LỊCH SỬ THANH TOÁN</SummaryTitle>
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <Box key={index}>
                      <SummaryItem>
                        <Typography>Số tiền:</Typography>
                        <Typography>{payment?.amount?.toLocaleString()} đ</Typography>
                      </SummaryItem>
                      <SummaryItem>
                        <Typography>Thời gian:</Typography>
                        <Typography>{dayjs(payment.payTime).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                      </SummaryItem>
                      <SummaryItem>
                        <Typography>Ngân hàng:</Typography>
                        <Typography>{payment.bankCode || 'VNPay'}</Typography>
                      </SummaryItem>
                      <SummaryItem>
                        <Typography>Trạng thái:</Typography>
                        <Typography sx={{ color: payment.status === 1 ? 'success.main' : 'error.main' }}>
                          {payment.status === 1 ? 'Thành công' : 'Thất bại'}
                        </Typography>
                      </SummaryItem>
                      {index < payments.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                    Chưa có lịch sử thanh toán
                  </Typography>
                )}
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
                  {dayjs(bookingData.startDate).format('DD/MM/YYYY')}
                </Typography>
                {/* <Typography variant="body1" cvariant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Ngày kết thúc:</span>
                  {dayjs(bookingData.endDate).format('DD/MM/YYYY')}
                </Typography> */}
                <TotalPrice variant="h6">
                  Tổng tiền: {bookingData?.totalPrice?.toLocaleString() || 0} đ
                </TotalPrice>
                {bookingData.status === 2 && (
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleFeedbackOpen}
                  >
                    Đánh giá
                  </ActionButton>
                )}
                {bookingData.status === 1 && (
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleCancelOpen}
                  >
                    Hủy Đặt
                  </ActionButton>
                )}
                {bookingData.status === 0 && (
                  <Box sx={{ mt: 5 }}>
                    <Typography>Chọn hình thức thanh toán</Typography>
                    <Box sx={{ ml: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                        <PaymentMethod
                          value="Momo" label="Momo"
                          control={<Radio checked={paymentMethod === 'Momo'} onChange={(e) => setPaymentMethod(e.target.value)} />}
                        />
                        <img src="/momo.png" alt="Momo" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', mb: 2 }}>
                        <PaymentMethod
                          value="VNPay" label="VNPay"
                          control={<Radio checked={paymentMethod === 'VNPay'} onChange={(e) => setPaymentMethod(e.target.value)} />}
                        />
                        <img src="/vnpay.jpg" alt="VNPay" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
                      </Box>
                    </Box>
                    <ActionButton onClick={handlePayment} variant="contained" fullWidth>
                      Thanh toán ngay
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      color="primary"
                      onClick={handleCancelOpen}
                    >
                      Hủy Đặt
                    </ActionButton>
                  </Box>
                )}
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
      <CancelBooking
        open={isCancelOpen}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
        loading={cancelLoading}
        tour={bookingData}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      {isFeedbackOpen && (
        <FeedbackPopup 
          onClose={handleFeedbackClose} 
          bookingId={bookingData.bookingId} 
        />
      )}
    </Box>
  );
};

export default ProfileBookingDetail;