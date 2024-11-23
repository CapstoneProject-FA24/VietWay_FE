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
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(90); // 90 seconds = 1:30
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' | 'error' | 'info' | 'warning'
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown in seconds

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step === 1) {
      // Call API to send OTP
      const emailValue = event.target.email.value;
      setEmail(emailValue);
      setStep(2);
      setCountdown(90);
      setCanResend(false);
    } else if (step === 2) {
      // Verify OTP
      console.log('Verifying OTP:', otp);
      setStep(3);
    } else {
      // Reset password
      if (newPassword === confirmPassword) {
        try {
          const response = await confirmResetPasswordOTP(phoneNumber, otp);
          setResetToken(response.data); setShowNewPassword(false); setShowConfirmPassword(false); setStep(3);
        } catch (error) {
          console.error('Error resetting password:', error);
          // Handle error (show error message to user)
        }
      } else {
        // Handle password mismatch
        alert('Mật khẩu không khớp!');
      }
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      // Call API to resend OTP
      setCountdown(90);
      setCanResend(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
        return 'Đừng lo lắng, ai cũng có lúc gặp phải. Nhập email của bạn dưới đây để khôi phục mật khẩu.';
      case 2:
        return `Vui lòng nhập mã OTP đã được gửi đến ${email}`;
      case 3:
        return 'Vui lòng nhập mật khẩu mới của bạn';
      default:
        return '';
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
            <Button variant="text" startIcon={<ArrowBackIosNewIcon/>} onClick={handleBackClick} sx={{ color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start' }}>
              {step === 1 ? 'Quay lại đăng nhập' : 'Nhập số điện thoại khác'}
            </Button>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              {getStepTitle()}
            </Typography>
            <Typography sx={{ fontWeight: 300, color: 'gray', marginTop: 1, marginBottom: 3 }}>
              {getStepDescription()}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {step === 1 ? (
                <TextField margin="normal" required fullWidth id="phoneNumber" label="Số điện thoại" name="phoneNumber" autoComplete="phoneNumber" autoFocus value={phoneNumber} onChange={(e) => {
                  setPhoneNumber(e.target.value);
                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }} error={!!errors.phoneNumber} helperText={errors.phoneNumber} />
              ) : step === 2 ? (
                <>
                  <TextField margin="normal" required fullWidth id="otp" label="Nhập mã OTP" name="otp" autoFocus value={otp} disabled={otpExpired} onChange={(e) => {
                    setOtp(e.target.value);
                    setErrors(prev => ({ ...prev, otp: '' }));
                  }} error={!!errors.otp || otpExpired} helperText={otpExpired ? 'Mã OTP đã hết hạn' : errors.otp} />
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'gray', fontSize: '0.875rem' }}>
                      {otpExpired ? (
                        'Mã OTP đã hết hạn'
                      ) : (
                        `Mã OTP còn hiệu lực trong ${formatTime(countdown)}`
                      )}
                    </Typography>
                    <Box>
                      {resendCooldown > 0 ? (
                        <Typography sx={{ color: 'gray', fontSize: '0.875rem' }}>
                          Gửi lại mã sau {resendCooldown}s
                        </Typography>
                      ) : (
                        <Button onClick={handleResendOTP} disabled={!canResend || resendCooldown > 0} sx={{ textTransform: 'none', p: 0, ml: 1, color: 'primary.main' }}>
                          Gửi lại mã OTP
                        </Button>
                      )}
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <TextField margin="normal" required fullWidth name="newPassword" label="Nhập mật khẩu mới" 
                  type={showNewPassword ? 'text' : 'password'} id="newPassword" value={newPassword} 
                  onChange={handlePasswordChange} error={!!errors.newPassword} helperText={errors.newPassword} 
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} />
                  <TextField margin="normal" required fullWidth name="confirmPassword" label="Nhập lại mật khẩu mới" type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }} error={!!errors.confirmPassword} helperText={errors.confirmPassword} InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }} />
                  <Typography sx={{ mt: 2, color: 'gray', fontSize: '0.875rem' }}>
                    Mã OTP sẽ hết hạn trong {formatTime(countdown)}, quý khách vui lòng hoàn tất đặt lại mật khẩu mới trong thời gian này.
                    {(otpExpired || countdown === 0) && (
                      <Button onClick={() => setStep(2)} sx={{ textTransform: 'none', p: 0, ml: 1, color: 'primary.main' }}>
                        Gửi lại mã OTP
                      </Button>
                    )}
                  </Typography>
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
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}