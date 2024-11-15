import * as React from 'react';
import { Button, CssBaseline, TextField, Link, Box, Grid, Typography, InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff, ArrowBackIosNew as ArrowBackIosNewIcon } from '@mui/icons-material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@styles/Slider.css';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gender } from '@hooks/Statuses';
import { fetchProvinces } from '@services/ProvinceService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { registerWithGoogle } from '@services/AuthenService';
import { getPreviousPage } from '@utils/NavigationHistory';
import { getCookie } from '@services/AuthenService';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Initialize Firebase
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

export default function RegisterWithGoogle() {
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
        { url: './register1.png' },
        { url: './register2.png' },
        { url: './register3.png' },
    ];

    const [gender, setGender] = React.useState('');
    const [provinces, setProvinces] = React.useState([]);
    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [dob, setDob] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [googleEmail, setGoogleEmail] = React.useState('');
    const [googleData, setGoogleData] = React.useState(null);

    React.useEffect(() => {
        const token = getCookie('customerToken');
        if (token) { navigate('/'); }
    }, []);

    React.useEffect(() => {
        const getProvinces = async () => {
            try {
                const data = await fetchProvinces();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        getProvinces();
    }, []);

    React.useEffect(() => {
        // Check if we have Google data in sessionStorage
        const storedGoogleData = sessionStorage.getItem('googleSignInData');
        console.log(storedGoogleData);
        if (!storedGoogleData) {
            // If no Google data, redirect to regular register page
            navigate('/dang-ky');
        } else {
            const parsedData = JSON.parse(storedGoogleData);
            setGoogleData(parsedData);
            setGoogleEmail(parsedData.email);
        }
    }, []);

    const validatePhone = (phone) => {
        return phone.length === 10 && phone.startsWith('0') && /^\d+$/.test(phone);
    };

    const validateAge = (birthDate) => {
        if (!birthDate) return false;
        const today = dayjs();
        const age = today.diff(birthDate, 'year');
        return age >= 12;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newErrors = {};

        if (!data.get('lastName')) newErrors.lastName = 'Họ là bắt buộc';
        if (!data.get('firstName')) newErrors.firstName = 'Tên là bắt buộc';

        const phone = data.get('phone');
        if (!phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
        }

        if (!selectedProvince) newErrors.province = 'Tỉnh/Thành phố là bắt buộc';
        if (!gender && gender !== 0) newErrors.gender = 'Giới tính là bắt buộc';

        if (!dob) {
            newErrors.dob = 'Ngày sinh là bắt buộc';
        } else if (!validateAge(dob)) {
            newErrors.dob = 'Bạn phải từ 12 tuổi trở lên';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const userData = {
                    idToken: googleData.idToken,
                    phoneNumber: data.get('phone'),
                    fullName: `${data.get('lastName')} ${data.get('firstName')}`,
                    dateOfBirth: dob.format('YYYY-MM-DD'),
                    gender: gender,
                    provinceId: selectedProvince
                };

                const response = await registerWithGoogle(userData);
                setSnackbar({
                    open: true,
                    message: 'Đăng ký thành công!',
                    severity: 'success'
                });
                // Clear Google data from session storage
                sessionStorage.removeItem('googleSignInData');
                setTimeout(() => {
                    handleSuccessfulRegistration();
                }, 2000);
            } catch (error) {
                console.error('Registration failed:', error);
                setSnackbar({
                    open: true,
                    message: 'Đăng ký thất bại. Vui lòng thử lại.',
                    severity: 'error'
                });
            }
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSuccessfulRegistration = () => {
        navigate('/dang-nhap');
    };

    return (
        <>
            <Helmet>
                <title>Đăng ký với Google</title>
            </Helmet>
            <Grid component="main" sx={{ width: '70vw', mt: -5 }}>
                <Grid item square md={12} sx={{ display: 'flex ', ml: '-5%' }}>
                    <Box sx={{ width: 6 }}>
                        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', width: 200 }}>
                            <Button
                                variant="text" startIcon={<ArrowBackIosNewIcon />} onClick={handleBackClick}
                                sx={{ color: '#4B4B4B', mb: 0.5, justifyContent: 'flex-start' }}
                            >
                                Quay lại
                            </Button>
                            <img style={{ width: 100 }} src='/logo1_color.png' alt="Logo" />
                        </Box>
                        <Slider {...settingRegister}>
                            {imgs.map((img, index) => (
                                <div key={index}><img src={img.url} className='slideImg' alt={`Register ${index + 1}`} /></div>
                            ))}
                        </Slider>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex', flexDirection: 'column', textAlign: 'left',
                            width: '100%', ml: '50%', mr: '-5%'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 15 }}>
                            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                                Đăng ký
                            </Typography>
                            <Typography sx={{ fontWeight: 300, color: 'gray' }}>
                                Đăng ký ngay để trải nghiệm nhiều dịch vụ tuyệt vời cùng VietWayTour
                            </Typography>
                        </Box>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', marginBottom: '-10px' }}>
                                <TextField
                                    margin="normal" required fullWidth id="lastName" label="Họ"
                                    name="lastName" autoFocus sx={{ width: '48%', marginRight: '4%' }}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                />
                                <TextField
                                    margin="normal" required fullWidth id="firstName" label="Tên"
                                    name="firstName" sx={{ width: '48%' }}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                />
                            </Box>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email"
                                value={googleEmail}
                                disabled
                                sx={{ backgroundColor: '#f5f5f5' }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TextField
                                    margin="normal" required id="phone" label="Số điện thoại"
                                    name="phone" sx={{ width: '48%', mt: 1, mb: 2 }}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                                    autoComplete="tel"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                />
                                <FormControl sx={{ width: '48%', height: '100%', mt: 1, mb: 2 }} error={!!errors.province}>
                                    <InputLabel id="province-label">Tỉnh/Thành phố *</InputLabel>
                                    <Select
                                        required labelId="province-label" id="province" value={selectedProvince}
                                        label="Tỉnh/Thành phố *" onChange={(e) => setSelectedProvince(e.target.value)}
                                    >
                                        {provinces.map((province) => (
                                            <MenuItem key={province.id} value={province.provinceId}>
                                                {province.provinceName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.province && <Typography variant="caption" sx={{ ml: 1.7 }} color="error">{errors.province}</Typography>}
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormControl sx={{ width: '48%' }} error={!!errors.gender}>
                                    <InputLabel id="gender-label">Giới tính *</InputLabel>
                                    <Select
                                        required labelId="gender-label" id="gender" value={gender} label="Giới tính *"
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <MenuItem value={Gender.Male}>Nam</MenuItem>
                                        <MenuItem value={Gender.Female}>Nữ</MenuItem>
                                        <MenuItem value={Gender.Other}>Khác</MenuItem>
                                    </Select>
                                    {errors.gender && <Typography variant="caption" sx={{ ml: 1.7 }} color="error">{errors.gender}</Typography>}
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        required
                                        label="Ngày sinh *"
                                        value={dob}
                                        onChange={(newValue) => setDob(newValue)}
                                        format="DD/MM/YYYY"
                                        slotProps={{
                                            textField: {
                                                error: !!errors.dob,
                                                helperText: errors.dob,
                                                sx: { width: '48%' }
                                            },
                                        }}
                                        onError={(error) => {
                                            if (error) {
                                                setErrors(prev => ({ ...prev, dob: 'Invalid date' }));
                                            } else {
                                                setErrors(prev => ({ ...prev, dob: null }));
                                            }
                                        }}
                                        maxDate={dayjs().subtract(12, 'year')}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                sx={{ mt: 2, mb: 1, height: 45 }}
                            >
                                Hoàn tất đăng ký
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
