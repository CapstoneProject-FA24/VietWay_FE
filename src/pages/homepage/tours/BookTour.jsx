import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getBookingDataById } from '../../../hooks/MockBookTour';
import Header from '../../../layouts/Header';
import Footer from '../../../layouts/Footer';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
}));

const StepBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const StepItem = styled(Typography)(({ theme, active }) => ({
  margin: '0 10px',
  color: active ? '#3572EF' : '#999',
  fontWeight: 'bold',
  fontSize: 25,
}));

const ArrowIcon = styled('img')({
  width: '20px',
  height: '20px',
  margin: '0 15px',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const PassengerCounter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const CounterButton = styled(Button)(({ theme }) => ({
  minWidth: 30,
  padding: theme.spacing(0.5),
}));

const PassengerInfo = styled(Box)(({ theme }) => ({
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PaymentMethod = styled(FormControlLabel)(({ theme }) => ({
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  margin: '0 0 8px 0',
  padding: theme.spacing(1),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
}));

const BookTour = () => {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    adults: 1,
    children: 0,
    infants: 0,
    note: '',
  });

  useEffect(() => {
    const data = getBookingDataById(id);
    setBookingData(data);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePassengerChange = (type, operation) => {
    setFormData(prevState => {
      let newValue;
      if (type === 'adults') {
        newValue = operation === 'add' ? prevState[type] + 1 : Math.max(1, prevState[type] - 1);
      } else {
        newValue = operation === 'add' ? prevState[type] + 1 : Math.max(0, prevState[type] - 1);
      }
      return { ...prevState, [type]: newValue };
    });
  };

  if (!bookingData) {
    return (
        <>
        <Header />
        <div style={{ display: 'flex', alignItems: 'center', height: '80vh' }}>
            <img src="../../public/loading.gif" alt="Loading..." />
        </div>
        </>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%'
    }}>
      <Header />
      <ContentContainer>
        <StyledBox>
          <Link to={`/tour-details/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <ArrowBackIcon style={{ marginLeft: 8 }}/> Quay lại
          </Link>
          <Typography variant="h4" align="center" style={{ fontWeight: 'bolder', fontSize: 40, marginBottom: 30 }} gutterBottom>ĐẶT TOUR</Typography>
          <StepBox>
            <StepItem active>NHẬP THÔNG TIN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem>THANH TOÁN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem>HOÀN TẤT</StepItem>
          </StepBox>
          <Grid container spacing={3} sx={{ maxWidth: '100%' }}>
            <Grid item xs={12} md={8} sx={{ maxWidth: '100%' }}>
              <SectionTitle variant="h6">THÔNG TIN LIÊN LẠC</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Họ và tên *" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Điện thoại *" name="phone" value={formData.phone} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Email *" name="email" value={formData.email} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Địa chỉ" name="address" value={formData.address} onChange={handleInputChange} />
                </Grid>
              </Grid>
              
              <SectionTitle variant="h6" style={{ marginTop: 24 }}>HÀNH KHÁCH</SectionTitle>
              <PassengerCounter>
                <Typography style={{ flexGrow: 1, marginLeft: 10 }}>Người lớn (Từ 12 tuổi)</Typography>
                <CounterButton onClick={() => handlePassengerChange('adults', 'subtract')}>-</CounterButton>
                <Typography style={{ margin: '0 20px' }}>{formData.adults}</Typography>
                <CounterButton onClick={() => handlePassengerChange('adults', 'add')}>+</CounterButton>
              </PassengerCounter>
              <PassengerCounter>
                <Typography style={{ flexGrow: 1, marginLeft: 10 }}>Trẻ em (Từ 2 - 11 tuổi)</Typography>
                <CounterButton onClick={() => handlePassengerChange('children', 'subtract')}>-</CounterButton>
                <Typography style={{ margin: '0 20px' }}>{formData.children}</Typography>
                <CounterButton onClick={() => handlePassengerChange('children', 'add')}>+</CounterButton>
              </PassengerCounter>
              <PassengerCounter>
                <Typography style={{ flexGrow: 1, marginLeft: 10 }}>Em bé (Dưới 2 tuổi)</Typography>
                <CounterButton onClick={() => handlePassengerChange('infants', 'subtract')}>-</CounterButton>
                <Typography style={{ margin: '0 20px' }}>{formData.infants}</Typography>
                <CounterButton onClick={() => handlePassengerChange('infants', 'add')}>+</CounterButton>
              </PassengerCounter>

              <SectionTitle variant="h6">THÔNG TIN HÀNH KHÁCH</SectionTitle>
              {[...Array(formData.adults)].map((_, index) => (
                <PassengerInfo key={`adult-${index}`}>
                  <Typography variant="subtitle1">Người lớn (Từ 12 tuổi)</Typography>
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
                  <Typography variant="subtitle1">Trẻ em (Từ 2 - 11 tuổi)</Typography>
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
                  <Typography variant="subtitle1">Em bé (Dưới 2 tuổi)</Typography>
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

              <SectionTitle variant="h6">GHI CHÚ</SectionTitle>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Quý khách có điều gì cần lưu ý, vui lòng để lại cho chúng tôi"
              />

              <SectionTitle variant="h6" style={{ marginTop: 24 }}>CÁC HÌNH THỨC THANH TOÁN</SectionTitle>
              <PaymentMethod control={<Checkbox />} label="Tiền mặt" />
              <PaymentMethod control={<Checkbox />} label="Chuyển khoản ngân hàng" />
              <PaymentMethod control={<Checkbox />} label="Zalopay" />
              <PaymentMethod control={<Checkbox />} label="Momo" />
            </Grid>
            <Grid item xs={12} md={4} sx={{ maxWidth: '100%' }}>
              <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
                <SectionTitle variant="h6">TÓM TẮT THÔNG TIN CHUYẾN ĐI</SectionTitle>
                <Box sx={{ mb: 2 }}>
                  <img src={bookingData.images[0].url} alt={bookingData.name} style={{ width: '100%', height: 'auto' }} />
                </Box>
                <Typography variant="subtitle1" gutterBottom>{bookingData.name}</Typography>
                <Typography variant="body2" gutterBottom>Khởi hành: {bookingData.startDate}</Typography>
                <Typography variant="body2" gutterBottom>Thời gian: {bookingData.days} ngày</Typography>
                <SectionTitle variant="subtitle1">KHÁCH HÀNG + PHỤ THU</SectionTitle>
                <Typography variant="body2">Người lớn: {formData.adults} x {bookingData.bookingInfo.adultPrice.toLocaleString()} đ</Typography>
                <Typography variant="body2">Trẻ em: {formData.children} x {bookingData.bookingInfo.childPrice.toLocaleString()} đ</Typography>
                <Typography variant="body2">Em bé: {formData.infants} x {bookingData.bookingInfo.infantPrice.toLocaleString()} đ</Typography>
                <Typography variant="body2">Phụ thu phòng đơn: {bookingData.bookingInfo.singleRoomSurcharge.toLocaleString()} đ</Typography>
                <SectionTitle variant="subtitle1">ƯU ĐÃI ĐẶT ONLINE</SectionTitle>
                <Typography variant="body2">Người lớn: 1 x {bookingData.bookingInfo.onlineBookingDiscount.toLocaleString()} đ</Typography>
                <Typography variant="body2">Trẻ em: 1 x {(bookingData.bookingInfo.onlineBookingDiscount / 2).toLocaleString()} đ</Typography>
                <Typography variant="h6" style={{ marginTop: 16 }}>Tổng tiền: {(
                  formData.adults * bookingData.bookingInfo.adultPrice +
                  formData.children * bookingData.bookingInfo.childPrice +
                  formData.infants * bookingData.bookingInfo.infantPrice +
                  bookingData.bookingInfo.singleRoomSurcharge -
                  bookingData.bookingInfo.onlineBookingDiscount
                ).toLocaleString()} đ</Typography>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>Đặt Ngay</Button>
                <Button variant="outlined" fullWidth sx={{ mt: 1 }}>Liên hệ tư vấn</Button>
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