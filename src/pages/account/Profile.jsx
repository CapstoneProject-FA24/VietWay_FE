import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, TextField, Paper, Button, Tabs, Tab, InputAdornment } from '@mui/material';
import '@styles/Homepage.css';
import Footer from '@layouts/Footer';
import Header from '@layouts/Header';
import { mockProfiles } from '@hooks/MockProfile';
import RegisteredTourCard from '@components/RegisteredTourCard';
import TourStatusTab from '@components/TourStatusTab';
import { mockTours } from '@hooks/MockTours';
import SearchIcon from '@mui/icons-material/Search';

const Profile = () => {

    const [profile, setProfile] = useState({});
    const [tabValue, setTabValue] = useState(0);
    const [statusTab, setStatusTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setProfile(mockProfiles[0]);
    }, []);

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
                    <Typography variant="h1" sx={{ fontSize: '3.5rem', mb: 1, zIndex: 2, color: 'white', mt: -20 }}>{profile.name}</Typography>
                    <Typography variant="h5" sx={{ width: "40%", zIndex: 2, color: 'white' }}>{profile.email}</Typography>
                    <img src="account-background.jpg" alt="Wave" style={{ width: "100%", height: "100%", bottom: 0, left: 0, position: "absolute", zIndex: -1 }} />
                </Box>
                
            </Box>
            <Container sx={{ my: 2, mt: -23, position: "relative", zIndex: 1}}>
                    <Tabs value={tabValue} onChange={handleTabChange} centered indicatorColor="secondary">
                        <Tab label="Tài khoản" sx={{ color: '#D4D4D4', width: '25%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                        <Box sx={{ width: '2px', height: '50px', backgroundColor: 'white' }} />
                        <Tab label="Tour Đăng Ký" sx={{ color: '#D4D4D4', width: '25%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                        <Box sx={{ width: '2px', height: '50px', backgroundColor: 'white' }} />
                        <Tab label="Lịch Sử Thanh Toán" sx={{ color: '#D4D4D4', width: '25%', '&.Mui-selected': { color: 'white', fontWeight: 700 } }} />
                    </Tabs>
                    {tabValue === 0 && (
                        <Box sx={{ my: 5 }}>
                            <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>Thông tin tài khoản</Typography>
                            <Paper sx={{ p: 4, borderRadius: '8px' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>Tên</Typography>
                                        <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 2 }}>{profile.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="text">Edit</Button>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>Email</Typography>
                                        <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 2 }}>{profile.email}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="text">Edit</Button>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>Mật khẩu</Typography>
                                        <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 2 }}>{profile.password}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="text">Edit</Button>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>Số điện thoại</Typography>
                                        <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 2 }}>{profile.phone}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="text">Edit</Button>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>Ngày sinh</Typography>
                                        <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile.dob}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="text">Edit</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )}
                    {tabValue === 2 && (
                        <Box sx={{ my: 5 }}>
                            <TextField fullWidth variant="outlined" placeholder="Tìm kiếm theo Tên tour và Mã tour"
                                        value={searchTerm} onChange={handleSearchChange} sx={{ mb: 2, backgroundColor: 'white', borderRadius: '10px', height: '40px', display: 'flex', justifyContent: 'center', border: 'none'}}
                                        InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ) }} />
                            <Paper sx={{ p: 2, borderRadius: '8px' }}>
                                <TourStatusTab statusTab={statusTab} handleStatusTabChange={handleStatusTabChange} searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
                                <Box sx={{ mt: 2 }}>
                                    {filteredTours.map((tour) => (
                                        <RegisteredTourCard key={tour.id} tour={tour} />
                                    ))}
                                </Box>
                            </Paper>
                        </Box>
                    )}
                    {tabValue === 4 && (
                        <Box sx={{ mt: 2 }}>
                        {/* Nội dung cho tab "Lịch Sử Thanh Toán" */}
                        </Box>
                    )}
                </Container>
            <Footer />
        </Box>
    );
};

export default Profile;