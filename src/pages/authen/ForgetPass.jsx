import * as React from 'react';
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
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { requestPasswordReset, confirmResetPasswordOTP, resetPassword } from '@services/AuthenService';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ForgetPass() {
  const settingLogin = {
    dots: true,
    dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
    infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, className: 'slider'
  };

  const imgs = [
    { url: './forgetPass1.png' },
    { url: './forgetPass2.png' },
    { url: './forgetPass3.png' },
  ];

  const [showPassword, setShowPassword] = React.useState(false);
  const [step, setStep] = useState(1); // 1: phoneNumber, 2: OTP, 3: new password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(90); // 90 seconds = 1:30
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error' | 'info' | 'warning'
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);
    
    if (!password) {
      return 'Mật khẩu là bắt buộc.';
    }
    
    if (password.length < minLength) {
      return 'Mật khẩu phải có ít nhất 8 ký tự và phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt.';
    }
    
    if (!(hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar)) {
      return 'Mật khẩu phải có ít nhất 8 ký tự và phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt.';
    }
    
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (step === 1) {
        // Validate phone number
        if (!phoneNumber) {
          setErrors(prev => ({ ...prev, phoneNumber: 'Vui lòng nhập số điện thoại' }));
          return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
          setErrors(prev => ({ ...prev, phoneNumber: 'Số điện thoại không hợp lệ (bắt đầu bằng 0 và có 10 số)' }));
          return;
        }
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
        // Request OTP
        await requestPasswordReset(phoneNumber);
        setStep(2);
        setCountdown(90);
        setCanResend(false);
        setSnackbar({
          open: true,
          message: 'Mã OTP đã được gửi đến số điện thoại của bạn',
          severity: 'success'
        });
      } 
      else if (step === 2) {
        // Validate OTP
        if (!otp) {
          setErrors(prev => ({ ...prev, otp: 'Vui lòng nhập mã OTP' }));
          return;
        }
        setErrors(prev => ({ ...prev, otp: '' }));
        // Verify OTP
        const response = await confirmResetPasswordOTP(phoneNumber, otp);
        if (response.data) {
          console.log(response.data);
          setResetToken(response.data);
          setStep(3);
          setSnackbar({
            open: true,
            message: 'Xác thực OTP thành công',
            severity: 'success'
          });
        }
      } 
      else {
        // Validate new password
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
          setErrors(prev => ({ ...prev, newPassword: passwordError }));
          return;
        }

        // Validate confirm password
        if (!confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Xác nhận mật khẩu là bắt buộc' }));
          return;
        }

        if (newPassword !== confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
          return;
        }

        setErrors(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        
        // Reset password
        await resetPassword(phoneNumber, newPassword, resetToken);
        setSnackbar({
          open: true,
          message: 'Đặt lại mật khẩu thành công',
          severity: 'success'
        });
        navigate('/dang-nhap');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra',
        severity: 'error'
      });
    }
  };

  const handleResendOTP = async () => {
    if (canResend) {
      try {
        await requestPasswordReset(phoneNumber);
        setCountdown(90);
        setCanResend(false);
        setSnackbar({
          open: true,
          message: 'Đã gửi lại mã OTP',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Không thể gửi lại mã OTP',
          severity: 'error'
        });
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBackClick = () => {
    navigate('/dang-nhap');
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Quên mật khẩu';
      case 2:
        return 'Xác thực OTP';
      case 3:
        return 'Đặt lại mật khẩu';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return 'Đừng lo lắng, ai cũng có lúc gặp phải. Nhập số điện thoại của bạn dưới đây để khôi phục mật khẩu.';
      case 2:
        return `Vui lòng nhập mã OTP đã được gửi đến số điện thoại ${phoneNumber}`;
      case 3:
        return 'Vui lòng nhập mật khẩu mới của bạn';
      default:
        return '';
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Validate password as user types
    const passwordError = validatePassword(value);
    if (passwordError) {
      setErrors(prev => ({ ...prev, newPassword: passwordError }));
    } else {
      setErrors(prev => ({ ...prev, newPassword: '' }));
    }
    
    // Check confirm password match if it exists
    if (confirmPassword && value !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
    } else if (confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  return (
    <>
      <Helmet>
        <title>Quên mật khẩu</title>
      </Helmet>
      <Grid component="main" sx={{ width: '150vh', mt: -5 }}>
        <CssBaseline />
        <Grid item square md={12} sx={{ display: 'flex ' }}>
          <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'left', width: '47%', marginRight: 10, marginLeft: -6 }}>
            <img style={{ width: 90, marginBottom: 40 }} src='/logo1_color.png' alt="Logo" />
            <Button variant="text" startIcon={<ArrowBackIosNewIcon/>} onClick={step === 1 ? handleBackClick : () => setStep(1)} sx={{color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start'}}>
              Quay lại
            </Button>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              {getStepTitle()}
            </Typography>
            <Typography sx={{ fontWeight: 300, color: 'gray', marginTop: 1, marginBottom: 3 }}>
              {getStepDescription()}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {step === 1 ? (
                <TextField 
                  margin="normal" 
                  required 
                  fullWidth 
                  id="phoneNumber" 
                  label="Số điện thoại" 
                  name="phoneNumber" 
                  autoComplete="phoneNumber" 
                  autoFocus 
                  value={phoneNumber} 
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              ) : step === 2 ? (
                <>
                  <TextField 
                    margin="normal" 
                    required 
                    fullWidth 
                    id="otp" 
                    label="Nhập mã OTP" 
                    name="otp" 
                    autoFocus 
                    value={otp} 
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setErrors(prev => ({ ...prev, otp: '' }));
                    }}
                    error={!!errors.otp}
                    helperText={errors.otp}
                  />
                  <Typography sx={{ mt: 2, color: 'gray', fontSize: '0.875rem' }}>
                    Hãy đợi sau {formatTime(countdown)} để
                    <Button onClick={handleResendOTP} disabled={!canResend} 
                    sx={{ textTransform: 'none', p: 0, ml: 0.5, color: canResend ? 'primary.main' : 'gray' }}>
                      Gửi lại
                    </Button>
                    mã OTP
                  </Typography>
                </>
              ) : (
                <>
                  <TextField 
                    margin="normal" 
                    required 
                    fullWidth 
                    name="newPassword" 
                    label="Nhập mật khẩu mới" 
                    type={showNewPassword ? 'text' : 'password'} 
                    id="newPassword" 
                    value={newPassword} 
                    onChange={handlePasswordChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
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
                    value={confirmPassword} 
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }} 
                  />
                </>
              )}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, height: 45 }}>
                {step === 1 ? 'Gửi' : step === 2 ? 'Xác nhận' : 'Đặt lại mật khẩu'}
              </Button>
            </Box>
          </Box>
          <Box className="slick-slider">
            <Slider {...settingLogin}>
              {imgs.map((img, index) => (
                <div key={index}>
                  <img src={img.url} class='slideImg' />
                </div>
              ))}
            </Slider>
          </Box>
        </Grid>
      </Grid>
      <Snackbar 
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}