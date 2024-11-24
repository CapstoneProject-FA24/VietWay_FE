import * as React from 'react';
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

export default function ChangePass() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/trang-chu');
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      emailOrPhone: data.get('emailOrPhone'),
      oldPassword: data.get('oldPassword'),
      newPassword: data.get('newPassword'),
      confirmPassword: data.get('confirmPassword'),
    });
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
          <img style={{ width: 90, marginBottom: 20 }} src='/logo1_color.png' alt="Logo" onClick={handleLogoClick}/>
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
              id="emailOrPhone"
              label="Email hoặc số điện thoại"
              name="emailOrPhone"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Mật khẩu cũ"
              type={showOldPassword ? 'text' : 'password'}
              id="oldPassword"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle old password visibility"
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
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
    </Grid>
  );
}
