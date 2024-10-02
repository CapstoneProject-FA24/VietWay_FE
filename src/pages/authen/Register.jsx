import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Register() {
    const settingRegister = {
        dots: true,
        dotsClass: 'slick-dots custom-dots',
        customPaging: i => (
            <div className="custom-dot"></div>
        ),
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    const imgs = [
        {
            url: './register1.png',
        },
        {
            url: './register2.png',
        },
        {
            url: './register3.png',
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
                <title>Đăng ký</title>
            </Helmet>
            <Grid component="main" sx={{ width: '150vh', mt: -5 }}>
                <CssBaseline />
                <Grid item square md={12} sx={{ display: 'flex ', marginLeft: '-5%' }}>
                    <Box sx={{ width: 6}}>
                        <Slider {...settingRegister}>
                            {imgs.map((img, index) => (
                                <div key={index}>
                                    <img src={img.url} class='slideImg' />
                                </div>
                            ))}
                        </Slider>
                    </Box>
                    <Box
                        sx={{
                            my: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left',
                            width: '100%',
                            marginLeft: '50%',
                            marginRight: '-5%'
                        }}
                    >
                        <img style={{ width: 90, marginBottom: 10 }} src='/logo1_color.png' alt="Logo" />
                        <Button
                            variant="text"
                            startIcon={<ArrowBackIosNewIcon/>}
                            onClick={handleBackClick}
                            sx={{color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start'}}
                        >
                            Quay lại
                        </Button>
                        <Typography component="h1" variant="h4" sx={{ fontWeight: 700}}>
                            Đăng ký
                        </Typography>
                        <Typography sx={{ fontWeight: 300, color: 'gray'}}>
                            Đăng ký ngay để trải nghiệm thêm nhiều dịch vụ tuyệt vời cùng VietWayTour
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', marginBottom: '-10px' }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Họ"
                                    name="lastName"
                                    autoFocus
                                    sx={{ width: '48%', marginRight: '4%' }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Tên"
                                    name="firstName"
                                    sx={{ width: '48%' }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', marginBottom: '-10px' }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                    sx={{ width: '48%', marginRight: '4%' }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Số điện thoại"
                                    name="phone"
                                    sx={{ width: '48%' }}
                                    inputProps={{
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*',
                                        maxLength: 10
                                    }}
                                    autoComplete="tel"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </Box>
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
                                sx={{ marginBottom: '-2px'}}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="passwordConfirm"
                                label="Nhập lại mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                id="passwordConfirm"
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
                                sx={{ marginBottom: '-2px'}}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 1, height: 45 }}
                            >
                                Đăng ký
                            </Button>
                            <Grid container>
                                <Grid item sx={{ width: '100%', textAlign: 'center' }}>
                                    Đã có tài khoản?
                                    <Link sx={{ marginLeft: '7px', fontSize: '16px', textDecoration: 'none' }} href="/dang-nhap" variant="body2" color='#FF8682'>
                                        {"Đăng nhập ngay"}
                                    </Link>
                                </Grid>
                                <Grid item sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}>
                                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid gray' }} />
                                    <Typography sx={{ px: 2, color: 'gray ' }}>Đăng ký bằng</Typography>
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
                </Grid>
            </Grid>
        </>
    );
}