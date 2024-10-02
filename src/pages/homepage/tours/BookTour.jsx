import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Divider, Radio, RadioGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getBookingDataById } from "@hooks/MockBookTour";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import PhoneIcon from '@mui/icons-material/Phone';

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

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const PassengerCounter = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const CounterButton = styled(Button)(({ theme }) => ({
  minWidth: 30,
  padding: theme.spacing(0.5),
}));

const PassengerInfo = styled(Box)(({ theme }) => ({
  border: "1px solid #ccc",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PaymentMethod = styled(FormControlLabel)(({ theme }) => ({
  border: "1px solid #ccc",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  height: '4.5rem',
  margin: "0 0 8px 0",
  padding: theme.spacing(1),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
}));

const SummaryBox = styled(Box)(({ theme }) => ({
  border: "1px solid #ddd",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  backgroundColor: "#f5f5f5",
}));

const SummaryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(1),
}));

const SummarySubtitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const TotalPrice = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  fontSize: "1.2rem",
  color: theme.palette.primary.main,
}));

const BookTour = () => {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", address: "", adults: 1, children: 0, infants: 0, note: "", paymentMethod: "" });
  const topRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBookingDataById(id);
      setBookingData(data);
    };
    fetchData();
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePassengerChange = (type, operation) => {
    setFormData((prevState) => {
      let newValue;
      if (type === "adults") {
        newValue = operation === "add" ? prevState[type] + 1 : Math.max(1, prevState[type] - 1);
      } else {
        newValue = operation === "add" ? prevState[type] + 1 : Math.max(0, prevState[type] - 1);
      }
      return { ...prevState, [type]: newValue };
    });
  };

  const calculateTotal = () => {
    if (!bookingData || !bookingData.bookingInfo) return 0;
    const { adultPrice, childPrice, infantPrice, singleRoomSurcharge, adultOnlineDiscount, childOnlineDiscount } = bookingData.bookingInfo;
    const adult = formData.adults * adultPrice;
    const children = formData.children * childPrice;
    const infant = formData.infants * infantPrice;
    return (
      adult + children + infant
    );
  };

  if (!bookingData) {
    return (
      <>
        <Header />
        <div style={{ display: "flex", alignItems: "center", height: "80vh" }}>
          <img src="public/loading.gif" alt="Loading..." />
        </div>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} ref={topRef}>
      <Header />
      <ContentContainer>
        <StyledBox>
          <Link to={`/tour-du-lich/${id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", marginBottom: 16, marginTop: 10 }}>
            <ArrowBackIcon style={{ marginLeft: 8 }} /> Quay lại
          </Link>
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bolder", fontSize: 45, marginBottom: 30, marginTop: 40, color: "#3572EF" }}>
            ĐẶT TOUR
          </Typography>
          <StepBox>
            <StepItem active>NHẬP THÔNG TIN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem>THANH TOÁN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem>HOÀN TẤT</StepItem>
          </StepBox>
          <Grid container spacing={3} sx={{ maxWidth: "100%" }}>
            <Grid item xs={12} md={8} sx={{ maxWidth: "100%" }}>
              <SectionTitle variant="h5">THÔNG TIN LIÊN LẠC</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Điện thoại" name="phone" value={formData.phone} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Địa chỉ" name="address" value={formData.address} onChange={handleInputChange} />
                </Grid>
              </Grid>

              <SectionTitle variant="h5" style={{ marginTop: 24 }}> HÀNH KHÁCH </SectionTitle>
              <PassengerCounter>
                <Typography style={{ flexGrow: 1, marginLeft: 10, fontWeight: "bold" }}>
                  Người lớn (Từ 12 tuổi)
                </Typography>
                <CounterButton onClick={() => handlePassengerChange("adults", "subtract")}>-</CounterButton>
                <Typography style={{ margin: "0 20px" }}>{formData.adults}</Typography>
                <CounterButton onClick={() => handlePassengerChange("adults", "add")}>+</CounterButton>
              </PassengerCounter>
              <PassengerCounter>
                <Typography style={{ flexGrow: 1, marginLeft: 10, fontWeight: "bold" }}>
                  Trẻ em (Từ 2 - 11 tuổi)
                </Typography>
                <CounterButton onClick={() => handlePassengerChange("children", "subtract")}>-</CounterButton>
                <Typography style={{ margin: "0 20px" }}>{formData.children}</Typography>
                <CounterButton onClick={() => handlePassengerChange("children", "add")}>+</CounterButton>
              </PassengerCounter>
              <PassengerCounter>
                <Typography style={{ flexGrow: 1, marginLeft: 10, fontWeight: "bold" }}>
                  Em bé (Dưới 2 tuổi)
                </Typography>
                <CounterButton onClick={() => handlePassengerChange("infants", "subtract")}>-</CounterButton>
                <Typography style={{ margin: "0 20px" }}>{formData.infants}</Typography>
                <CounterButton onClick={() => handlePassengerChange("infants", "add")}>+</CounterButton>
              </PassengerCounter>

              <SectionTitle variant="h5">THÔNG TIN HÀNH KHÁCH</SectionTitle>
              {[...Array(formData.adults)].map((_, index) => (
                <PassengerInfo key={`adult-${index}`}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                    Người lớn (Từ 12 tuổi)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField fullWidth label="Họ tên *" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Giới tính *</InputLabel>
                        <Select>
                          <MenuItem value="male">Nam</MenuItem>
                          <MenuItem value="female">Nữ</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField fullWidth label="Ngày sinh *" type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel control={<Checkbox />} label="Phòng đơn" />
                    </Grid>
                  </Grid>
                </PassengerInfo>
              ))}

              {[...Array(formData.children)].map((_, index) => (
                <PassengerInfo key={`children-${index}`}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                    Trẻ em (Từ 2 - 11 tuổi)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField fullWidth label="Họ tên *" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Giới tính *</InputLabel>
                        <Select>
                          <MenuItem value="male">Nam</MenuItem>
                          <MenuItem value="female">Nữ</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField fullWidth label="Ngày sinh *" type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel control={<Checkbox />} label="Phòng đơn" />
                    </Grid>
                  </Grid>
                </PassengerInfo>
              ))}

              {[...Array(formData.infants)].map((_, index) => (
                <PassengerInfo key={`infants-${index}`}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                    Em bé (Dưới 2 tuổi)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField fullWidth label="Họ tên *" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Giới tính *</InputLabel>
                        <Select>
                          <MenuItem value="male">Nam</MenuItem>
                          <MenuItem value="female">Nữ</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField fullWidth label="Ngày sinh *" type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel control={<Checkbox />} label="Phòng đơn" />
                    </Grid>
                  </Grid>
                </PassengerInfo>
              ))}

              <SectionTitle variant="h5">GHI CHÚ</SectionTitle>
              <TextField fullWidth multiline rows={4} name="note" value={formData.note} onChange={handleInputChange} placeholder="Quý khách có điều gì cần lưu ý, vui lòng để lại cho chúng tôi" />

              <SectionTitle variant="h5" style={{ marginTop: 24 }}>
                CÁC HÌNH THỨC THANH TOÁN
              </SectionTitle>
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <PaymentMethod
                    value="zalopay"
                    control={<Radio />}
                    label="Zalopay"
                  />
                  <img src="https://cdn.tgdd.vn/2020/04/GameApp/image-180x180.png" alt="Zalopay" style={{ width: '24px', height: '24px', position: 'absolute', marginRight: 25 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <PaymentMethod
                    value="momo"
                    control={<Radio />}
                    label="Momo"
                  />
                  <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" style={{ width: '24px', height: '24px', position: 'absolute', marginRight: 25 }} />
                </Box>
              </RadioGroup>
            </Grid>
            <Grid item xs={12} md={4} sx={{ maxWidth: "100%" }}>
              <SummaryTitle variant="h5" style={{ alignContent: "center" }}>
                THÔNG TIN CHUYẾN ĐI
              </SummaryTitle>
              <SummaryBox sx={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 5px #888888', borderRadius: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <img src={bookingData.images?.[0]?.url} alt={bookingData.name} style={{ width: "100%", height: "auto" }} />
                </Box>
                <Typography variant="h5" style={{ fontWeight: "bold" }} gutterBottom>
                  {bookingData.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Mã tour: {bookingData.id}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <SummaryItem>
                  <Typography variant="body2">Ngày bắt đầu:</Typography>
                  <Typography variant="body2">{bookingData.startDate}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Ngày kết thúc:</Typography>
                  <Typography variant="body2">{bookingData.endDate}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Thời gian:</Typography>
                  <Typography variant="body2">{bookingData.days}N{bookingData.nights}Đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Khởi hành:</Typography>
                  <Typography variant="body2">{bookingData.departurePlace}</Typography>
                </SummaryItem>
                <Divider sx={{ my: 1 }} />
                <SummarySubtitle variant="subtitle2">KHÁCH HÀNG</SummarySubtitle>
                <SummaryItem>
                  <Typography variant="body2">Người lớn:</Typography>
                  <Typography variant="body2">{formData.adults} x {bookingData.bookingInfo?.adultPrice?.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Trẻ em:</Typography>
                  <Typography variant="body2">{formData.children} x {bookingData.bookingInfo?.childPrice?.toLocaleString()} đ</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Em bé:</Typography>
                  <Typography variant="body2">{formData.infants} x {bookingData.bookingInfo?.infantPrice?.toLocaleString()} đ</Typography>
                </SummaryItem>

                <Divider sx={{ my: 1 }} />
                <TotalPrice variant="h6">
                  Tổng tiền: {calculateTotal().toLocaleString()} đ
                </TotalPrice>
                <Button variant="contained" fullWidth>
                  Đặt Ngay
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

export default BookTour;
