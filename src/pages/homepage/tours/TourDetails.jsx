import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow, Button, Container, Collapse, IconButton } from '@mui/material';
import Header from '@layouts/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faClock, faMoneyBill1, faCalendar, faSun } from '@fortawesome/free-regular-svg-icons';
import OtherTours from '@components/OtherTours';
import Footer from '@layouts/Footer';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getTourById } from '@hooks/MockTours';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CommonQuestions from '@components/CommonQuestions';
import IncludeInTour from '@components/IncludeInTour';
import { Link, useLocation } from 'react-router-dom';

const TourDetails = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = getTourById(id);
        setTour(mockData);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tour]);

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Chi tiết tour</title>
        </Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!tour) {
    return (
      <>
        <Header />
        <Helmet>
          <title>Không tìm thấy tour</title>
        </Helmet>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Không tìm thấy thông tin tour</Typography>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
      <Helmet>
        <title>{tour.name}</title>
      </Helmet>
      <Header/>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', marginBottom: '30px', textAlign: 'left' }}>
          <a href="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</a> 
          &gt; 
          <a href="/tour-du-lich" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Tour du lịch</a> 
          &gt; <strong>{tour.name}</strong>
        </Typography>
        <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey' }}>
          {tour.travelCompany}
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {tour.name}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', width: '100%', height: '450px', mb: 3, ml: -2.5 }}>
                <Box sx={{ flex: '0 0 60%', mr: 2 }}>
                  <img src={tour.images[0].url} alt={tour.images[0].alt} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 43%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: '0 0 50%', mb: 1.2 }}>
                    <img src={tour.images[1].url} alt={tour.images[1].alt} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                    <Box sx={{ flex: '0 0 48.2%', mr: 2 }}>
                      <img src={tour.images[2].url} alt={tour.images[2].alt} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ flex: '0 0 48.2%' }}>
                      <img src={tour.images[3].url} alt={tour.images[3].alt} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Grid>
          <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.6rem' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography>Thời lượng:</Typography>
                    <Typography sx={{ color: 'gray' }}>{tour.days} ngày</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupOutlinedIcon style={{ marginRight: '10px', fontSize: '2rem' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography>Còn nhận:</Typography>
                    <Typography sx={{ color: 'gray' }}>{tour.totalAcceptedParticipants} người</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DirectionsBusFilledOutlinedIcon style={{ marginRight: '10px', fontSize: '2rem' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography>Phương tiện:</Typography>
                    <Typography sx={{ color: 'gray' }}>Xe du lịch</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LightModeOutlinedIcon style={{ marginRight: '10px', fontSize: '2rem' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography>Thời điểm thích hợp:</Typography>
                    <Typography sx={{ color: 'gray' }}>Quanh năm</Typography>
                  </Box>
                </Box>
              </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem' }}>Tổng quan</Typography>
              <Typography paragraph sx={{ textAlign: 'justify' }}>{tour.description}</Typography>
            </Box>
            <IncludeInTour />
            <Box sx={{ mb: 12, ml: 1 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', mb: 3, ml:-1 }}>Lịch trình</Typography>
              {tour.itinerary.map((day, index) => (
                <Box key={index} sx={{ pl: 3, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: index !== 0 && index !== tour.itinerary.length - 1 ? '-6px' : '-8px',
                      top: index === 0 ? '0%' : index === tour.itinerary.length - 1 ? '100%' : '50%',
                      width: index !== 0 && index !== tour.itinerary.length - 1 ? '12px' : '17px',
                      height: index !== 0 && index !== tour.itinerary.length - 1 ? '12px' : '17px',
                      borderRadius: '50%',
                      backgroundColor: index === 0 || index === tour.itinerary.length - 1 ? '#3572EF' : 'white',
                      border: index !== 0 && index !== tour.itinerary.length - 1 ? '2px solid #3572EF' : 'none',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                    }}
                  />
                  {index !== 0 && index !== tour.itinerary.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        width: '2px',
                        height: '12px',
                        backgroundColor: '#FFFFFF',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '-1px',
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      backgroundColor: '#3572EF',
                      borderStyle: 'dashed',
                      borderWidth: '1px',
                      borderColor: '#3572EF',
                      zIndex: 0,
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', top: index === 0 ? -15 : index === tour.itinerary.length - 1 ? 26 : 5, ml: 1 }} onClick={() => handleDayClick(day.day)}>
                    <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                      {day.title.length > 60 ? `${day.title.substring(0, 60)}...` : day.title}
                    </Typography>
                    <IconButton size="small">
                      {expandedDay === day.day ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedDay === day.day} sx={{ position: 'relative', top: index === 0 ? -15 : index === tour.itinerary.length - 1 ? 26 : 5, mt: 1, ml: 1 }}>
                    {day.description.map((item, itemIndex) => (
                      <Typography key={itemIndex} paragraph sx={{ textAlign: 'justify' }}>
                        {item.content}
                      </Typography>
                    ))}
                  </Collapse>
                </Box>
              ))}
            </Box>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem' }}>Câu hỏi thường gặp</Typography>
            <CommonQuestions />
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 1 }}>Thời gian khỏi hành</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarMonthOutlinedIcon style={{ marginRight: '10px' }} />
                <Typography>Ngày khởi hành: {tour.startDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarMonthOutlinedIcon style={{ marginRight: '10px' }} />
                <Typography>Ngày kết thúc: {tour.endDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px' }} />
                <Typography>Giờ khởi hành: {tour.beginTime}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600', mb: 1 }}>Giá tour</Typography>
                <TableContainer sx={{ border: '1px solid #D9D9D9', borderRadius: '10px', marginBottom: 3 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Người lớn</TableCell>
                        <TableCell align="right">{tour.price.adult.toLocaleString()} VNĐ</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Trẻ em (3-12 tuổi)</TableCell>
                        <TableCell align="right">{tour.price.children.toLocaleString()} VNĐ</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Trẻ em dưới 3 tuổi</TableCell>
                        <TableCell align="right">{tour.price.infant.toLocaleString()} VNĐ</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: -1 }}>Phụ thu</Typography>
              <TableContainer sx={{ marginBottom: 4, ml: -2 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: 'none' }}>Phụ thu phòng đơn</TableCell>
                        <TableCell sx={{ border: 'none' }} align="right">500,000 VNĐ</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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

export default TourDetails;
