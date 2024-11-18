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
          // Call API to reset password
          await resetPassword(email, newPassword); // Your API call here
          
          // Show success message if needed
          // For example using a toast or alert
          
          // Redirect to login page
          navigate('/dang-nhap'); // or whatever your login route is
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
                <TextField margin="normal" required fullWidth id="email" label="Email" name="email" 
                autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
              ) : step === 2 ? (
                <>
                  <TextField margin="normal" required fullWidth id="otp" label="Nhập mã OTP" name="otp" 
                  autoFocus value={otp} onChange={(e) => setOtp(e.target.value)} />
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
                  <TextField margin="normal" required fullWidth name="newPassword" label="Nhập mật khẩu mới" 
                    type={showNewPassword ? 'text' : 'password'} id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }} />
                  <TextField margin="normal" required fullWidth name="confirmPassword" label="Nhập lại mật khẩu mới" 
                    type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }} />
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
    </>
  );
}