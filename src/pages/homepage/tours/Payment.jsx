import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from '@mui/icons-material/Phone';
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import { Link } from "react-router-dom";
import { getMockPaymentData } from "@hooks/MockPayment";

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

const PayBooking = () => {
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const data = getMockPaymentData();
    setPaymentData(data);
  }, []);

  if (!paymentData) return null;

  return (
    <Box>
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
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem>HOÀN TẤT</StepItem>
          </StepBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <SummaryBox>
                <SummaryTitle variant="h6">THÔNG TIN LIÊN LẠC</SummaryTitle>
                <SummaryItem>
                  <Typography>Họ Tên:</Typography>
                  <Typography>{paymentData.bookingInfo.fullName}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Email:</Typography>
                  <Typography>{paymentData.bookingInfo.email}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Điện thoại:</Typography>
                  <Typography>{paymentData.bookingInfo.phone}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Địa chỉ:</Typography>
                  <Typography>{paymentData.bookingInfo.address}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Ghi chú:</Typography>
                  <Typography>{paymentData.bookingInfo.note}</Typography>
                </SummaryItem>
              </SummaryBox>
              <SummaryBox>
                <SummaryTitle variant="h6">CHI TIẾT BOOKING</SummaryTitle>
                <SummaryItem>
                  <Typography>Số booking:</Typography>
                  <Typography>{paymentData.bookingDetails.bookingId}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Ngày tạo:</Typography>
                  <Typography>{paymentData.bookingDetails.createdDate}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Trị giá booking:</Typography>
                  <Typography>{paymentData.bookingDetails.totalAmount.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Hình thức thanh toán:</Typography>
                  <Typography>{paymentData.bookingDetails.paymentMethod}</Typography>
                </SummaryItem>
                <Link to={`/trang-chu`} style={{ color: "#3572EF", display: "flex", alignItems: "center", marginBottom: 16, marginTop: 10 }}>
                    - Thay đổi hình thức thanh toán
                  </Link>
                <SummaryItem>
                  <Typography>Số tiền đã thanh toán:</Typography>
                  <Typography>{paymentData.bookingDetails.paidAmount.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Số tiền còn lại:</Typography>
                  <Typography>{paymentData.bookingDetails.remainingAmount.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Tình trạng:</Typography>
                  <Typography>{paymentData.bookingDetails.status}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography>Thời hạn thanh toán:</Typography>
                  <Typography color="#FF4836" fontWeight="bold">{paymentData.bookingDetails.paymentDueDate}</Typography>
                  <Typography fontStyle="italic" fontWeight="bold"> - {paymentData.bookingDetails.paymentDueDateNote}</Typography>
                </SummaryItem>
              </SummaryBox>
              <SummaryBox>
                <SummaryTitle variant="h6">DANH SÁCH HÀNH KHÁCH</SummaryTitle>
                {paymentData.passengers.map((passenger, index) => (
                  <Box key={index} mb={2}>
                    <SummaryItem>
                      <Typography>Họ tên:</Typography>
                      <Typography>{passenger.fullName}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography>Ngày sinh:</Typography>
                      <Typography>{passenger.birthDate}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography>Giới tính:</Typography>
                      <Typography>{passenger.gender}</Typography>
                    </SummaryItem>
                    <SummaryItem>
                      <Typography>Độ tuổi:</Typography>
                      <Typography>{passenger.ageGroup}</Typography>
                    </SummaryItem>
                    {index < paymentData.passengers.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </SummaryBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <SummaryBox>
                <SummaryTitle variant="h6">PHIẾU XÁC NHẬN BOOKING</SummaryTitle>
                <Box sx={{ mb: 2 }}>
                  <img src={paymentData.tourInfo.image} alt={paymentData.tourInfo.name} style={{ width: "100%", height: "auto" }} />
                </Box>
                <Typography variant="h6" style={{ fontWeight: "bold" }} gutterBottom>
                  {paymentData.tourInfo.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Số booking: {paymentData.tourInfo.bookingId}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" color="textPrimary" gutterBottom>
                  MÃ TOUR: {paymentData.tourInfo.tourCode}
                </Typography>
                <TotalPrice variant="h6">
                  Tổng tiền: {paymentData.totalPrice.toLocaleString()} đ
                </TotalPrice>
                <Button variant="contained" fullWidth>
                  Thanh toán ngay
                </Button>
                <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
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
    </Box>
  );
};

export default PayBooking;