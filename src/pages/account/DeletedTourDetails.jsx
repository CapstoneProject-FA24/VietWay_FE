import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, Collapse, IconButton, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faClock, faMoneyBill1, faLocationDot, faMap, faBus } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/Homepage.css'
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { fetchTourByBookingId } from "@services/BookingService";
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';

const TourDetails = () => {
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const navigate = useNavigate();
  const [tourTemplate, setTourTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourByBookingId(id);
        setTourTemplate(fetchedTourTemplate.tourTemplate);
        console.log(fetchedTourTemplate.tourTemplate);
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (!tourTemplate) return null;

  if (loading) {
    return (
      <Box>
        <Helmet> <title>Thông tin tour</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '99.6%' }} ref={pageTopRef}>
      <Helmet>
        <title>{tourTemplate.tourName}</title>
      </Helmet>
      <Header />
      <Box sx={{ p: 3, flexGrow: 1, mt: 4 }}>
        <Button
          variant="text" startIcon={<ArrowBackIosNewIcon />} onClick={handleBackClick}
          sx={{ color: '#4B4B4B', marginBottom: 1, justifyContent: 'flex-start' }}
        >
          Quay lại
        </Button>
        <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
          Từ {tourTemplate.startingProvince} đi {tourTemplate.provinces.join(' - ')}
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '2.5rem' }}>
          {tourTemplate.tourName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
              <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                <img src={tourTemplate.images[0]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                  <img src={tourTemplate.images[1]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                  <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                    <img src={tourTemplate.images[2]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                    <img src={tourTemplate.images[3]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <AccessTimeFilledIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Thời lượng:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tourTemplate.duration}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <CategoryIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Loại tour:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tourTemplate.tourCategory}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                {tourTemplate.transportation === 'Máy bay' && (<FlightIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                {tourTemplate.transportation === 'Tàu hỏa' && (<DirectionsTransitIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                {tourTemplate.transportation === 'Xe du lịch' && (<DirectionsCarFilledIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Phương tiện:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tourTemplate.transportation}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              <div dangerouslySetInnerHTML={{ __html: tourTemplate.description }} />
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tourTemplate.schedules.map((s, index, array) => (
                <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative' }}>
                  {(index === 0 || index === array.length - 1) && (
                    <Box sx={{
                      position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px',
                      borderRadius: '50%', border: '2px solid #3572EF', backgroundColor: 'white',
                      transform: 'translateY(-50%)', zIndex: 1
                    }} />
                  )}
                  {(index !== 0 && index !== array.length - 1) && (
                    <Box sx={{
                      position: 'absolute', left: '4px', top: '17px', width: '15px',
                      height: '15px', borderRadius: '50%', backgroundColor: '#3572EF',
                      transform: 'translateY(-50%)', zIndex: 1
                    }} />
                  )}
                  {index !== array.length - 1 && (
                    <Box sx={{
                      position: 'absolute', left: 10.5, top: '24px', bottom: -20,
                      width: '2px', backgroundColor: '#3572EF', zIndex: 0
                    }} />
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
                    <Typography sx={{ mt: 1.5, mb: -2, fontWeight: 700 }}>Các điểm đến nổi bật:</Typography>
                    <ul>
                      {s.attractions.map((attraction, i) => (
                        <li key={attraction.attractionId}>
                          <Link
                            to={`/diem-tham-quan/${attraction.attractionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {attraction.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Typography sx={{ mt: 2, mb: 0.5, fontWeight: 700 }}>Chi tiết:</Typography>
                    <Box dangerouslySetInnerHTML={{ __html: s.description }} sx={{ '& p': { lineHeight: 1.2, mt: 0, textAlign: 'justify' } }} />
                  </Collapse>
                </Box>
              ))}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
              <Box dangerouslySetInnerHTML={{ __html: tourTemplate.note }} sx={{ '& p': { lineHeight: 1.2, mt: 0, textAlign: 'justify' } }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px', boxShadow: '1px 1px 10px grey' }}>
              <Typography sx={{ fontWeight: 700, color: '#05073C', fontSize: '1.8rem', marginBottom: '15px', textAlign: 'center' }}> Thông tin tour </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, color: '#05073C', justifyContent: 'flex-start', fontSize: '1.1rem' }}>
                <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF', width: '1.2rem' }} />
                Mã tour:
                <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700, fontSize: '1.2rem' }}>{tourTemplate.code}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '10px', color: '#3572EF', marginTop: '3px', width: '1.2rem' }} />
                <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>Khởi hành từ: {tourTemplate.startingProvince}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                <FontAwesomeIcon icon={faMap} style={{ marginRight: '10px', color: '#3572EF', marginTop: '3px', width: '1.2rem' }} />
                <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>Tham quan: {tourTemplate.provinces.join(' - ')}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default TourDetails;
