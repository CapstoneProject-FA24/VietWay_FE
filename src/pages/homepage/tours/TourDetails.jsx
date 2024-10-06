import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, Collapse, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faLocationDot, faCalendarAlt, faTag, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/Homepage.css'
import { Link, useParams } from 'react-router-dom';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId } from '@services/TourService';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import OtherTours from '@components/OtherTours';

const TourDetails = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedTour, setSelectedTour] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableTours, setAvailableTours] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        const fetchedTours = await fetchToursByTemplateId(id);
        fetchedTourTemplate.tours = fetchedTours;
        setTour(fetchedTourTemplate);
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const currentDate = new Date();
    const months = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push({
        value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })
      });
    }
    setAvailableMonths(months);
  }, [id]);

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tour]);

  useEffect(() => {
    if (tour && selectedMonth) {
      const filteredTours = tour.tours.filter(t =>
        t.startDate.toISOString().startsWith(selectedMonth)
      );
      setAvailableTours(filteredTours);
      setSelectedTour('');
    }
  }, [selectedMonth, tour]);

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleTourChange = (event) => {
    setSelectedTour(event.target.value);
  };

  if (!tour) {
    return <Typography sx={{ width: '100vw', textAlign: 'center' }}>Loading...</Typography>;
  }

  const getMinTourPrice = () => {
    if (tour && tour.tours && tour.tours.length > 0) {
      return Math.min(...tour.tours.map(t => t.price));
    }
    return 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

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
                    <Box sx={{
                      position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px',
                      borderRadius: '50%', border: '2px solid #3572EF', backgroundColor: 'white',
                      transform: 'translateY(-50%)', zIndex: 1,
                    }} />
                  )}
                  {(index !== 0 && index !== array.length - 1) && (
                    <Box sx={{
                      position: 'absolute', left: '4px', top: '17px', width: '15px',
                      height: '15px', borderRadius: '50%', backgroundColor: '#3572EF',
                      transform: 'translateY(-50%)', zIndex: 1,
                    }} />
                  )}
                  {index !== array.length - 1 && (
                    <Box sx={{
                      position: 'absolute', left: 10.5, top: '24px', bottom: -20,
                      width: '2px', backgroundColor: '#3572EF', zIndex: 0,
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
              <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontWeight: 700, color: '#05073C', fontSize: '1.3rem' }}> Chọn ngày đi </Typography>
                <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                  <InputLabel id="month-select-label">Chọn tháng</InputLabel>
                  <Select
                    labelId="month-select-label"
                    id="month-select"
                    value={selectedMonth}
                    label="Chọn tháng"
                    onChange={handleMonthChange}
                  >
                    {availableMonths.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedMonth && (
                  availableTours.length > 0 ? (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="tour-select-label">Chọn ngày đi</InputLabel>
                      <Select
                        labelId="tour-select-label"
                        id="tour-select"
                        value={selectedTour}
                        label="Chọn ngày đi"
                        onChange={handleTourChange}
                      >
                        {availableTours.map((t) => (
                          <MenuItem key={t.id} value={t.id}>
                            {`${new Date(t.startDate).toLocaleDateString('vi-VN')} - ${formatPrice(t.price)}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography color="error" sx={{ mb: 2 }}>
                      Không có tour nào trong tháng này. Vui lòng chọn tháng khác.
                    </Typography>
                  )
                )}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 700, color: '#05073C', fontSize: '1.5rem' }}> Thông tin tour </Typography>
                <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700, fontSize: '1.5rem' }}>{tour.code}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Khởi hành từ: {availableTours.find(t => t.id === selectedTour)?.startLocation || ''}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>
                  Thời gian khởi hành: {availableTours.find(t => t.id === selectedTour)?.startDate ? new Date(availableTours.find(t => t.id === selectedTour).startDate).toLocaleDateString('vi-VN') : ''} {' '}
                  {availableTours.find(t => t.id === selectedTour)?.startTime ? new Date(`1970-01-01T${availableTours.find(t => t.id === selectedTour).startTime}`).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>
                  Thời gian kết thúc: {availableTours.find(t => t.id === selectedTour)?.endDate ? new Date(availableTours.find(t => t.id === selectedTour).endDate).toLocaleDateString('vi-VN') : ''}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>
                  Số chỗ còn nhận: {
                    (() => {
                      const selectedTourData = availableTours.find(t => t.id === selectedTour);
                      if (selectedTourData) {
                        return selectedTourData.maxParticipant - selectedTourData.currentParticipant;
                      }
                      return '';
                    })()
                  }
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Giá:</Typography>
                <Typography sx={{ ml: 1, color: 'red', fontWeight: 700, fontSize: '1.5rem' }}>
                  {selectedTour ? 
                    formatPrice(availableTours.find(t => t.id === selectedTour)?.price || 0) :
                    `Chỉ từ ${formatPrice(getMinTourPrice())}`
                  }
                </Typography>
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

export default TourDetails;