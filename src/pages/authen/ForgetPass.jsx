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
import { getErrorMessage } from '@hooks/Message';

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
  const [countdown, setCountdown] = useState(180); // 180 seconds = 3 minutes
  const [otpExpired, setOtpExpired] = useState(false);
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
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown in seconds

  useEffect(() => {
    let timer;
    if ((step === 2 || step === 3) && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // OTP expired
            setOtpExpired(true);
            setCanResend(true);
            // If on password step, go back to OTP step
            if (step === 3) {
              setStep(2);
              setSnackbar({
                open: true,
                message: 'Mã OTP đã hết hạn, vui lòng yêu cầu mã mới',
                severity: 'warning'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  useEffect(() => {
    let cooldownTimer;
    if (resendCooldown > 0) {
      cooldownTimer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

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
        setCountdown(180);
        setCanResend(false);
        setResendCooldown(60); // Start initial 1-minute cooldown
        setOtpExpired(false);
        setSnackbar({
          open: true,
          message: 'Mã OTP đã được gửi đến số điện thoại của bạn',
          severity: 'success'
        });
      }
      else if (step === 2) {
        if (otpExpired || countdown === 0) {
          setSnackbar({
            open: true,
            message: 'Mã OTP đã hết hạn, vui lòng yêu cầu mã mới',
            severity: 'error'
          });
          return;
        }
        // Validate OTP
        if (!otp) {
          setErrors(prev => ({ ...prev, otp: 'Vui lòng nhập mã OTP' }));
          return;
        }
        setErrors(prev => ({ ...prev, otp: '' }));

        try {
          const response = await confirmResetPasswordOTP(phoneNumber, otp);
          setResetToken(response.data);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
          setStep(3);
        } catch (error) {
          setSnackbar({
            open: true,
            message: getErrorMessage(error),
            severity: 'error'
          });
        }
      }
      else {
        if (otpExpired || countdown === 0) {
          setStep(2);
          setSnackbar({
            open: true,
            message: 'Mã OTP đã hết hạn, vui lòng yêu cầu mã mới',
            severity: 'warning'
          });
          return;
        }

        // Password validation
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
          setErrors(prev => ({ ...prev, newPassword: passwordError }));
          return;
        }

        if (!confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Vui lòng xác nhận mật khẩu' }));
          return;
        }

        if (newPassword !== confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
          return;
        }

        try {
          await resetPassword(phoneNumber, newPassword, resetToken);
          setSnackbar({
            open: true,
            message: 'Đặt lại mật khẩu thành công',
            severity: 'success'
          });
          navigate('/dang-nhap');
        } catch (error) {
          setSnackbar({
            open: true,
            message: getErrorMessage(error),
            severity: 'error'
          });
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error'
      });
    }
  };

  const handleResendOTP = async () => {
    if (canResend && resendCooldown === 0) {
      try {
        await requestPasswordReset(phoneNumber);
        setCountdown(180); // Reset main OTP timer
        setCanResend(false);
        setOtpExpired(false);
        setResendCooldown(60); // Start 1-minute cooldown
        setOtp(''); // Clear previous OTP
        setSnackbar({
          open: true,
          message: 'Mã OTP mới đã được gửi đến số điện thoại của bạn',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: getErrorMessage(error),
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
    if (step === 1) {
      navigate('/dang-nhap');
    } else {
      // Reset states when going back to step 1
      setStep(1);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setCountdown(180);
      setOtpExpired(false);
      setCanResend(false);
      setErrors({
        phoneNumber: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
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
            <Button
              variant="text"
              startIcon={<ArrowBackIosNewIcon />}
              onClick={handleBackClick}
              sx={{
                color: '#4B4B4B',
                marginBottom: 1,
                justifyContent: 'flex-start'
              }}
            >
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
                    disabled={otpExpired}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setErrors(prev => ({ ...prev, otp: '' }));
                    }}
                    error={!!errors.otp || otpExpired}
                    helperText={otpExpired ? 'Mã OTP đã hết hạn' : errors.otp}
                  />
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
                        <Button
                          onClick={handleResendOTP}
                          disabled={!canResend || resendCooldown > 0}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            color: 'primary.main',
                            '&.Mui-disabled': {
                              color: 'gray'
                            }
                          }}
                        >
                          Gửi lại mã OTP
                        </Button>
                      )}
                    </Box>
                  </Box>
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
                  <Typography sx={{ mt: 2, color: 'gray', fontSize: '0.875rem' }}>
                    Mã OTP sẽ hết hạn trong {formatTime(countdown)}, quý khách vui lòng hoàn tất đặt lại mật khẩu mới trong thời gian này.
                    {(otpExpired || countdown === 0) && (
                      <Button
                        onClick={() => setStep(2)}
                        sx={{ textTransform: 'none', p: 0, ml: 1, color: 'primary.main' }}
                      >
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