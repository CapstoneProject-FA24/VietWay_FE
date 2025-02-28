import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, Collapse, IconButton, Select, MenuItem, FormControl, InputLabel, Alert, Snackbar, CircularProgress, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faUser, faClock, faMoneyBill1, faLocationDot, faCalendarAlt, faTag, faPhone, faBus } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/Homepage.css'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId } from '@services/TourService';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import OtherTours from '@components/tours/OtherTours';
import ReviewListTour from '@components/reviews/ReviewListTour';
import MediaShare from '@components/posts/MediaShare';
import { getCookie } from '@services/AuthenService';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

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
  const navigate = useNavigate();
  const monthSelectRef = useRef(null);
  const tourSelectRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      let site = null;
      if (sessionStorage.getItem('previousPage') !== location.pathname) {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('ref') === 'facebook') {
          site = 0;
        } else if (searchParams.get('ref') === 'x') {
          site = 1;
        } else {
          site = 2;
        }
      }
      sessionStorage.setItem('previousPage', location.pathname);

      const fetchedTourTemplate = await fetchTourTemplateById(id, site);
      const fetchedTours = await fetchToursByTemplateId(id);
      fetchedTourTemplate.tours = fetchedTours;
      setTour(fetchedTourTemplate);
      const months = [...new Set(fetchedTours.map(tour => {
        const date = new Date(tour.startDate);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }))].sort();
      setAvailableMonths(months.map(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        return {
          value: month,
          label: date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })
        };
      }));

      if (months.length > 0) {
        setSelectedMonth(months[0]);
      }

    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tour]);

  useEffect(() => {
    if (tour && selectedMonth) {
      const token = getCookie('customerToken');
      setIsLoggedIn(!!token);
      const filteredTours = tour.tours.filter(t => dayjs(t.startDate).format('YYYY-MM-DD').startsWith(selectedMonth));
      setAvailableTours(filteredTours);

      if (filteredTours.length > 0) {
        setSelectedTour(filteredTours[0].id);
      } else {
        setSelectedTour('');
      }
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

  const handleBooking = () => {
    if (!isLoggedIn) {
      setAlertMessage('Bạn chưa đăng nhập. Vui lòng đăng nhập để đặt tour.');
      setOpenSnackbar(true);
      tourSelectRef.current?.focus();
    }
    else if (!selectedTour) {
      setAlertMessage('Vui lòng chọn tour trước khi đặt.');
      setOpenSnackbar(true);
      tourSelectRef.current?.focus();
    } else {
      navigate(`/dat-tour/${selectedTour}`);
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <>
        <Helmet> <title>Chi tiết tour</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '99.6%' }} ref={pageTopRef}>
      <Helmet>
        <title>{tour.tourName}</title>
      </Helmet>
      <Header />
      <Box sx={{ p: 3, flexGrow: 1, mt: 4 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', textAlign: 'left', mb: 3 }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link>&gt;
          <Link to="/tour-du-lich" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Tour du lịch</Link>&gt;
          <strong> {tour.tourName}</strong>
        </Typography>
        <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
          Từ {tour.startingProvince} đi {tour.provinces.map(province => province.name).join(' - ')}
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {tour.tourName}
        </Typography>
        <MediaShare tourName={tour.tourName} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
              <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                <img src={tour.imageUrls[0]?.url?.replace('w_1000', 'w_2000') || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tour.tourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
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
                <AccessTimeFilledIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Thời lượng:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tour.duration}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <CategoryIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Loại tour:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tour.tourCategoryName}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                {tour.transportation === 'Máy bay' && (<FlightIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                {tour.transportation === 'Tàu hỏa' && (<DirectionsTransitIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                {tour.transportation === 'Xe du lịch' && (<DirectionsCarFilledIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Phương tiện:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tour.transportation}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              <div dangerouslySetInnerHTML={{ __html: tour.description }} />
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tour.schedule.map((s, index, array) => (
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
              <Box dangerouslySetInnerHTML={{ __html: tour.note }} sx={{ '& p': { lineHeight: 1.2, mt: 0, textAlign: 'justify' } }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px', boxShadow: '1px 1px 10px grey' }}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#5d5d5d', fontSize: '1.1rem' }}> Chọn ngày đi </Typography>
                <FormControl fullWidth sx={{ mb: 2, mt: 1.5 }}>
                  <InputLabel id="month-select-label">Chọn tháng</InputLabel>
                  <Select labelId="month-select-label" id="month-select" value={selectedMonth}
                    label="Chọn tháng" onChange={handleMonthChange} inputRef={monthSelectRef} >
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
                      <Select labelId="tour-select-label" id="tour-select" value={selectedTour} label="Chọn ngày đi" onChange={handleTourChange} inputRef={tourSelectRef}>
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
              <Typography sx={{ fontWeight: 700, color: '#05073C', fontSize: '1.7rem', marginBottom: '10px', textAlign: 'center' }}> Thông tin tour </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'flex-start' }}>
                <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF' }} />
                Mã tour:
                <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700, fontSize: '1.1rem' }}>{tour.code}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '10px', color: '#3572EF', marginTop: '3px' }} />
                <Typography sx={{ color: '#05073C' }}>Khởi hành từ: {availableTours.find(t => t.id === selectedTour)?.startLocation || ''}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>
                  Khởi hành ngày: {availableTours.find(t => t.id === selectedTour)?.startDate ? new Date(availableTours.find(t => t.id === selectedTour).startDate).toLocaleDateString('vi-VN') : ''} {' '}
                  {availableTours.find(t => t.id === selectedTour)?.startTime ? new Date(`1970-01-01T${availableTours.find(t => t.id === selectedTour).startTime}`).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>
                  Kết thúc ngày: {
                    (() => {
                      const selectedTourData = availableTours.find(t => t.id === selectedTour);
                      if (selectedTourData) {
                        const endDate = new Date(selectedTourData.startDate.getTime() + ((tour.numberOfDay - 1) * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN');
                        return endDate ? endDate : '';
                      }
                      return '';
                    })()
                  }
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Giá:</Typography>
                <Typography sx={{ ml: 1, color: 'red', fontWeight: 700, fontSize: '1.5rem' }}>
                  {selectedTour ?
                    formatPrice(availableTours.find(t => t.id === selectedTour)?.price || 0) :
                    `Chỉ từ ${formatPrice(getMinTourPrice())}`
                  }
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#05073C', mb: 1 }}>Chính sách thanh toán:</Typography>
                {availableTours.find(t => t.id === selectedTour)?.depositPercent === 100 ? (
                  <Typography sx={{ color: '#05073C', mb: 0.5 }}>• Thanh toán 100% giá tour khi đăng ký</Typography>
                ) : (
                  <>
                    <Typography sx={{ color: '#05073C', mb: 0.5 }}>• Đặt cọc {(availableTours.find(t => t.id === selectedTour)?.depositPercent || 0)}% số tiền tour khi đăng ký</Typography>
                    <Typography sx={{ color: '#05073C' }}>• Thanh toán số tiền còn lại trước {availableTours.find(t => t.id === selectedTour)?.paymentDeadline ? new Date(availableTours.find(t => t.id === selectedTour).paymentDeadline).toLocaleDateString('vi-VN') : ''} {' '}</Typography>
                  </>
                )}
              </Box>
              <Divider />
              <Box sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#05073C', mb: 1 }}>Chính sách hủy tour:</Typography>

                {availableTours.find(t => t.id === selectedTour)?.refundPolicies?.length > 0 ? (
                  <>
                    {availableTours.find(t => t.id === selectedTour)?.refundPolicies
                      .sort((a, b) => new Date(a.cancelBefore) - new Date(b.cancelBefore))
                      .map((policy, index) => {
                        return (
                          <Typography key={index} sx={{ color: '#05073C', mb: 0.5 }}>
                            • Hủy trước {new Date(policy.cancelBefore).toLocaleDateString('vi-VN')}:
                            Chi phí hủy tour là {policy.refundPercent}% tổng giá trị booking
                          </Typography>
                        );
                      })}
                    <Typography sx={{ color: '#05073C', mb: 0.5 }}>
                      • Hủy từ ngày {new Date(availableTours.find(t => t.id === selectedTour)?.refundPolicies[availableTours.find(t => t.id === selectedTour)?.refundPolicies.length - 1]?.cancelBefore).toLocaleDateString('vi-VN')}:
                      Chi phí hủy tour là 100% tổng giá trị booking
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ color: '#05073C', mb: 0.5 }}>
                    Tour này không hỗ trợ hoàn tiền khi khách hàng hủy tour
                  </Typography>
                )}
                <Typography color="error" sx={{ mt: 1, fontSize: '0.9rem' }}>
                  Lưu ý: Trong trường hợp Vietway hủy tour, bạn sẽ được hoàn tiền đầy đủ.
                </Typography>
              </Box>
              <Button onClick={handleBooking} variant="contained" fullWidth sx={{ mb: 2, height: '45px' }}>Đặt tour</Button>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: '10px' }} />
                <Typography>Tư vấn: 1900 1234</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>
            Đánh giá từ khách hàng
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <ReviewListTour tourTemplateId={tour.tourTemplateId} />
            </Grid>
          </Grid>
        </Box>
        <OtherTours pros={tour.provinces.map(province => province.provinceId.toString())} tourId={tour.tourTemplateId} />
      </Box>
      <Footer />
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} variant="filled" severity="error" sx={{ width: '100%', mt: 10, bgcolor: 'rgba(0, 0, 0, 0.8)', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', '& .MuiSvgIcon-root': { color: 'white' }, fontSize: '0.95rem', py: 1.5 }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TourDetails;
