import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Divider, CircularProgress, Snackbar, Radio, FormControlLabel, Alert, RadioGroup, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import PhoneIcon from '@mui/icons-material/Phone';
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { submitBookingReview, fetchBookingData, fetchBookingPayments, cancelBooking, getBookingHistory, confirmTourChange, denyTourChange, fetchTourByBookingId } from "@services/BookingService";
import { getBookingStatusInfo } from "@services/StatusService";
import { fetchPaymentURL } from "@services/PaymentService";
import { getCookie } from "@services/AuthenService";
import dayjs from "dayjs";
import { Helmet } from 'react-helmet';
import CancelBooking from '@components/profiles/CancelBooking';
import FeedbackPopup from '@components/profiles/FeedbackPopup';
import { EntityModifyAction, BookingStatus } from '@hooks/Statuses';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

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
  padding: theme.spacing(3),
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
  const [formData, setFormData] = useState({
    paymentAmount: '100',
    paymentMethod: ''
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);

  const PaymentMethodEnum = {
    VNPay: 0,
    ZaloPay: 1,
    PayOS: 2
  };

  useEffect(() => {
    const customerToken = getCookie('customerToken');
    if (!customerToken) { navigate('/'); }
  }, []);

  const handlePaymentAmountChange = (event) => {
    setFormData(prev => ({
      ...prev,
      paymentAmount: event.target.value
    }));
  };

  const calculateTotalWithDeposit = () => {
    if (!bookingData) return 0;
    return formData.paymentAmount === 'deposit'
      ? bookingData.totalPrice * (bookingData.depositPercent / 100)
      : bookingData.totalPrice - (bookingData.paidAmount || 0);
  };

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
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi tạo URL thanh toán',
          severity: 'error'
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn phương thức thanh toán',
        severity: 'warning'
      });
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchBookingData(id);
      const paymentData = await fetchBookingPayments(id);
      const tour = await fetchTourByBookingId(data.bookingId);
      const history = await getBookingHistory(id);
      const bookingDataWithTour = {
        ...data,
        tourId: tour.id,
        tourTemplateId: tour.tourTemplateId,
        startLocation: tour.startLocation,
        startTime: tour.startTime,
        startDate: tour.startDate,
        maxParticipant: tour.maxParticipant,
        minParticipant: tour.minParticipant,
        currentParticipant: tour.currentParticipant,
        depositPercent: tour.depositPercent,
        paymentDeadline: tour.paymentDeadline,
        refundPolicies: tour.refundPolicies,
        pricesByAge: tour.pricesByAge,
        registerOpenDate: tour.registerOpenDate,
        registerCloseDate: tour.registerCloseDate,
        history: history.data,
        tourTemplate: tour.tourTemplate,
        isReviewed: data.isReviewed
      };

      setPayments(paymentData.items);
      setBookingData(bookingDataWithTour);
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

  useEffect(() => {
    fetchData();
  }, [id, location]);

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
      fetchData();
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

  const handleConfirmDialogOpen = () => setConfirmDialogOpen(true);
  const handleConfirmDialogClose = () => setConfirmDialogOpen(false);

  const handleConfirmChangeTour = async () => {
    handleConfirmDialogOpen();
  };

  const handleConfirmChange = async () => {
    try {
      await confirmTourChange(bookingData.bookingId);
      handleConfirmDialogClose();
      setSnackbar({
        open: true,
        message: 'Xác nhận chuyển tour thành công',
        severity: 'success'
      });
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error('Failed to confirm tour change:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Không thể xác nhận chuyển tour. Vui lòng thử lại sau.',
        severity: 'error'
      });
    }
  };

  const handleDenyDialogOpen = () => setDenyDialogOpen(true);
  const handleDenyDialogClose = () => setDenyDialogOpen(false);

  const handleDenyChangeTour = async () => {
    handleDenyDialogOpen();
  };

  const handleDenyChange = async () => {
    try {
      await denyTourChange(bookingData.bookingId);
      handleDenyDialogClose();
      setSnackbar({
        open: true,
        message: 'Từ chối chuyển tour thành công',
        severity: 'success'
      });
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error('Failed to deny tour change:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Không thể từ chối chuyển tour. Vui lòng thử lại sau.',
        severity: 'error'
      });
    }
  };

  const handleBookingFeedback = async (bookingId, rating, feedback, isPublic) => {
    try {
      await submitBookingReview(bookingId, rating, feedback, isPublic);
      setSnackbar({
        open: true,
        message: 'Đánh giá tour thành công',
        severity: 'success'
      });
      fetchData();
    } catch (err) {
      console.error('Failed to feedback booking:', err);
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        severity: 'error'
      });
    }
  };

  const isCancellationAllowed = (bookingData) => {
    if (!bookingData?.startDate) return false;
    const today = new Date();
    const startDate = new Date(bookingData.startDate);
    // Set times to midnight for accurate date comparison
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    return today < startDate;
  };

  if (loading) {
    return (
      <Box>
        <Helmet> <title>Thông tin booking</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
      </Box>
    );
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!bookingData) return null;

  return (
    <Box sx={{ width: '89vw' }}>
      <Helmet> <title>Thông tin booking</title> </Helmet>
      <Header />
      <ContentContainer>
        <StyledBox>
          <Button
            variant="text" startIcon={<ArrowBackIosNewIcon />} onClick={handleBackClick}
            sx={{ color: '#4B4B4B', mt: 5, justifyContent: 'flex-start' }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bolder", fontSize: 45, marginBottom: 30, marginTop: 10, color: "#3572EF" }}>
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
                    <SummaryItem>
                      <Typography>CCCD:</Typography>
                      <Typography>{participant.PIN}</Typography>
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
              <SummaryBox>
                <SummaryTitle variant="h6">LỊCH SỬ BOOKING</SummaryTitle>
                {bookingData?.history?.length > 0 ? (
                  [...bookingData.history]
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((his, index) => (
                      <Box key={index}>
                        <SummaryItem>
                          <Typography>Thời gian:</Typography>
                          <Typography>{dayjs(his.timestamp).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                        </SummaryItem>
                        <SummaryItem>
                          <Typography>Hành động:</Typography>
                          <Typography>{his.action == EntityModifyAction.Create ? 'Đặt tour' :
                            (his.action == EntityModifyAction.Update && !his.newStatus) ? 'Đổi tour' :
                              (his.action == EntityModifyAction.ChangeStatus && his.newStatus == BookingStatus.Cancelled) ? 'Hủy đặt tour' :
                                (his.action == EntityModifyAction.Update && his.newStatus == BookingStatus.Deposited) ? 'Đặt cọc' :
                                  (his.action == EntityModifyAction.Update && his.newStatus == BookingStatus.Paid) ? 'Thanh toán toàn bộ' : 'Không xác định'}</Typography>
                        </SummaryItem>
                        {((his.action == EntityModifyAction.ChangeStatus && his.newStatus == BookingStatus.Cancelled) || (his.action == EntityModifyAction.Update && !his.newStatus)) && (
                          <SummaryItem>
                            <Typography>Lý do:</Typography>
                            <Typography>{his.reason || 'Không có'}</Typography>
                          </SummaryItem>
                        )}
                        {index < bookingData.history.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                    Chưa có lịch sử booking
                  </Typography>
                )}
              </SummaryBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <SummaryBox>
                <Box sx={{ mb: 2 }}>
                  <img src={bookingData.imageUrl} alt={bookingData.tourName} style={{ width: "100%", height: "auto" }} />
                </Box>
                <Typography
                  component={Link} to={bookingData.tourTemplate.isDeleted === false ? `/tour-du-lich/${bookingData.tourTemplate.tourTemplateId}` : `/thong-tin/tour-du-lich/${bookingData.bookingId}`} variant="h6"
                  sx={{ fontWeight: "bold", color: 'black', '&:hover': { color: 'primary.main', cursor: 'pointer' } }} gutterBottom>
                  {bookingData.tourName}
                  <Tooltip title="Nhấp để xem chi tiết tour" arrow>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: 'primary.main', ml: 1 }} />
                  </Tooltip>
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Số booking:</span> {bookingData.bookingId}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" color="textPrimary" gutterBottom>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Mã tour:</span> {bookingData.code}
                </Typography>
                <Typography variant="body1" color="textPrimary" gutterBottom>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Phương tiện:</span> {bookingData.transportation}
                </Typography>
                <Typography variant="body1" color="textPrimary" gutterBottom>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Thời lượng:</span> {bookingData.durationName}
                </Typography>
                <Typography variant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Thời gian khởi hành:</span>
                  {bookingData.startDate.toLocaleDateString('vi-VN')}
                </Typography>
                <Typography variant="body1" cvariant="body1" color="textPrimary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'primary.main' }}>Ngày kết thúc:</span>
                  {new Date(bookingData.startDate.getTime() + ((bookingData.numberOfDay - 1) * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN')}
                </Typography>
                <Divider sx={{ mb: 3, mt: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>CHÍNH SÁCH THANH TOÁN</Typography>
                  {bookingData.depositPercent === 100 ? (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>• Thanh toán 100% giá tour khi đăng ký</Typography>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>• Đặt cọc {bookingData.depositPercent}% số tiền tour khi đăng ký</Typography>
                      <Typography variant="body2">• Thanh toán số tiền còn lại trước {bookingData.paymentDeadline ? new Date(bookingData.paymentDeadline).toLocaleDateString('vi-VN') : ''} {' '}</Typography>
                    </>
                  )}
                </Box>
                <Box sx={{ mb: 2, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>CHÍNH SÁCH HỦY TOUR</Typography>
                  {(bookingData?.refundPolicies && bookingData?.refundPolicies.length > 0) ? (
                    <>
                      {bookingData?.refundPolicies
                        .sort((a, b) => new Date(a.cancelBefore) - new Date(b.cancelBefore))
                        .map((policy, index) => {
                          return (
                            <Typography variant="body2" key={index} sx={{ mb: 0.5 }}>
                              • Hủy trước {new Date(policy.cancelBefore).toLocaleDateString('vi-VN')}:
                              Chi phí hủy tour là {policy.refundPercent}% tổng giá trị booking <span style={{ color: 'grey' }}> - tạm tính: {(policy.refundPercent * bookingData.totalPrice / 100).toLocaleString()} đ</span>
                            </Typography>
                          );
                        })}
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Hủy từ ngày {new Date(bookingData.refundPolicies[bookingData.refundPolicies.length - 1].cancelBefore).toLocaleDateString('vi-VN')}: Chi phí hủy tour là 100% tổng giá trị booking <span style={{ color: 'grey' }}> - {bookingData.totalPrice.toLocaleString()} đ</span>
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>Tour này không hỗ trợ hoàn tiền khi khách hàng hủy tour</Typography>
                    </>
                  )}
                  <Typography variant="body2" color='error' sx={{ mb: 0.5 }}>Lưu ý: Trong trường hợp Vietway hủy tour, bạn sẽ được hoàn tiền đầy đủ.</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                {bookingData.status === 3 && (
                  <>
                    <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                      Trị giá booking:
                      <TotalPrice variant="h4" sx={{ ml: 1 }}>
                        {bookingData?.totalPrice?.toLocaleString() || 0} đ
                      </TotalPrice>
                    </Typography>
                    <ActionButton
                      variant="outlined"
                      color="primary"
                      onClick={handleFeedbackOpen}
                    >
                      {bookingData.isReviewed === false ? 'Đánh giá' : 'Xem đánh giá'}
                    </ActionButton>
                  </>
                )}
                {bookingData.status === 2 && (
                  <>
                    <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                      Trị giá booking:
                      <TotalPrice variant="h4" sx={{ ml: 1 }}>
                        {bookingData?.totalPrice?.toLocaleString() || 0} đ
                      </TotalPrice>
                    </Typography>
                    {isCancellationAllowed(bookingData) && (
                      <ActionButton
                        variant="outlined"
                        color="primary"
                        onClick={handleCancelOpen}
                      >
                        Hủy Đặt
                      </ActionButton>
                    )}
                  </>
                )}
                {(bookingData.status === 0 || bookingData.status === 1) && (
                  <Box sx={{ mt: 2 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: bookingData.depositPercent < 100 ? -2 : 0 }}>
                          <Typography sx={{ fontSize: '1.1rem' }}>Trị giá booking:</Typography>
                          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                            {bookingData?.totalPrice?.toLocaleString() || 0} đ
                          </Typography>
                        </Box>
                        <TotalPrice variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0 }}>
                          <span style={{ marginRight: '5px', color: 'black', fontSize: '1.2rem' }}>
                            Tổng tiền cần thanh toán:
                          </span>
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
                {bookingData.status === 5 && (
                  <>
                    <Typography sx={{ fontSize: '0.9rem', mb: 1, color: "#2c4af3" }}>
                      Booking của bạn đã được chuyển sang một tour mới, vui lòng kiểm tra lại thông tin mới và xác nhận chuyển tour. Nếu có sai sót thông tin xin vui lòng liên hệ tư vấn qua số điện thoại: 1900 1234.
                    </Typography>
                    {bookingData.history
                      .filter(his => his.action === EntityModifyAction.Update && !his.newStatus)
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 1)
                      .map((his, index) => (
                        <Box key={index}>
                          <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1 }}>
                            Thông tin chuyển tour
                          </Typography>
                          <SummaryItem>
                            <Typography>Thời gian:</Typography>
                            <Typography>{dayjs(his.timestamp).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                          </SummaryItem>
                          <SummaryItem>
                            <Typography>Lý do:</Typography>
                            <Typography>{his.reason || 'Không có'}</Typography>
                          </SummaryItem>
                        </Box>
                      ))}
                    <ActionButton
                      variant="contained"
                      color="primary"
                      onClick={handleConfirmChangeTour}
                    > Xác nhận chuyển </ActionButton>
                    <ActionButton
                      variant="outlined"
                      color="primary"
                      onClick={handleDenyChangeTour}
                    > Từ chối chuyển </ActionButton>
                  </>
                )}
              </SummaryBox>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 4 }}>
                <PhoneIcon sx={{ marginRight: '10px' }} />
                <Typography>Liên hệ tư vấn: 1900 1234</Typography>
              </Box>
              {bookingData.refundRequests?.length > 0 && (
                <SummaryBox>
                  <SummaryTitle variant="h6">LỊCH SỬ HOÀN TIỀN</SummaryTitle>
                  {bookingData.refundRequests.map((refund, index) => (
                    <Box key={index} mb={2}>
                      <SummaryItem>
                        <Typography>Tình trạng hoàn:</Typography>
                        <Typography sx={{ color: refund.refundStatus == 0 ? '#f16210' : 'green' }}>{refund.refundStatus == 0 ? 'Chờ hoàn tiền' : 'Đã hoàn tiền'}</Typography>
                      </SummaryItem>
                      <SummaryItem>
                        <Typography>Số tiền:</Typography>
                        <Typography>{refund.refundAmount.toLocaleString() || 0} đ</Typography>
                      </SummaryItem>
                      {refund.refundStatus == 1 && (
                        <SummaryItem>
                          <Typography>Ngày hoàn:</Typography>
                          <Typography>{new Date(refund.refundStatus).toLocaleDateString('vi-VN')}</Typography>
                        </SummaryItem>
                      )}
                      {index < bookingData.refundRequests.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </SummaryBox>
              )}
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
      {
        isFeedbackOpen && (
          <FeedbackPopup
            onClose={handleFeedbackClose}
            bookingId={bookingData.bookingId}
            onSubmitSuccess={(bookingId, rating, feedback, isPublic) => {
              handleBookingFeedback(bookingId, rating, feedback, isPublic);
            }}
          />
        )
      }
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Xác nhận chuyển tour</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xác nhận chuyển tour này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Hủy</Button>
          <Button onClick={handleConfirmChange} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={denyDialogOpen} onClose={handleDenyDialogClose}>
        <DialogTitle>Từ chối chuyển tour</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn từ chối chuyển tour này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDenyDialogClose}>Hủy</Button>
          <Button onClick={handleDenyChange} variant="contained" color="error">
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default ProfileBookingDetail;