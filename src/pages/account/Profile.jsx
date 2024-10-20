import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import '@styles/Homepage.css';
import Footer from '@layouts/Footer';
import Header from '@layouts/Header';
import { mockPayments } from '@hooks/MockProfile';
import { mockTours } from '@hooks/MockTours';
import ProfileDetail from '@components/profile/ProfileDetail';
import BookedTour from '@components/profile/BookedTour';
import PaymentHistory from '@components/profile/PaymentHistory';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { getCustomerInfo } from '@services/CustomerService';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [payments, setPayments] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [statusTab, setStatusTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
        fetchCustomerInfo();
        setPayments(mockPayments);
    }, []);

    const fetchCustomerInfo = async () => {
        try {
            const customerInfo = await getCustomerInfo();
            setProfile(customerInfo);
        } catch (error) {
            console.error('Failed to fetch customer info:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleStatusTabChange = (event, newValue) => {
        setStatusTab(newValue);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTours = mockTours.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Header />
            <Box component="header" sx={{ width: '98vw', ml: '-60px', mr: '-60px', position: 'relative', height: '430px', borderRadius: '0 0 30px 30px', overflow: 'hidden' }}>
                <Box className="hero-text" sx={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: "relative", zIndex: 1 }}>
                    <Box sx={{ width: "100%", height: "100%", backgroundColor: 'rgba(89, 120, 183, 0.5)', position: "absolute", top: 0, left: 0, zIndex: 0 }}></Box>
                    <Typography variant="h1" sx={{ fontSize: '3.2rem', mb: 1, zIndex: 2, color: 'white', mt: -25 }}>{profile.fullName}</Typography>
                    <Typography variant="h5" sx={{ width: "40%", zIndex: 2, color: 'white' }}>{profile.email}</Typography>
                    <img src="account-background.jpg" alt="Wave" style={{ width: "100%", height: "100%", bottom: 0, left: 0, position: "absolute", zIndex: -1 }} />
                </Box>
            </Box>
            <Container sx={{ mt: -29, position: "relative", zIndex: 1 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered indicatorColor="secondary">
                    <Tab label="Tài khoản" sx={{ color: '#D4D4D4', width: '25%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                    <Box sx={{ width: '2px', height: '50px', backgroundColor: 'white' }} />
                    <Tab label="Tour Đăng Ký" sx={{ color: '#D4D4D4', width: '25%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                    <Box sx={{ width: '2px', height: '50px', backgroundColor: 'white' }} />
                    <Tab label="Lịch Sử Thanh Toán" sx={{ color: '#D4D4D4', width: '25%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                </Tabs>
                <Routes>
                    <Route path="/" element={
                        <>
                            {tabValue === 0 && <ProfileDetail profile={profile} />}
                            {tabValue === 2 && (
                                <BookedTour
                                    statusTab={statusTab}
                                    handleStatusTabChange={handleStatusTabChange}
                                    searchTerm={searchTerm}
                                    handleSearchChange={handleSearchChange}
                                    filteredTours={filteredTours}
                                />
                            )}
                            {tabValue === 4 && <PaymentHistory payments={payments} />}
                        </>
                    } />
                </Routes>
            </Container>
            <Footer />
        </Box>
    );
};

export default Profile;
