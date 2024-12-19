import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@styles/Slider.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { resetPassword } from '@services/AuthenService';
import { getCookie } from "@services/AuthenService";
import { Snackbar, Alert } from '@mui/material';

export default function ChangePass() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/trang-chu');
  };

  useEffect(() => {
    const customerToken = getCookie('customerToken');
    if (!customerToken) { navigate('/'); }
  }, []);

  const settingLogin = {
    dots: true,
    dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    className: 'slider'
  };

  const imgs = [
    { url: './changePass1.png' },
    { url: './changePass2.png' },
    { url: './changePass3.png' },
  ];

  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Mật khẩu là bắt buộc.';
    } else if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự và phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])/.test(password)) {
      return 'Mật khẩu phải có ít nhất 8 ký tự và phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt.';
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      phone: data.get('phone'),
      oldPassword: data.get('oldPassword'),
      newPassword: data.get('newPassword'),
      confirmPassword: data.get('confirmPassword'),
    };

    // Reset errors
    setErrors({});
    const newErrors = {};

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Validate old password
    const oldPasswordError = validatePassword(formData.oldPassword);
    if (oldPasswordError) {
      newErrors.oldPassword = oldPasswordError;
    }

    // Validate new password
    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = getCookie('customerToken');
      console.log(token);
      await resetPassword(formData.phone, formData.newPassword, token);
      setSnackbar({
        open: true,
        message: 'Đổi mật khẩu thành công',
        severity: 'success'
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Đổi mật khẩu thất bại',
        severity: 'error'
      });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Grid component="main" sx={{ width: '150vh', mt: -5 }}>
      <CssBaseline />
      <Grid item square md={12} sx={{ display: 'flex ' }}>
        <Box
          sx={{
            my: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            textAlign: 'left',
            width: '47%',
            marginRight: 10,
            marginLeft: -6
          }}
        >
          <Button
            variant="text" startIcon={<ArrowBackIosNewIcon />} onClick={handleBackClick}
            sx={{ color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start' }}
          >
            Quay lại
          </Button>
          <img style={{ width: 90, marginBottom: 20 }} src='/logo1_color.png' alt="Logo" onClick={handleLogoClick} />
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            Đổi mật khẩu
          </Typography>
          <Typography sx={{ fontWeight: 300, color: 'gray', marginTop: 1, marginBottom: 1 }}>
            Vui lòng nhập thông tin tài khoản và mật khẩu mới của bạn.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Số điện thoại"
              name="phone"
              autoComplete="phone"
              autoFocus
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Mật khẩu cũ"
              type={showOldPassword ? 'text' : 'password'}
              id="oldPassword"
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="Mật khẩu mới"
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Nhập lại mật khẩu mới"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1, height: 45 }}
            >
              Đổi mật khẩu
            </Button>
          </Box>
        </Box>
        <Box className="slick-slider" sx={{
          '& .slideImg': {
            width: '100%',
            height: '620px',
            borderRadius: 10
          }
        }}>
          <Slider {...settingLogin}>
            {imgs.map((img, index) => (
              <div key={index}>
                <img src={img.url} className='slideImg' />
              </div>
            ))}
          </Slider>
        </Box>
      </Grid>
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
    </Grid>
  );
}
