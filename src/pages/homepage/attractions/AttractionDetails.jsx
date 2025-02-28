import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from '@layouts/Header';
import OtherAttractions from '@components/attractions/OtherAttractions';
import Footer from '@layouts/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getAttractionById, likeAttraction } from '@services/AttractionService';
import ReviewList from '@components/reviews/ReviewList';
import { Typography, Grid, Paper, Box, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import MediaShare from '@components/posts/MediaShare';
import { fetchPlaceDetails } from '@services/GooglePlaceService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CircularProgress } from '@mui/material';
import UnsavedConfirmPopup from '@components/saved/UnsavedConfirmPopup';
import ToursVisitAttractionCol from '@components/attractions/ToursVisitAttractionCol';
import Map from '@components/Map';
import { getCookie } from '@services/AuthenService';

const AttractionDetails = () => {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [openingHours, setOpeningHours] = useState(null);
  const [openUnsaveDialog, setOpenUnsaveDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const [isApiError, setIsApiError] = useState(false);

  useEffect(() => {
    fetchAttractionData();
  }, [id]);

  const fetchAttractionData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      const response = await getAttractionById(id, site);
      setIsSaved(response.isLiked);
      setAttraction(response);

    } catch (error) {
      console.error("Error fetching attraction data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [attraction]);

  useEffect(() => {
    const getPlaceDetails = async () => {
      if (attraction?.googlePlaceId) {
        try {
          const hours = await fetchPlaceDetails(attraction.googlePlaceId);
          console.log(hours);
          setOpeningHours(hours);
        } catch (error) {
          console.error('Error fetching opening hours:', error);
        }
      }
    };

    getPlaceDetails();
  }, [attraction?.googlePlaceId]);

  const settings = {
    dots: true,
    dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    className: 'attraction-slider',
    afterChange: (current) => setCurrentSlide(current)
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    if (sliderRef) {
      sliderRef.slickGoTo(index);
    }
  };

  const handleLikeClick = async () => {
    const customerToken = getCookie('customerToken');
    if (!customerToken) {
      setIsApiError(true);
      setNotificationMessage('Vui lòng đăng nhập để lưu điểm tham quan');
      setShowNotification(true);
      return;
    }

    try {
      if (isSaved) {
        setOpenUnsaveDialog(true);
        return;
      }

      await likeAttraction(attraction.attractionId, true);
      setIsSaved(true);
      setNotificationMessage('Đã lưu vào lưu trữ của bạn');
      setShowNotification(true);
      setSavedCount(prev => prev + 1);
      setIsApiError(false);
    } catch (error) {
      console.error('Error liking attraction:', error);
      setIsApiError(true);
      setNotificationMessage('Không thể lưu điểm tham quan. Vui lòng thử lại sau');
      setShowNotification(true);
    }
  };

  const handleConfirmUnsave = async () => {
    try {
      await likeAttraction(attraction.attractionId, false);
      setIsSaved(false);
      setSavedCount(prev => prev - 1);
      setOpenUnsaveDialog(false);
      setNotificationMessage('Đã xóa khỏi lưu trữ của bạn');
      setShowNotification(true);
      setIsApiError(false);
    } catch (error) {
      console.error('Error handling unsave:', error);
      setIsApiError(true);
      setNotificationMessage('Không thể xóa điểm tham quan. Vui lòng thử lại sau');
      setShowNotification(true);
    }
  };

  const handleCloseUnsaveDialog = () => {
    setOpenUnsaveDialog(false);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  const handleNotificationClick = () => {
    setIsSavedTabOpen(true);
    setShowNotification(false);
  };

  const handleOpenStorage = () => {
    navigate('/luu-tru');
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Chi tiết điểm tham quan</title>
        </Helmet>
        <Header />
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}
        >
          <CircularProgress size={50} thickness={4} color="primary" />
        </Box>
      </>
    );
  }

  if (!attraction) {
    return (
      <>
        <Header />
        <Helmet>
          <title>Không tìm thấy điểm tham quan</title>
        </Helmet>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Không tìm thấy thông tin điểm tham quan</Typography>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '99.6%' }} ref={pageTopRef}>
      <Helmet>
        <title>{attraction.name}</title>
      </Helmet>
      <Header />
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', marginBottom: '10px', textAlign: 'left', ml: -0.5 }}>
          <a href="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</a>
          &gt;
          <a href="/diem-tham-quan" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Điểm tham quan</a>
          &gt; <strong>{attraction.name}</strong>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'gray', fontSize: '1.2rem' }}>
            {attraction.attractionTypeName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
            {attraction.name}
          </Typography>

          <Button
            variant="outlined"
            onClick={handleLikeClick}
            startIcon={isSaved ?
              <FavoriteIcon sx={{ color: 'red' }} /> :
              <FavoriteBorderIcon />
            }
            sx={{
              mb: 2,
              borderRadius: '8px',
              textTransform: 'none',
              color: isSaved ? 'red' : 'inherit',
              borderColor: isSaved ? 'red' : 'inherit',
              '&:hover': {
                borderColor: isSaved ? 'red' : 'inherit',
              }
            }}
          >
            Lưu
          </Button>
        </Box>
        <MediaShare attractionName={attraction.name} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
              <Box className="slick-slider-container" sx={{ height: '450px' }}>
                <Slider ref={setSliderRef} {...settings}>
                  {attraction.images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={image.url?.replace('w_1000', 'w_2000')}
                        alt={`Attraction ${index + 1}`}
                        style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </Slider>
              </Box>
            </Paper>
            <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3 }}>
              {attraction.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{ width: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: currentSlide === index ? '2px solid #3572EF' : 'none', position: 'relative' }}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.url?.replace('w_1000', 'w_200')}
                    alt={`Thumbnail ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin chi tiết</Typography>
              <div dangerouslySetInnerHTML={{ __html: attraction.description }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px', mb: 2 }}>Thông tin liên hệ</Typography>
              {attraction.address && (
                <Typography sx={{ mb: 3 }}><strong>Địa chỉ: </strong> {attraction.address}</Typography>
              )}
              {attraction.website && (
                <>
                  <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website: </Typography>
                  <Box sx={{ mb: 3 }}>
                    <a href={attraction.website} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                      {attraction.website}
                    </a>
                  </Box>
                </>
              )}

              {attraction.contactInfo && (
                <>
                  <Typography sx={{ mb: -1 }}><strong>Các thông tin liên hệ khác: </strong></Typography>
                  <div dangerouslySetInnerHTML={{ __html: attraction.contactInfo }} />
                </>
              )}
              {(attraction.googlePlaceId && openingHours?.opening_hours) && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h4" sx={{
                    fontWeight: '700',
                    fontFamily: 'Inter, sans-serif',
                    color: '#05073C',
                    fontSize: '27px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    Giờ mở cửa
                  </Typography>

                  {loading ? (
                    <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
                  ) : openingHours ? (
                    <>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        color: openingHours.opening_hours?.open_now ? 'success.main' : 'error.main'
                      }}>
                        {openingHours.opening_hours ? (
                          <>
                            {openingHours.opening_hours?.open_now === true ? (
                              <><CheckCircleIcon /> <Typography>Đang mở cửa</Typography></>
                            ) : (
                              <><CancelIcon /> <Typography>Đã đóng cửa</Typography></>
                            )}
                          </>
                        ) : (
                          <Typography>Không có thông tin giờ mở cửa</Typography>
                        )}
                      </Box>
                      {openingHours.opening_hours && (
                        <Paper elevation={3} sx={{ pl: 4, pr: 4, pt: 2, pb: 2, mb: 3, borderRadius: '10px' }}>
                          <Box>
                            {openingHours.opening_hours?.periods?.map((period, index) => {
                              const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                              const openTime = period.open.time.replace(/(\d{2})(\d{2})/, '$1:$2');
                              const closeTime = period.close.time.replace(/(\d{2})(\d{2})/, '$1:$2');

                              return (
                                <Typography key={index} sx={{
                                  py: 1,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  borderBottom: '1px solid #eee',
                                  '&:last-child': { borderBottom: 'none' }
                                }}>
                                  <span style={{ fontWeight: period.open.day === new Date().getDay() ? 700 : 400 }}>
                                    {days[period.open.day]}
                                  </span>
                                  <span>{openTime} - {closeTime}</span>
                                </Typography>
                              );
                            })}
                          </Box>
                        </Paper>
                      )}
                    </>
                  ) : (
                    <Typography sx={{ mt: 2 }}>Không có thông tin giờ mở cửa</Typography>
                  )}
                </Box>
              )}
            </Paper>
            <ToursVisitAttractionCol />
          </Grid>
          {attraction.googlePlaceId && (
            <Grid item xs={12} md={12}>
              <Box sx={{ width: '100%', height: '82vh', mb: 10, borderRadius: '10px', overflow: 'hidden' }}>
                <Map placeId={attraction.googlePlaceId} />
              </Box>
            </Grid>
          )}
        </Grid>

        <Box sx={{ my: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>
            Đánh giá
          </Typography>

          <Box sx={{ mt: 3 }}>
            <ReviewList attractionId={attraction.attractionId} />
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          <OtherAttractions provinceId={attraction.provinceId} attractionId={attraction.attractionId} />
        </Box>
      </Box>
      <Footer />

      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          '& .MuiPaper-root': {
            minWidth: '300px'
          }
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={isApiError ? "error" : "success"}
          sx={{
            width: '100%', mt: 10,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': {
              color: isApiError ? '#f44336' : '#4caf50'
            },
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            fontSize: '0.95rem',
            py: 1.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {notificationMessage} {!isApiError && getCookie('customerToken') && (
              <> -
                <Box
                  component="span"
                  onClick={handleOpenStorage}
                  sx={{
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  Mở lưu trữ
                </Box>
              </>
            )}
          </Box>
        </Alert>
      </Snackbar>

      <UnsavedConfirmPopup
        open={openUnsaveDialog}
        onClose={handleCloseUnsaveDialog}
        onConfirm={handleConfirmUnsave}
      />
    </Box>
  );
};

export default AttractionDetails;
