import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
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
import '../../styles/Slider.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập</title>
      </Helmet>
      <Grid component="main" sx={{ width: '150vh', mt: -5}}>
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
            <img style={{ width: 90, marginBottom: 20 }} src='/logo1_color.png' alt="Logo" />
            <Button
              variant="text"
              startIcon={<ArrowBackIosNewIcon/>}
              onClick={handleBackClick}
              sx={{color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start'}}
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
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Lưu mật khẩu"
                />
                <Grid item>
                  <Link href="/quen-mat-khau" variant="body2" color="secondary" sx={{ textDecoration: 'none' }}>
                    Quên mật khẩu?
                  </Link>
                </Grid>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1, height: 45 }}
              >
                Đăng nhập
              </Button>
              <Grid container>
                <Grid item sx={{ width: '100%', textAlign: 'center' }}>
                  Chưa có tài khoản?
                  <Link sx={{ marginLeft: '7px', fontSize: '16px', textDecoration: 'none' }} href="/dang-ky" variant="body2" color='secondary'>
                    {"Đăng ký ngay"}
                  </Link>
                </Grid>
                <Grid item sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 4, marginBottom: 1 }}>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid gray' }} />
                  <Typography sx={{ px: 2, color: 'gray ' }}>Đăng nhập bằng</Typography>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid gray' }} />
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    height: 45,
                    backgroundColor: 'transparent',
                    border: '1px solid #BDBDBD ',
                    '&:hover': {
                      backgroundColor: 'lightgray',
                      border: '1px solid #BDBDBD ',
                    },
                  }}
                >
                  <img style={{ width: 20 }} src='/Logo-google-icon-PNG.png' alt="Logo" />
                </Button>
              </Grid>
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