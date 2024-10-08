import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Divider, Radio, RadioGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getBookingDataById } from "@hooks/MockBookTour";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", address: "", adults: 1, children: 0, infants: 0, note: "", paymentMethod: "", passengers: [{ type: '', name: '', gender: '', birthday: '' }] });
  const topRef = useRef(null);
  const [errors, setErrors] = useState({});

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
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
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
    const summary = calculatePassengerSummary();
    return summary.adult.total + summary.child.total + summary.infant.total;
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Thông tin bắt buộc';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          error = 'Họ và tên chỉ được chứa chữ cái';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Thông tin bắt buộc';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Số điện thoại phải là dãy 10 chữ số';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Thông tin bắt buộc';
        } else if (!/^\S+@\S+$/.test(value)) {
          error = 'Không đúng định dạng mail';
        }
        break;
      case 'passengerType':
        if (!value) {
          error = 'Vui lòng chọn loại hành khách';
        }
        break;
      case 'passengerName':
        if (!value.trim()) {
          error = 'Thông tin bắt buộc';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          error = 'Họ và tên chỉ được chứa chữ cái';
        }
        break;
      case 'passengerGender':
        if (!value) {
          error = 'Vui lòng chọn giới tính';
        }
        break;
      case 'passengerBirthday':
        if (!value) {
          error = 'Vui lòng chọn ngày sinh';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
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
        summary[passenger.type].total += bookingData.bookingInfo[`${passenger.type}Price`] || 0;
      }
    });

    return summary;
  };

  if (!bookingData) {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', alignItems: 'center', height: '80vh' }}>
            <img src="/loading.gif" alt="Loading..." />
        </div>
      </>
    );
  }

  const passengerSummary = calculatePassengerSummary();

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
          <StepBox style={{ marginBottom: 20 }}>
            <StepItem active style={{ fontSize: 25 }}>NHẬP THÔNG TIN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem style={{ fontSize: 25 }}>THANH TOÁN</StepItem>
            <ArrowIcon src="/icon/arrow-right.png" alt="arrow" />
            <StepItem style={{ fontSize: 25 }}>HOÀN TẤT</StepItem>
          </StepBox>
          <Grid container spacing={3} sx={{ maxWidth: "100%" }}>
            <Grid item xs={12} md={8} sx={{ maxWidth: "100%" }}>
              <SectionTitle variant="h5">THÔNG TIN LIÊN LẠC</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField fullWidth label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur} error={!!errors.fullName} helperText={errors.fullName} required />
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
                      <FormControl fullWidth error={!!errors[`passenger${index}-passengerType`]}>
                        <InputLabel>Loại hành khách</InputLabel>
                        <Select
                          label="Loại hành khách" name={`passengerType-${index}`} value={passenger.type || ''}
                          onChange={(e) => handlePassengerTypeChange(index, e.target.value)}
                          onBlur={() => validatePassengerField(index, 'passengerType', passenger.type)} required
                        >
                          <MenuItem value="adult">Người lớn (Từ 12 tuổi) - {bookingData.bookingInfo?.adultPrice?.toLocaleString()} đ</MenuItem>
                          <MenuItem value="child">Trẻ em (Từ 2 - 11 tuổi) - {bookingData.bookingInfo?.childPrice?.toLocaleString()} đ</MenuItem>
                          <MenuItem value="infant">Em bé (Dưới 2 tuổi) - {bookingData.bookingInfo?.infantPrice?.toLocaleString()} đ</MenuItem>
                        </Select>
                        {errors[`passenger${index}-passengerType`] && (
                          <FormHelperText>{errors[`passenger${index}-passengerType`]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField 
                        fullWidth label="Họ tên" name={`passengerName-${index}`} value={passenger.name || ''}
                        onChange={(e) => handlePassengerInfoChange(index, 'passengerName', e.target.value)}
                        onBlur={() => validatePassengerField(index, 'passengerName', passenger.name)}
                        error={!!errors[`passenger${index}-passengerName`]} helperText={errors[`passenger${index}-passengerName`]} required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors[`passenger${index}-passengerGender`]}>
                        <InputLabel>Giới tính</InputLabel>
                        <Select
                          label="Giới tính" name={`passengerGender-${index}`} value={passenger.gender}
                          onChange={(e) => handlePassengerInfoChange(index, 'gender', e.target.value)}
                          onBlur={() => validatePassengerField(index, 'gender', passenger.gender)} required>
                          <MenuItem value="male">Nam</MenuItem>
                          <MenuItem value="female">Nữ</MenuItem>
                        </Select>
                        {errors[`passenger${index}-passengerGender`] && (
                          <FormHelperText>{errors[`passenger${index}-passengerGender`]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField 
                        fullWidth label="Ngày sinh" type="date" 
                        InputLabelProps={{ shrink: true }}
                        name={`passengerBirthday-${index}`}
                        value={passenger.birthday || ''}
                        onChange={(e) => handlePassengerInfoChange(index, 'passengerBirthday', e.target.value)}
                        onBlur={() => validatePassengerField(index, 'passengerBirthday', passenger.birthday)}
                        error={!!errors[`passenger${index}-passengerBirthday`]}
                        helperText={errors[`passenger${index}-passengerBirthday`]}
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

              <SectionTitle variant="h5" style={{ marginTop: 30 }}>GHI CHÚ</SectionTitle>
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
                  <img src="https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg" alt="VNPay" style={{ width: '50px', height: '50px', position: 'absolute', marginRight: 25 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <PaymentMethod value="momo" control={<Radio />} label="Momo" />
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
                  <Typography variant="body2">{bookingData.duration}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Khởi hành:</Typography>
                  <Typography variant="body2">{bookingData.destinationProvince}</Typography>
                </SummaryItem>
                <Divider sx={{ my: 1 }} />
                <SummarySubtitle variant="subtitle2">KHÁCH HÀNG</SummarySubtitle>
                {passengerSummary.adult.count > 0 && (
                  <SummaryItem>
                    <Typography variant="body2">Người lớn:</Typography>
                    <Typography variant="body2">
                      {passengerSummary.adult.count} x {bookingData.bookingInfo?.adultPrice?.toLocaleString()} đ
                    </Typography>
                  </SummaryItem>
                )}
                {passengerSummary.child.count > 0 && (
                  <SummaryItem>
                    <Typography variant="body2">Trẻ em:</Typography>
                    <Typography variant="body2">
                      {passengerSummary.child.count} x {bookingData.bookingInfo?.childPrice?.toLocaleString()} đ
                    </Typography>
                  </SummaryItem>
                )}
                {passengerSummary.infant.count > 0 && (
                  <SummaryItem>
                    <Typography variant="body2">Em bé:</Typography>
                    <Typography variant="body2">
                      {passengerSummary.infant.count} x {bookingData.bookingInfo?.infantPrice?.toLocaleString()} đ
                    </Typography>
                  </SummaryItem>
                )}

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