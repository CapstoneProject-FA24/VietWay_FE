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
import '@styles/Slider.css';

export default function ResetPass() {
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
      url: './resetPass1.png',
    },
    {
      url: './resetPass2.png',
    },
    {
      url: './resetPass3.png',
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

  return (
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
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            Đặt mật khẩu
          </Typography>
          <Typography sx={{ fontWeight: 300, color: 'gray', marginTop: 1, marginBottom: 1 }}>
            Mật khẩu trước đây của bạn đã được đặt lại. Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              autoFocus
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nhập lại mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1, height: 45 }}
            >
              Đặt mật khẩu
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
  );
}