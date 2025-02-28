import * as React from 'react';
import { Button, CssBaseline, TextField, Link, Box, Grid, Typography, InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel, Snackbar, Portal } from '@mui/material';
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
import { register } from '@services/AuthenService';
import { getPreviousPage } from '@utils/NavigationHistory';
import { getCookie } from '@services/AuthenService';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getErrorMessage } from '@hooks/Message';

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
        { url: './register1.png' },
        { url: './register2.png' },
        { url: './register3.png' },
    ];

    const [showPassword, setShowPassword] = React.useState(false);
    const [gender, setGender] = React.useState('');
    const [provinces, setProvinces] = React.useState([]);
    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [dob, setDob] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [googleEmail, setGoogleEmail] = React.useState('');

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

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        return phone.length === 10 && phone.startsWith('0') && /^\d+$/.test(phone);
    };

    const validateAge = (birthDate) => {
        if (!birthDate) return { isValid: false, message: 'Ngày sinh là bắt buộc' };
        
        const today = dayjs();
        if (birthDate.isAfter(today)) {
            return { isValid: false, message: 'Ngày sinh không thể là ngày trong tương lai.' };
        }
        
        const age = today.diff(birthDate, 'year');
        if (age < 12) {
            return { isValid: false, message: 'Bạn phải đủ 12 tuổi' };
        }
        if (age >= 100) {
            return { isValid: false, message: 'Độ tuổi của bạn quá lớn.' };
        }
        
        return { isValid: true, message: null };
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            sessionStorage.setItem('googleSignInData', JSON.stringify({
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                idToken: user.accessToken
            }));
            
            navigate('/dang-ky-google');
        } catch (error) {
            console.error('Google sign in error:', error);
            setSnackbar({
                open: true,
                message: 'Đăng nhập Google thất bại. Vui lòng thử lại.',
                severity: 'error'
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newErrors = {};

        if (!data.get('lastName')) newErrors.lastName = 'Họ là bắt buộc';
        if (!data.get('firstName')) newErrors.firstName = 'Tên là bắt buộc';

        const email = data.get('email');
        if (!validateEmail(email) && !!email) {
            newErrors.email = 'Email không hợp lệ';
        }

        const phone = data.get('phone');
        if (!phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
        }

        if (!selectedProvince) newErrors.province = 'Tỉnh/Thành phố là bắt buộc';
        if (!gender && gender !== 0) newErrors.gender = 'Giới tính là bắt buộc';

        const ageValidation = validateAge(dob);
        if (!ageValidation.isValid) {
            newErrors.dob = ageValidation.message;
        }

        const password = data.get('password');
        const passwordConfirm = data.get('passwordConfirm');

        if (!password) {
            newErrors.password = 'Mật khẩu là bắt buộc.';
        } else if (password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự và phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt.';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/.test(password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự và phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt.';
        }
        if (!passwordConfirm) newErrors.passwordConfirm = 'Xác nhận mật khẩu là bắt buộc';
        if (password !== passwordConfirm) newErrors.passwordConfirm = 'Mật khẩu không khớp';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const userData = {
                    email: googleEmail || data.get('email'),
                    phoneNumber: data.get('phone'),
                    password: data.get('password'),
                    fullName: `${data.get('lastName')} ${data.get('firstName')}`,
                    dateOfBirth: dob.format('YYYY-MM-DD'),
                    gender: gender,
                    provinceId: selectedProvince,
                    isGoogleAccount: !!googleEmail
                };

                const response = await register(userData);
                setSnackbar({
                    open: true,
                    message: 'Đăng ký thành công!',
                    severity: 'success'
                });
                setTimeout(() => {
                    handleSuccessfulRegistration();
                }, 2000);
            } catch (error) {
                console.error('Registration failed:', error);
                setSnackbar({
                    open: true,
                    message: getErrorMessage(error),
                    severity: 'error'
                });
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
                <title>Đăng ký</title>
            </Helmet>
            <Grid component="main" sx={{ width: '150vh' }}>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
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
                                name="email"
                                autoComplete="email"
                                type="email"
                                value={googleEmail || undefined}
                                disabled={!!googleEmail}
                                error={!!errors.email}
                                helperText={errors.email}
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
                                                setErrors(prev => ({ ...prev, dob: 'Ngày sinh không hợp lệ.' }));
                                            } else {
                                                setErrors(prev => ({ ...prev, dob: null }));
                                            }
                                        }}
                                        maxDate={dayjs().subtract(12, 'year')}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <TextField
                                margin="normal" required fullWidth name="password" label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'} id="password"
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword} edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ marginBottom: '-2px' }}
                                error={!!errors.password}
                                helperText={'Mật khẩu cần ít nhất 8 ký tự, gồm 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt'}
                            />
                            <TextField
                                margin="normal" required fullWidth name="passwordConfirm"
                                label="Nhập lại mật khẩu" type={showPassword ? 'text' : 'password'}
                                id="passwordConfirm"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword} edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ marginBottom: '-2px' }}
                                error={!!errors.passwordConfirm}
                                helperText={errors.passwordConfirm}
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, height: 45 }}>
                                Đăng ký
                            </Button>
                            <Grid container>
                                <Grid item sx={{ width: '100%', textAlign: 'center' }}>
                                    Đã có tài khoản?
                                    <Link 
                                        sx={{ marginLeft: '7px', fontSize: '16px', textDecoration: 'none' }} 
                                        onClick={() => navigate('/dang-nhap')}
                                        variant="body2" 
                                        color='#FF8682'
                                    >
                                        {"Đăng nhập ngay"}
                                    </Link>
                                </Grid>
                                <Grid item sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}>
                                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid gray' }} />
                                    <Typography sx={{ px: 2, color: 'gray ' }}>Đăng ký bằng</Typography>
                                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid gray' }} />
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleGoogleSignIn}
                                    sx={{
                                        mt: 2,
                                        height: 45,
                                        backgroundColor: 'transparent',
                                        border: '1px solid #BDBDBD',
                                        '&:hover': {
                                            backgroundColor: 'lightgray',
                                            border: '1px solid #BDBDBD',
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
            <Portal>
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1000, position: 'fixed' }}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', zIndex: (theme) => theme.zIndex.tooltip + 1000 }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Portal>
        </>
    );
}

