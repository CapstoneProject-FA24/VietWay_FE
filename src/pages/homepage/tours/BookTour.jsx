import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, FormControlLabel, Divider, Radio, RadioGroup, FormHelperText, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import PhoneIcon from '@mui/icons-material/Phone';
import { getCustomerInfo } from '@services/CustomerService';
import { fetchTourById, calculateEndDate } from '@services/TourService';
import { createBooking } from '@services/BookingService';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import '@styles/Homepage.css'
import { useNavigate } from 'react-router-dom';
import { getCookie } from "@services/AuthenService";
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Helmet } from 'react-helmet';
import { getErrorMessage } from '@hooks/Message';

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
  fontSize: '0.85rem',
  marginTop: theme.spacing(0.5),
}));

const isCCCDRequired = (birthday, transportation) => {
  if (!['máy bay', 'tàu hỏa'].includes(transportation?.toLowerCase())) {
    return false;
  }

  if (!birthday) return false;

  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 14;
}

const BookTour = () => {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", address: "", note: "", paymentMethod: "", isDeposit: false,
    passengers: [{ type: 'Người lớn', name: '', gender: 0, birthday: '', cccd: '' }]
  });
  const topRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie('customerToken');
    if (!token) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const customer = await getCustomerInfo();
        const tour = await fetchTourById(id);
        const tourTemplate = await fetchTourTemplateById(tour.tourTemplateId);

        const completepricesByAge = [
          {
            name: "Người lớn",
            price: tour.price,
            ageFrom: 12,
            ageTo: 100
          },
          ...(tour.pricesByAge || [])
        ];

        const data = {
          ...tour,
          tourTemplateId: tour.tourTemplateId,
          imageUrls: tourTemplate.imageUrls,
          tourName: tourTemplate.tourName,
          code: tourTemplate.code,
          duration: tourTemplate.duration,
          numberOfDay: tourTemplate.numberOfDay,
          pricesByAge: completepricesByAge,
          transportation: tourTemplate.transportation,
          depositPercent: tour.depositPercent
        };

        setBookingData(data);
        setFormData(prevState => ({
          ...prevState,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address || "",
          passengers: [{
            type: 'người lớn',
            name: customer.fullName,
            gender: customer.genderId,
            birthday: dayjs(customer.birthday).format('YYYY-MM-DD'),
            cccd: customer.cccd
          }]
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
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

  const handlePassengerInfoChange = (index, field, value) => {
    const adultType = bookingData?.pricesByAge?.find(p => p.ageFrom >= 18)?.name || 'Người lớn';

    if (index === 0) {
      if (field === 'type' && value !== adultType.toLowerCase()) {
        setSnackbarMessage('Hành khách đầu tiên phải là người lớn từ 18 tuổi trở lên');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (field === 'birthday') {
        const birthDate = new Date(value);
        const age = calculateAge(birthDate);
        if (age < 18) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [`passenger${index}-birthday`]: 'Hành khách đầu tiên phải từ 18 tuổi trở lên'
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            [`passenger${index}-birthday`]: ''
          }));
        }
      }
    }

    const newPassengers = [...formData.passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setFormData({ ...formData, passengers: newPassengers });

    validatePassengerField(index, field, value);

    if (field === 'birthday') {
      const requiresCCCD = isCCCDRequired(value, bookingData?.transportation);
      if (requiresCCCD && !newPassengers[index].cccd) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [`passenger${index}-cccd`]: 'Vui lòng nhập số CCCD vì hành khách đã đủ 14 tuổi'
        }));
      }
    }
  };

  const validateField = (name, value, passengerType, index) => {
    let error = '';
    switch (name) {
      case 'fullName':
      case 'name':
        if (!value.trim()) { error = 'Vui lòng điền họ và tên'; }
        else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) { error = 'Họ và tên chỉ được chứa chữ cái'; }
        break;
      case 'phone':
        if (!value) { error = 'Vui lòng điền số điện thoại'; }
        else if (!/^[0-9]{10}$/.test(value)) { error = 'Số điện thoại không hợp lệ'; }
        break;
      case 'email':
        if (!value) { error = 'Vui lòng điền email'; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { error = 'Email không hợp lệ'; }
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
        if (!value) {
          error = 'Vui lòng chọn ngày sinh';
        } else {
          const birthDate = new Date(value);
          const age = calculateAge(birthDate);

          if (index === 0 && age < 18) {
            error = 'Hành khách đầu tiên phải từ 18 tuổi trở lên';
          } else {
            const selectedType = passengerType?.toLowerCase();
            const priceByAge = bookingData?.pricesByAge?.find(p =>
              p.name.toLowerCase() === selectedType
            );

            if (priceByAge) {
              if (priceByAge.name === 'Người lớn') {
                if (age < priceByAge.ageFrom) {
                  error = `${priceByAge.name} phải từ ${priceByAge.ageFrom} tuổi trở lên`;
                }
              } else {
                if (age < priceByAge.ageFrom || age > priceByAge.ageTo) {
                  error = `${priceByAge.name} phải từ ${priceByAge.ageFrom} - ${priceByAge.ageTo} tuổi`;
                }
              }
            }
          }
        }
        break;
    }
    return error;
  };

  const validatePassengerField = (index, field, value) => {
    const passengerType = formData.passengers[index].type;
    const error = validateField(field, value, passengerType, index);
    setErrors(prevErrors => ({
      ...prevErrors,
      [`passenger${index}-${field}`]: error
    }));

    if (field === 'cccd') {
      const passenger = formData.passengers[index];
      const requiresCCCD = isCCCDRequired(passenger.birthday, bookingData?.transportation);

      if (requiresCCCD) {
        if (!value) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [`passenger${index}-cccd`]: 'Vui lòng nhập số CCCD vì hành khách đã đủ 14 tuổi'
          }));
        } else if (!/^\d{12}$/.test(value)) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [`passenger${index}-cccd`]: 'CCCD phải có đúng 12 chữ số'
          }));
        }
      }
    }
  };

  const handleAddPassenger = () => {
    setFormData(prevState => ({
      ...prevState,
      passengers: [
        ...prevState.passengers,
        { type: '', name: '', gender: '', birthday: '', cccd: '' }
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
    const summary = {};
    formData.passengers.forEach(passenger => {
      const type = passenger.type.toLowerCase();
      const priceByAge = bookingData.pricesByAge.find(
        p => p.name.toLowerCase() === type
      );

      if (!summary[type]) {
        summary[type] = {
          count: 0,
          total: 0
        };
      }

      summary[type].count += 1;
      summary[type].total += priceByAge ? priceByAge.price : bookingData.defaultTouristPrice;
    });
    return summary;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateTotal = () => {
    const summary = calculatePassengerSummary();
    return Object.values(summary).reduce((total, typeData) => {
      return total + (typeData.total || 0);
    }, 0);
  };

  const validateAllFields = () => {
    const newErrors = {};
    ['fullName', 'phone', 'email'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    formData.passengers.forEach((passenger, index) => {
      ['type', 'name', 'gender', 'birthday'].forEach(field => {
        const error = validateField(field, passenger[field], passenger.type, index);
        if (error) newErrors[`passenger${index}-${field}`] = error;
      });

      if (isCCCDRequired(passenger.birthday, bookingData?.transportation)) {
        if (!passenger.cccd) {
          newErrors[`passenger${index}-cccd`] = 'Vui lòng nhập số CCCD vì hành khách đã đủ 14 tuổi';
        } else if (!/^\d{12}$/.test(passenger.cccd)) {
          newErrors[`passenger${index}-cccd`] = 'CCCD phải có đúng 12 chữ số';
        }
      }
    });

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (validateAllFields()) {
      setLoading(true);
      try {
        const bookingData = {
          tourId: id,
          passengers: formData.passengers.map(passenger => ({
            fullName: passenger.name,
            phoneNumber: formData.phone,
            gender: parseInt(passenger.gender),
            dateOfBirth: passenger.birthday,
            PIN: passenger.cccd
          })),
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          note: formData.note
        };

        sessionStorage.setItem('paymentMethod', formData.paymentMethod);

        const response = await createBooking(bookingData);
        setSnackbarMessage('Đặt tour thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate(`/dat-tour/thanh-toan/${response.data}`);
        }, 1500);
      } catch (error) {
        console.error('Booking failed:', error);
        setSnackbarMessage(getErrorMessage(error));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
      finally {
        setLoading(false);
      }
    } else {
      setSnackbarMessage('Thông tin đặt tour không chính xác. Vui lòng kiểm tra lại trước khi đặt tour.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDepositToggle = (event) => {
    setFormData(prev => ({
      ...prev,
      isDeposit: event.target.checked
    }));
  };

  if (loading) {
    return (
      <>
        <Helmet> <title>Đặt tour</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
      </>
    );
  }

  if (!bookingData) {
    return (
      <>
        <Header />
        <Helmet>
          <title>Không tìm thấy tour</title>
        </Helmet>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Không tìm thấy thông tin tour</Typography>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "89vw" }} ref={topRef}>
      <Helmet><title>Đặt tour</title></Helmet>
      <Header />
      <ContentContainer sx={{ width: "100%" }}>
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
          <Grid container spacing={3} sx={{ width: "100%" }}>
            <Grid item xs={12} md={8} sx={{ width: "100%" }}>
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
                          {bookingData.pricesByAge?.map(priceByAge => (
                            <MenuItem key={priceByAge.name} value={priceByAge.name.toLowerCase()}>
                              {priceByAge.name === 'Người lớn' ?
                                `${priceByAge.name} (Từ ${priceByAge.ageFrom} tuổi trở lên) - ${priceByAge.price?.toLocaleString()} đ` :
                                `${priceByAge.name} (Từ ${priceByAge.ageFrom} - ${priceByAge.ageTo} tuổi) - ${priceByAge.price?.toLocaleString()} đ`
                              }
                            </MenuItem>
                          ))}
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Ngày sinh"
                          value={dayjs(passenger.birthday)}
                          onChange={(newValue) => {
                            handlePassengerInfoChange(index, 'birthday', newValue.format('YYYY-MM-DD'));
                          }}
                          format="DD/MM/YYYY"
                          maxDate={dayjs()}
                          minDate={(() => {
                            const priceByAge = bookingData.pricesByAge?.find(
                              p => p.name.toLowerCase() === passenger.type?.toLowerCase()
                            );
                            if (priceByAge) {
                              return dayjs().subtract(priceByAge.ageTo + 1, 'year');
                            }
                            return dayjs().subtract(100, 'year');
                          })()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors[`passenger${index}-birthday`],
                              helperText: errors[`passenger${index}-birthday`],
                              required: true
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    {(['máy bay', 'tàu hỏa'].includes(bookingData?.transportation?.toLowerCase()) && passenger.type?.toLowerCase() === 'người lớn') && (
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          fullWidth
                          label={`Số CCCD`}
                          name={`passengerCCCD-${index}`}
                          value={passenger.cccd || ''}
                          onChange={(e) => handlePassengerInfoChange(index, 'cccd', e.target.value)}
                          onBlur={() => validatePassengerField(index, 'cccd', passenger.cccd)}
                          error={!!errors[`passenger${index}-cccd`]}
                          helperText={errors[`passenger${index}-cccd`] ||
                            (isCCCDRequired(passenger.birthday, bookingData?.transportation) ?
                              'Bắt buộc nhập CCCD vì hành khách đã đủ 14 tuổi' :
                              'Không bắt buộc nhập CCCD')}
                          required={isCCCDRequired(passenger.birthday, bookingData?.transportation)}
                        />
                      </Grid>
                    )}
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
                  <PaymentMethod value="VNPay" control={<Radio />} label="VNPay" />
                  <img src="/vnpay.jpg" alt="VNPay" style={{ width: '40px', height: '40px', position: 'absolute', marginRight: 25 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <PaymentMethod value="ZaloPay" control={<Radio />} label="ZaloPay" />
                  <img src="/zalopay.png" alt="ZaloPay" style={{ width: '35px', height: '35px', position: 'absolute', marginRight: 30 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <PaymentMethod value="PayOS" control={<Radio />} label="PayOS" />
                  <img src="/payos.jpg" alt="PayOS" style={{ width: '40px', height: '40px', position: 'absolute', marginRight: 25 }} />
                </Box>
              </RadioGroup>
              {errors.paymentMethod && <ErrorText>{errors.paymentMethod}</ErrorText>}
            </Grid>
            <Grid item xs={12} md={4} sx={{ width: "100%" }}>
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
                  <Typography variant="body2">Phương tiện:</Typography>
                  <Typography variant="body2">{bookingData.transportation}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Thời lượng:</Typography>
                  <Typography variant="body2">{bookingData.duration}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Thời gian khởi hành:</Typography>
                  <Typography variant="body2">{bookingData.startDate.toLocaleDateString('vi-VN')} - {new Date(`1970-01-01T${bookingData.startTime}`).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}</Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2">Ngày kết thúc:</Typography>
                  <Typography variant="body2">
                    {new Date(bookingData.startDate.getTime() + ((bookingData.numberOfDay - 1) * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN')}
                  </Typography>
                </SummaryItem>
                <SummaryItem>
                  <Typography variant="body2" sx={{ minWidth: '6rem' }}>Khởi hành từ:</Typography>
                  <Typography variant="body2">{bookingData.startLocation}</Typography>
                </SummaryItem>
                <Divider sx={{ my: 1 }} />
                <SummaryItem>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>CHÍNH SÁCH THANH TOÁN</Typography>
                    {bookingData.depositPercent === 100 ? (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>• Thanh toán 100% giá tour khi đăng ký</Typography>
                    ) : (
                      <>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>• Đặt cọc {bookingData.depositPercent}% tổng giá trị booking khi đăng ký <span style={{ color: 'grey' }}> - tạm tính: {(bookingData.depositPercent * calculateTotal() / 100).toLocaleString()} đ</span></Typography>
                        <Typography variant="body2">• Thanh toán số tiền còn lại trước {bookingData.paymentDeadline ? new Date(bookingData.paymentDeadline).toLocaleDateString('vi-VN') : ''} {' '}</Typography>
                      </>
                    )}
                  </Box>
                </SummaryItem>
                <SummaryItem>
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
                                Chi phí hủy tour là {policy.refundPercent}% tổng giá trị booking <span style={{ color: 'grey' }}> - tạm tính: {(policy.refundPercent * calculateTotal() / 100).toLocaleString()} đ</span>
                              </Typography>
                            );
                          })}
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          • Hủy từ ngày {new Date(bookingData.refundPolicies[bookingData.refundPolicies.length - 1]?.cancelBefore).toLocaleDateString('vi-VN')}: Chi phí hủy tour là 100% tổng giá trị booking <span style={{ color: 'grey' }}> - {calculateTotal().toLocaleString()} đ</span>
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Tour này không hỗ trợ hoàn tiền khi khách hàng hủy tour</Typography>
                      </>
                    )}
                    <Typography variant="body2" color='error' sx={{ mb: 0.5 }}>Lưu ý: Trong trường hợp Vietway hủy tour, bạn sẽ được hoàn tiền đầy đủ.</Typography>
                  </Box>
                </SummaryItem>
                <Divider sx={{ my: 1 }} />
                <SummarySubtitle variant="subtitle2">KHÁCH HÀNG</SummarySubtitle>
                {Object.entries(calculatePassengerSummary()).map(([type, data]) => (
                  data.count > 0 && (
                    <SummaryItem key={type}>
                      <Typography variant="body2">
                        {bookingData.pricesByAge?.find(p => p.name.toLowerCase() === type)?.name || type}:
                      </Typography>
                      <Typography variant="body2">
                        {data.count} x {(data.total / data.count).toLocaleString()} đ
                      </Typography>
                    </SummaryItem>
                  )
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -1.5 }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>Tổng tiền:</Typography>
                  <TotalPrice variant="h4" sx={{ ml: 1 }}>{calculateTotal().toLocaleString()} đ</TotalPrice>
                </Box>
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
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookTour;