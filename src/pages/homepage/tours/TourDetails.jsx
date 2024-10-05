import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, Collapse, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faLocationDot, faCalendarAlt, faTag, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/Homepage.css'
import { Link, useParams } from 'react-router-dom';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import OtherTours from '@components/OtherTours';

const tourDetails = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTour = await fetchTourTemplateById(id);
        fetchedTour.startLocation = fetchedTour.StartLocation || '';
        fetchedTour.startTime = new Date(2024, 1, 1, 14, 30);
        fetchedTour.startDate = new Date(2024, 1, 1);
        fetchedTour.endDate = new Date(2024, 3, 1);
        fetchedTour.price = 1000000;
        fetchedTour.maxParticipant = 10;
        fetchedTour.currentParticipant = 1;
        setTour(fetchedTour);
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tour]);

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (!tour) {
    return <Typography sx={{ width: '100vw', textAlign: 'center' }}>Loading...</Typography>;
  }

  return (
    <Box className='main' sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
      <Helmet>
        <title>Chi tiết tour mẫu</title>
      </Helmet>
      <Header />
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
          {tour.provinces.map(province => province.provinceName).join(' - ')}
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {tour.tourName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
              <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                <img src={tour.imageUrls[0]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tour.tourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                  <img src={tour.imageUrls[1]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tour.tourName} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                  <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                    <img src={tour.imageUrls[2]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tour.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                    <img src={tour.imageUrls[3]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tour.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: '1.6rem', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', fontWeight: 600, mr: 1, ml: 1 }}>Thời lượng:</Typography>
                <Typography sx={{ color: '#05073C' }}>{tour.duration.durationName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <FontAwesomeIcon icon={faMoneyBill1} style={{ fontSize: '1.6rem', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', fontWeight: 600, mr: 1, ml: 1 }}>Loại tour:</Typography>
                <Typography sx={{ color: '#05073C' }}>{tour.tourCategoryName}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tour.description}</Typography>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tour.schedule.map((s, index, array) => (
                <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative' }}>
                  {(index === 0 || index === array.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '18px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #3572EF',
                        backgroundColor: 'white',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {(index !== 0 && index !== array.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '4px',
                        top: '17px',
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: '#3572EF',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {index !== array.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 10.5,
                        top: '24px',
                        bottom: -20,
                        width: '2px',
                        backgroundColor: '#3572EF',
                        zIndex: 0,
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(s.dayNumber)}>
                    <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                      {`Ngày ${s.dayNumber}: ${s.title}`}
                    </Typography>
                    <IconButton size="small">
                      {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedDay === s.dayNumber} sx={{ ml: 1 }}>
                    <ul>
                      {s.attractions.map((attraction, i) => (
                        <li key={attraction.attractionId}>
                          {attraction.name}
                        </li>
                      ))}
                    </ul>
                    <Typography paragraph sx={{ textAlign: 'justify' }}>
                      {s.description}
                    </Typography>
                  </Collapse>
                </Box>
              ))}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Chính sách</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tour.policy}</Typography>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tour.note}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px', boxShadow: '1px 1px 10px grey' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 700, color: '#05073C', fontSize: '1.5rem' }}> Thông tin tour </Typography>
                <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700, fontSize: '1.5rem' }}>{tour.code}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Khởi hành từ: {tour.startLocation}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Thời gian khởi hành: {new Date(tour.startDate).toLocaleDateString('vi-VN')} {(tour.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Thời gian kết thúc: {new Date(tour.endDate).toLocaleDateString('vi-VN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Số chỗ còn nhận: {tour.maxParticipant - tour.currentParticipant}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Giá:</Typography>
                <Typography sx={{ ml: 1, color: 'red', fontWeight: 700, fontSize: '1.5rem' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}</Typography>
              </Box>
              <Button component={Link} to={"/dat-tour/" + tour.id} variant="contained" fullWidth sx={{ mb: 2, height: '45px' }}>Đặt tour</Button>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: '10px' }} />
                <Typography>Tư vấn: 1900 1234</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        <OtherTours />
      </Box>
      <Footer />
    </Box>
  );
};

export default tourDetails;