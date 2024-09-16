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
import '../../styles/Slider.css';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Helmet } from 'react-helmet';

export default function ForgetPass() {
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
      url: './forgetPass1.png',
    },
    {
      url: './forgetPass2.png',
    },
    {
      url: './forgetPass3.png',
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
    navigate('/dang-nhap');
  };

  return (
    <>
      <Helmet>
        <title>Quên mật khẩu</title>
      </Helmet>
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
            <img style={{ width: 90, marginBottom: 40 }} src='/logo1_color.png' alt="Logo" />
            <Button
              variant="text"
              startIcon={<ArrowBackIosNewIcon/>}
              onClick={handleBackClick}
              sx={{color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start'}}
            >
              Quay lại
            </Button>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              Quên mật khẩu
            </Typography>
            <Typography sx={{ fontWeight: 300, color: 'gray', marginTop: 1, marginBottom: 3 }}>
              Đừng lo lắng, ai cũng có lúc gặp phải. Nhập email của bạn dưới đây để khôi phục mật khẩu.
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1, height: 45 }}
              >
                Gửi
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