import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, Snackbar, Portal } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import '@styles/Homepage.css';
import Footer from '@layouts/Footer';
import Header from '@layouts/Header';
import ProfileDetail from '@components/profiles/ProfileDetail';
import BookedTour from '@components/profiles/BookedTour';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { getCustomerInfo } from '@services/CustomerService';
import { getCookie } from '@services/AuthenService';
import { saveLastProfileTab, getLastProfileTab } from '@utils/NavigationHistory';
import { saveNavigationHistory } from '@utils/NavigationHistory';
import { Helmet } from 'react-helmet';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [tabValue, setTabValue] = useState(getLastProfileTab());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    useEffect(() => {
        const customerToken = getCookie('customerToken');
        if (!customerToken) {
            navigate('/');
        }
        saveNavigationHistory(window.location.pathname);
        fetchCustomerInfo();
    }, []);

    const fetchCustomerInfo = async () => {
        try {
            const customerInfo = await getCustomerInfo();
            setProfile(customerInfo);
        } catch (error) {
            console.error('Failed to fetch customer info:', error);
        }
    };

    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
        setSnackbar({ open: true, message: 'Thông tin tài khoản đã được cập nhật', severity: 'success' });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        saveLastProfileTab(newValue);
    };

    return (
        <Box sx={{ width: '89vw' }}>
            <Helmet>
                <title>Thông tin tài khoản</title>
            </Helmet>
            <Header />
            <Box component="header" sx={{ ml: '-65px', mr: '-65px', position: 'relative', height: '430px', borderRadius: '0 0 30px 30px', overflow: 'hidden' }}>
                <Box className="hero-text" sx={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: "relative", zIndex: 1 }}>
                    <Box sx={{ width: "100%", height: "100%", backgroundColor: 'rgba(89, 120, 183, 0.5)', position: "absolute", top: 0, left: 0, zIndex: 0 }}></Box>
                    <Typography variant="h1" sx={{ fontSize: '3.2rem', mb: 1, zIndex: 2, color: 'white', mt: -25 }}>{profile.fullName}</Typography>
                    <Typography variant="h5" sx={{ width: "40%", zIndex: 2, color: 'white' }}>{profile.email}</Typography>
                    <img src="account-background.jpg" alt="Wave" style={{ width: "100%", height: "100%", bottom: 0, left: 0, position: "absolute", zIndex: -1 }} />
                </Box>
            </Box>
            <Container sx={{ mt: -29, position: "relative", zIndex: 1 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered indicatorColor="secondary">
                    <Tab label="Tài khoản" sx={{ color: '#D4D4D4', width: '50%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                    <Box sx={{ width: '2px', height: '50px', backgroundColor: 'white' }} />
                    <Tab label="Tour Đăng Ký" sx={{ color: '#D4D4D4', width: '50%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                </Tabs>
                <Routes>
                    <Route path="/" element={
                        <>
                            {tabValue === 0 && <ProfileDetail profile={profile} onProfileUpdate={handleProfileUpdate} />}
                            {tabValue === 2 && ( <BookedTour /> )}
                        </>
                    } />
                </Routes>
            </Container>
            <Footer />
            <Portal>
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1000, position: 'fixed' }}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', zIndex: (theme) => theme.zIndex.tooltip + 1000 }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Portal>
        </Box>
    );
};

export default Profile;
