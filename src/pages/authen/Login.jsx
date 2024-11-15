import React, { useState, useEffect } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Box, Grid, Typography, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBackIosNew as ArrowBackIosNewIcon } from '@mui/icons-material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@styles/Slider.css';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, loginWithGoogle } from '@services/AuthenService';
import { getPreviousPage, clearNavigationHistory } from '@utils/NavigationHistory';
import { getCookie } from '@services/AuthenService';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Login() {
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
    {
      url: './login1.png',
    },
    {
      url: './login2.png',
    },
    {
      url: './login3.png',
    },
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmailOrPhone = (input) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(String(input).toLowerCase()) || phoneRegex.test(input);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email hoặc số điện thoại không được để trống');
      setLoading(false);
    }

    if (email && !validateEmailOrPhone(email)) {
      setEmailError('Email hoặc số điện thoại không hợp lệ');
      setLoading(false);
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      setLoading(false);
    }

    try {
      if (email && password) {
        const response = await login({ email, password });
        if (response.data) {
          const history = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
          let targetPage = '/';

          while (history.length > 0 && (history[history.length - 1] === '/dang-nhap' || history[history.length - 1] === '/dang-ky')) {
            history.pop();
          }

          if (history.length > 0) {
            targetPage = history[history.length - 1];
          }

          clearNavigationHistory();
          navigate(targetPage);
        } else {
          setError('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
      }
    } catch (error) {
      if (error.response.data.statusCode === 401 && error.response.data.message === 'Email or password is incorrect') {
        setError('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại');
      }
      else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const idToken = await user.getIdToken();
      
      const response = await loginWithGoogle(idToken);
      
      if (response.data) {
        const targetPage = getPreviousPage() || '/';
        clearNavigationHistory();
        navigate(targetPage);
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Đăng nhập đã bị hủy.');
      } else {
        setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập</title>
      </Helmet>
      <Grid component="main" sx={{ width: '150vh', mt: -5 }}>
        <CssBaseline />
        <Grid item square md={12} sx={{ display: 'flex ' }}>
          <Box
            sx={{
              my: 1, display: 'flex', flexDirection: 'column', alignItems: 'left',
              textAlign: 'left', width: '47%', marginRight: 10, marginLeft: -6
            }}
          >
            <img style={{ width: 90, marginBottom: 20 }} src='/logo1_color.png' alt="Logo" />
            <Button
              variant="text" startIcon={<ArrowBackIosNewIcon />} onClick={handleBackClick}
              sx={{ color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start' }}
            >
              Quay lại
            </Button>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              Đăng nhập
            </Typography>
            <Typography sx={{ fontWeight: 300, color: 'gray', marginTop: 1, marginBottom: 1 }}>
              Đăng nhập để truy cập tài khoản VietWayTour của bạn
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal" required fullWidth id="email" label="Email hoặc số điện thoại"
                name="email" autoComplete="email" autoFocus value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                margin="normal" required fullWidth name="password" label="Mật khẩu"
                type={showPassword ? 'text' : 'password'} id="password"
                autoComplete="current-password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Lưu mật khẩu" /> */}
                <Grid item>
                  <Link href="/quen-mat-khau" variant="body2" color="#FF8682" sx={{ textDecoration: 'none' }}>
                    Quên mật khẩu?
                  </Link>
                </Grid>
              </div>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, height: 45 }} disabled={loading} >
                {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
              </Button>
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>  {error} </Typography>
              )}
              <Grid container>
                <Grid item sx={{ width: '100%', textAlign: 'center' }}>
                  Chưa có tài khoản?
                  <Link
                    sx={{ marginLeft: '7px', fontSize: '16px', textDecoration: 'none' }}
                    onClick={() => navigate('/dang-ky')}
                    variant="body2"
                    color='#FF8682'
                  >
                    {"Đăng ký ngay"}
                  </Link>
                </Grid>
                <Grid item sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 4, marginBottom: 1 }}>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid gray' }} />
                  <Typography sx={{ px: 2, color: 'gray ' }}>Đăng nhập bằng</Typography>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid gray' }} />
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    height: 45,
                    backgroundColor: 'transparent',
                    border: '1px solid #BDBDBD',
                    '&:hover': { backgroundColor: 'lightgray', border: '1px solid #BDBDBD' },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : <img style={{ width: 20 }} src='/Logo-google-icon-PNG.png' alt="Logo" />}
                </Button>
              </Grid>
            </Box>
          </Box>
          <Box className="slick-slider">
            <Slider {...settingLogin}>
              {imgs.map((img, index) => (
                <div key={index}>
                  <img src={img.url} className='slideImg' alt={`Login slide ${index + 1}`} />
                </div>
              ))}
            </Slider>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
