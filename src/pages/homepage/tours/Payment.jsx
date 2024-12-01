import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Divider, CircularProgress, RadioGroup, Radio, FormControlLabel, Snackbar, Checkbox } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from '@mui/icons-material/Phone';
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchBookingData, fetchBookingPayments } from "@services/BookingService";
import { fetchPaymentURL } from "@services/PaymentService";
import '@styles/Homepage.css'
import { styled } from "@mui/material/styles";
import { getBookingStatusInfo } from "@services/StatusService";
import { BookingStatus } from "@hooks/Statuses";
import { getCookie } from "@services/AuthenService";
import { Helmet } from 'react-helmet';
import { VnPayCode } from "@hooks/VnPayCode";
import dayjs from "dayjs";

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
  fontSize: "1.4rem",
  color: theme.palette.primary.main,
}));

const PaymentMethod = styled(FormControlLabel)(({ theme }) => ({
  marginRight: 0,
  marginTop: -5,
  '& .MuiFormControlLabel-label': {
    fontSize: '0.9rem',
  },
}));

const PaymentMethodEnum = {
  VNPay: 0,
  ZaloPay: 2,
  PayOS: 3
};

const PayBooking = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payments, setPayments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');
  const { id } = useParams();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [formData, setFormData] = useState({
    paymentAmount: '100',
    paymentMethod: ''
  });

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
        const paymentData = await fetchBookingPayments(id);
        setPayments(paymentData.items);
        if (data.status !== BookingStatus.Pending && data.status !== BookingStatus.Deposited) {
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
      try {
        const paymentMethodId = PaymentMethodEnum[paymentMethod];
        const isFullPayment = formData.paymentAmount === '100';

        const response = await fetchPaymentURL(id, paymentMethodId, isFullPayment);

        if (response !== null && response !== '') {
          window.location.href = response;
        }
      } catch (error) {
        setSnackbarMessage('Có lỗi xảy ra khi tạo URL thanh toán');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage('Vui lòng chọn phương thức thanh toán');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handlePaymentAmountChange = (event) => {
    setFormData(prev => ({
      ...prev,
      paymentAmount: event.target.value
    }));
  };

  const calculateTotalWithDeposit = () => {
    return formData.paymentAmount === 'deposit'
      ? bookingData.totalPrice * (bookingData.depositPercent / 100)
      : bookingData.totalPrice;
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
                  <Typography>Đã thanh toán:</Typography>
                  <Typography>{bookingData?.paidAmount?.toLocaleString() || 0} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Tình trạng:</Typography>
                  <Typography sx={{ color: getBookingStatusInfo(bookingData.status).color }}>{getBookingStatusInfo(bookingData.status).text}</Typography>
                </SummaryItem>
                {bookingData.status === 0 && (
                  <>
                    <SummaryItem>
                      <Typography>Thời hạn thanh toán:</Typography>
                      <Typography>
                        {dayjs(bookingData.createdOn).add(24, 'hour').format('DD/MM/YYYY HH:mm')} (Theo giờ Việt Nam)
                      </Typography>
                    </SummaryItem>
                    <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                      Nếu quá thời hạn trên mà quý khách chưa thanh toán, VietWay sẽ hủy booking này.
                    </Typography>
                  </>
                )}
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
                      <Typography>{participant.dateOfBirth.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) || 'Không xác định'}</Typography>
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
                        <Typography>{dayjs(payment.payTime || payment.createAt).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                      </SummaryItem>
                      <SummaryItem>
                        <Typography>Ngân hàng:</Typography>
                        <Typography>{payment.bankCode || 'Không có'}</Typography>
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
                <SummaryTitle variant="h6">PHIẾU XÁC NHẬN BOOKING</SummaryTitle>
                <Box sx={{ mb: 2 }}>
                  <img src={bookingData.imageUrl} alt={bookingData.tourName} style={{ width: "100%", height: "auto" }} />
                </Box>
                <Typography variant="h6" style={{ fontWeight: "bold", fontSize: "1.2rem" }} gutterBottom>
                  {bookingData.tourName}
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Số booking:</span>
                  <span style={{ color: '#EF3535', fontWeight: 'bold', fontSize: '1.2rem', fontStyle: 'italic' }}>{bookingData.bookingId}</span>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Mã Tour:</span>
                  {bookingData.code}
                </Typography>
                <Typography variant="body2" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Thời lượng:</span>
                  {bookingData.durationName}
                </Typography>
                <Typography variant="body2" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Thời gian khởi hành:</span>
                  {bookingData.startDate.toLocaleDateString('vi-VN')} - {new Date(bookingData.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Typography>
                <Typography variant="body2" cvariant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Ngày kết thúc:</span>
                  {new Date(bookingData.startDate.getTime() + ((bookingData.numberOfDay - 1) * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>ĐIỀU KIỆN THANH TOÁN</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>• Đặt cọc {bookingData.depositPercent}% số tiền tour khi đăng ký</Typography>
                  <Typography variant="body2">• Thanh toán số tiền còn lại trước {bookingData.paymentDeadline ? new Date(bookingData.paymentDeadline).toLocaleDateString('vi-VN') : ''} {' '}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, mb: 1 }}>Chọn hình thức thanh toán</Typography>
                <Box sx={{ ml: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                    <PaymentMethod
                      value="ZaloPay" label="ZaloPay"
                      control={<Radio checked={paymentMethod === 'ZaloPay'} onChange={(e) => setPaymentMethod(e.target.value)} />}
                    />
                    <img src="/zalopay.png" alt="ZaloPay" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                    <PaymentMethod
                      value="VNPay" label="VNPay"
                      control={<Radio checked={paymentMethod === 'VNPay'} onChange={(e) => setPaymentMethod(e.target.value)} />}
                    />
                    <img src="/vnpay.jpg" alt="VNPay" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                    <PaymentMethod
                      value="PayOS" label="PayOS"
                      control={<Radio checked={paymentMethod === 'PayOS'} onChange={(e) => setPaymentMethod(e.target.value)} />}
                    />
                    <img src="/payos.jpg" alt="PayOS" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
                  </Box>
                </Box>
                {bookingData.status === 0 && (
                  <>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, mt: 2 }}>Thanh toán</Typography>
                    {bookingData.depositPercent < 100 && (
                      <RadioGroup
                        value={formData.paymentAmount}
                        onChange={handlePaymentAmountChange}
                        sx={{ mb: 2 }}
                      >
                        <FormControlLabel
                          value="deposit" sx={{ mb: -1.5 }}
                          control={<Radio />}
                          label={`Đặt cọc ${bookingData.depositPercent}%`}
                        />
                        <FormControlLabel
                          value="100"
                          control={<Radio />}
                          label="Thanh toán 100%"
                        />
                      </RadioGroup>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -2 }}>
                      <Typography sx={{ fontSize: '1.1rem' }}>Trị giá booking:</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>{bookingData?.totalPrice?.toLocaleString() || 0} đ</Typography>
                    </Box>
                    <TotalPrice variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Tổng tiền cần thanh toán:</span>
                      <span style={{ color: '#3572EF', fontWeight: 'medium', fontSize: '1.4rem' }}>
                        {calculateTotalWithDeposit().toLocaleString()} đ
                      </span>
                    </TotalPrice>
                  </>
                )}
                {bookingData.status === 1 && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                      <Typography sx={{ fontSize: '1.1rem' }}>Trị giá booking:</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>{bookingData?.totalPrice?.toLocaleString() || 0} đ</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '1.1rem' }}>Đã thanh toán:</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>{bookingData?.paidAmount?.toLocaleString() || 0} đ</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -1.5 }}>
                      <Typography sx={{ fontSize: '1.1rem' }}>Tổng tiền cần thanh toán:</Typography>
                      <TotalPrice variant="h4" sx={{ ml: 1 }}>{(bookingData?.totalPrice - bookingData?.paidAmount).toLocaleString() || 0} đ</TotalPrice>
                    </Box>
                  </>
                )}
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