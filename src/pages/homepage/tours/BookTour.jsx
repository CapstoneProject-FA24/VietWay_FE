import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Divider, Radio, RadioGroup, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import PhoneIcon from '@mui/icons-material/Phone';
import { getCustomerInfo } from '@services/CustomerService';
import { fetchTourById, createBooking } from '@services/TourService';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const StyledBox = styled(Box)(({ theme }) => ({ padding: theme.spacing(3), maxWidth: "100%", margin: "0 auto", boxSizing: "border-box" }));

const StepBox = styled(Box)(({ theme }) => ({ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: theme.spacing(4) }));

const StepItem = styled(Typography)(({ theme, active }) => ({ margin: "0 10px", color: active ? "#3572EF" : "#999", fontWeight: "bold", fontSize: 30 }));

const ArrowIcon = styled("img")({ width: "30px", height: "30px", margin: "0 15px" });

const SectionTitle = styled(Typography)(({ theme }) => ({ fontWeight: "bold", marginBottom: theme.spacing(2) }));

const CustomTextField = styled(TextField)(({ theme }) => ({ marginBottom: theme.spacing(2) }));

const PassengerInfo = styled(Box)(({ theme }) => ({
  border: "1px solid #ccc", borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2), marginBottom: theme.spacing(2)
}));

const PaymentMethod = styled(FormControlLabel)(({ theme }) => ({
  border: "1px solid #ccc", borderRadius: theme.shape.borderRadius,
  width: "100%", height: '4.5rem', margin: "0 0 8px 0", padding: theme.spacing(1)
}));

const ContentContainer = styled(Box)(({ theme }) => ({ boxSizing: "border-box" }));

const SummaryBox = styled(Box)(({ theme }) => ({
  border: "1px solid #ddd", borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2), backgroundColor: "#f5f5f5"
}));

const SummaryTitle = styled(Typography)(({ theme }) => ({ fontWeight: "bold", marginBottom: theme.spacing(2), textAlign: "center" }));

const SummaryItem = styled(Box)(({ theme }) => ({ display: "flex", justifyContent: "space-between", marginBottom: theme.spacing(1) }));

const SummarySubtitle = styled(Typography)(({ theme }) => ({ fontWeight: "bold", marginTop: theme.spacing(2), marginBottom: theme.spacing(1) }));

const TotalPrice = styled(Typography)(({ theme }) => ({
  fontWeight: "bold", marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2), fontSize: "1.2rem", color: theme.palette.primary.main
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginTop: theme.spacing(0.5),
}));

const BookTour = () => {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", address: "", note: "", paymentMethod: "",
    passengers: [{ type: 'adult', name: '', gender: 0, birthday: '' }]});
  const topRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const customer = await getCustomerInfo();
      const tour = await fetchTourById(id);
      const tourTemplate = await fetchTourTemplateById(tour.tourTemplateId);
      const data = {
        tourTemplateId: tour.tourTemplateId, imageUrls: tourTemplate.imageUrls,
        tourName: tourTemplate.tourName, code: tourTemplate.code,
        duration: tourTemplate.duration, startLocation: tour.startLocation,
        startTime: tour.startTime, startDate: tour.startDate,
        endDate: tour.endDate, price: tour.price, infantPrice: tour.price / 2,
        childPrice: tour.price * (80/100)
      }
      setBookingData(data);
      setFormData(prevState => ({
        ...prevState,
        fullName: customer.fullName, email: customer.email,
        phone: customer.phone, address: customer.address || "",
        passengers: [{ type: 'adult', name: customer.fullName, gender: 0, birthday: '2001-09-11' }]
      }));
    };
    fetchData();
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handlePassengerTypeChange = (index, value) => {
    const newPassengers = [...formData.passengers];
    newPassengers[index] = { ...newPassengers[index], type: value };
    setFormData({ ...formData, passengers: newPassengers });
    validatePassengerField(index, 'passengerType', value);
  };

  const handlePassengerInfoChange = (index, field, value) => {
    const newPassengers = [...formData.passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setFormData({ ...formData, passengers: newPassengers });
    validatePassengerField(index, field, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
      case 'name':
        if (!value.trim()) { error = 'Vui lòng điền họ và tên'; } 
        else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) { error = 'Họ và tên chỉ được chứa chữ cái'; }
        break;
      case 'phone':
        if (!value) { error = 'Vui lòng điền số điện thoại'; }
        break;
      case 'email':
        if (!value) { error = 'Vui lòng điền email'; }
        break;
      case 'passengerType':
        if (!value) { error = 'Vui lòng chọn loại hành khách'; }
        break;
      case 'passengerName':
        if (!value) { error = 'Vui lòng điền tên hành khách'; }
        break;
      case 'gender':
        if (value === '' || value === undefined) {
          error = 'Vui lòng chọn giới tính';
        }
        break;
      case 'birthday':
        if (!value) { error = 'Vui lòng chọn ngày sinh'; }
        break;
    }
    return error;
  };

  const validatePassengerField = (index, field, value) => {
    const error = validateField(field, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [`passenger${index}-${field}`]: error
    }));
  };

  const handleAddPassenger = () => {
    setFormData(prevState => ({
      ...prevState,
      passengers: [
        ...prevState.passengers,
        { type: '', name: '', gender: '', birthday: '' }
      ]
    }));
  };

  const handleRemovePassenger = (index) => {
    setFormData(prevState => ({
      ...prevState,
      passengers: prevState.passengers.filter((_, i) => i !== index)
    }));
  };

  const calculatePassengerSummary = () => {
    const summary = {
      adult: { count: 0, total: 0 },
      child: { count: 0, total: 0 },
      infant: { count: 0, total: 0 }
    };

    formData.passengers.forEach(passenger => {
      if (passenger.type) {
        summary[passenger.type].count += 1;
        summary[passenger.type].total += bookingData.price || 0;
      }
    });
    return summary;
  };

  const calculateTotal = () => {
    const summary = calculatePassengerSummary();
    return summary.adult.total + summary.child.total + summary.infant.total;
  };

  const validateAllFields = () => {
    const newErrors = {};
    ['fullName', 'phone', 'email'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    formData.passengers.forEach((passenger, index) => {
      ['type', 'name', 'gender', 'birthday'].forEach(field => {
        const error = validateField(field, passenger[field]);
        if (error) newErrors[`passenger${index}-${field}`] = error;
      });
    });
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (validateAllFields()) {
      try {
        const bookingData = {
          tourId: id,
          customerId: '1', // Replace with actual customer ID
          passengers: formData.passengers.map(passenger => ({
            fullName: passenger.name,
            phoneNumber: formData.phone,
            gender: parseInt(passenger.gender),
            dateOfBirth: passenger.birthday
          })),
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          note: formData.note,
          isPayLater: true
        };
        const response = await createBooking(bookingData);
        alert('Đặt tour thành công!');
        sessionStorage.setItem('paymentMethod', formData.paymentMethod);
        window.location.href = `/dat-tour/thanh-toan/${response.data}`;
      } catch (error) {
        console.error('Booking failed:', error);
        alert('Đặt tour thất bại. Vui lòng thử lại sau.');
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin và sửa các lỗi trước khi đặt tour.');
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
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
          <Link to={`/tour-du-lich/${bookingData.tourTemplateId}`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", marginBottom: 16, marginTop: 10 }}>
            <ArrowBackIcon style={{ marginLeft: 8 }} /> Quay lại
          </Link>
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bolder", fontSize: 35, marginBottom: 30, marginTop: 40, color: "#3572EF" }}>
            ĐẶT TOUR
          </Typography>
          <StepBox style={{ marginBottom: 20 }}>
            <StepItem active >NHẬP THÔNG TIN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem >THANH TOÁN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem>HOÀN TẤT</StepItem>
          </StepBox>
          <Grid container spacing={3} sx={{ maxWidth: "100%" }}>
            <Grid item xs={12} md={8} sx={{ maxWidth: "100%" }}>
              <SectionTitle variant="h5">THÔNG TIN LIÊN LẠC</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField 
                    fullWidth 
                    label="Họ và tên" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    onBlur={handleBlur} 
                    error={!!errors.fullName} 
                    helperText={errors.fullName} 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Điện thoại" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} error={!!errors.phone} helperText={errors.phone} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} error={!!errors.email} helperText={errors.email} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Địa chỉ" name="address" value={formData.address} onChange={handleInputChange} />
                </Grid>
              </Grid>

              <SectionTitle variant="h5" style={{ marginTop: 24 }}>THÔNG TIN HÀNH KHÁCH</SectionTitle>
              {formData.passengers.map((passenger, index) => (
                <PassengerInfo key={`passenger-${index}`}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors[`passenger${index}-type`]} required>
                        <InputLabel>Loại hành khách</InputLabel>
                        <Select
                          label="Loại hành khách"
                          name={`passengerType-${index}`}
                          value={passenger.type || ''}
                          onChange={(e) => handlePassengerInfoChange(index, 'type', e.target.value)}
                          onBlur={() => validatePassengerField(index, 'type', passenger.type)}
                        >
                          <MenuItem value="adult">Người lớn (Từ 12 tuổi) - {bookingData.price?.toLocaleString()} đ</MenuItem>
                          <MenuItem value="child">Trẻ em (Từ 2 - 11 tuổi) - {bookingData.childPrice?.toLocaleString()} đ</MenuItem>
                          <MenuItem value="infant">Em bé (Dưới 2 tuổi) - {bookingData.infantPrice?.toLocaleString()} đ</MenuItem>
                        </Select>
                        {errors[`passenger${index}-type`] && (
                          <FormHelperText>{errors[`passenger${index}-type`]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField 
                        fullWidth 
                        label="Họ tên" 
                        name={`passengerName-${index}`} 
                        value={passenger.name || ''}
                        onChange={(e) => handlePassengerInfoChange(index, 'name', e.target.value)}
                        onBlur={() => validatePassengerField(index, 'name', passenger.name)}
                        error={!!errors[`passenger${index}-name`]} 
                        helperText={errors[`passenger${index}-name`]} 
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors[`passenger${index}-gender`]}>
                        <InputLabel>Giới tính *</InputLabel>
                        <Select
                          label="Giới tính"
                          name={`passengerGender-${index}`}
                          value={passenger.gender !== undefined ? passenger.gender : ''}
                          onChange={(e) => handlePassengerInfoChange(index, 'gender', e.target.value)}
                          onBlur={() => validatePassengerField(index, 'gender', passenger.gender)}
                          required
                        >
                          <MenuItem value={0}>Nam</MenuItem>
                          <MenuItem value={1}>Nữ</MenuItem>
                          <MenuItem value={2}>Khác</MenuItem>
                        </Select>
                        {errors[`passenger${index}-gender`] && (
                          <FormHelperText>{errors[`passenger${index}-gender`]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField 
                        fullWidth label="Ngày sinh" type="date" 
                        InputLabelProps={{ shrink: true }}
                        name={`passengerBirthday-${index}`}
                        value={passenger.birthday || ''}
                        onChange={(e) => handlePassengerInfoChange(index, 'birthday', e.target.value)}
                        onBlur={() => validatePassengerField(index, 'birthday', passenger.birthday)}
                        error={!!errors[`passenger${index}-birthday`]}
                        helperText={errors[`passenger${index}-birthday`]}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {index > 0 && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<RemoveIcon />}
                            onClick={() => handleRemovePassenger(index)}
                          >
                            Loại bỏ
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </PassengerInfo>
              ))}

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddPassenger}
                >
                  Thêm một hành khách
                </Button>
              </Box>

              <SectionTitle variant="h5">GHI CHÚ</SectionTitle>
              <TextField fullWidth multiline rows={4} name="note" value={formData.note} onChange={handleInputChange} placeholder="Quý khách có điều gì cần lưu ý, vui lòng để lại cho chúng tôi" />

              <SectionTitle variant="h5" style={{ marginTop: 30 }}>
                CÁC HÌNH THỨC THANH TOÁN
              </SectionTitle>
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <PaymentMethod value="vnpay" control={<Radio />} label="VNPay" />
                  <img src="/vnpay.jpg" alt="VNPay" style={{ width: '40px', height: '40px', position: 'absolute', marginRight: 25 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <PaymentMethod value="momo" control={<Radio />} label="Momo" />
                  <img src="/momo.png" alt="Momo" style={{ width: '35px', height: '35px', position: 'absolute', marginRight: 30 }} />
                </Box>
              </RadioGroup>
              {errors.paymentMethod && <ErrorText>{errors.paymentMethod}</ErrorText>}
            </Grid>
            <Grid item xs={12} md={4} sx={{ maxWidth: "100%" }}>
              <SummaryTitle variant="h5" style={{ alignContent: "center" }}>
                THÔNG TIN CHUYẾN ĐI
              </SummaryTitle>
              <SummaryBox sx={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 5px #888888', borderRadius: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <img src={bookingData.imageUrls?.[0]?.url} alt={bookingData.tourName} style={{ width: "100%", height: "auto" }} />
                </Box>
                <Typography variant="h5" style={{ fontWeight: "bold" }} gutterBottom>
                  {bookingData.tourName}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Mã tour: {bookingData.code}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <SummaryItem>
                  <Typography variant="body2">Thời gian khởi hành:</Typography>
                  <Typography variant="body2">{bookingData.startDate.toLocaleDateString('vi-VN')} - {new Date(`1970-01-01T${bookingData.startTime}`).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Ngày kết thúc:</Typography>
                  <Typography variant="body2">{bookingData.endDate.toLocaleDateString('vi-VN')}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Thời lượng:</Typography>
                  <Typography variant="body2">{bookingData.duration}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2" sx={{ minWidth: '6rem'}}>Khởi hành từ:</Typography>
                  <Typography variant="body2">{bookingData.startLocation}</Typography>
                </SummaryItem>
                <Divider sx={{ my: 1 }} />
                <SummarySubtitle variant="subtitle2">KHÁCH HÀNG</SummarySubtitle>
                {Object.entries(calculatePassengerSummary()).map(([type, data]) => (
                  data.count > 0 && (
                    <SummaryItem key={type}>
                      <Typography variant="body2">{type === 'adult' ? 'Người lớn' : type === 'child' ? 'Trẻ em' : 'Em bé'}:</Typography>
                      <Typography variant="body2">
                        {data.count} x {bookingData[type === 'adult' ? 'price' : type === 'child' ? 'childPrice' : 'infantPrice']?.toLocaleString()} đ
                      </Typography>
                    </SummaryItem>
                  )
                ))}
                <Divider sx={{ my: 1 }} />
                <TotalPrice variant="h6">
                  Tổng tiền: {calculateTotal().toLocaleString()} đ
                </TotalPrice>
                <Button variant="contained" fullWidth onClick={handleBooking}>
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