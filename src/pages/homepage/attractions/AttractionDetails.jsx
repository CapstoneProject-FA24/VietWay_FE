import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from '@layouts/Header';
import OtherAttractions from '@components/attractions/OtherAttractions';
import Footer from '@layouts/Footer';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ToursVisitAttraction from '@components/attractions/ToursVisitAttraction';
import { getAttractionById } from '@services/AttractionService';
import ReviewList from '@components/reviews/ReviewList';
import ReviewInput from '@components/reviews/ReviewInput';
import { mockReviews } from '@hooks/MockReviews';
import ReviewBreakdown from '@components/reviews/ReviewBreakdown';
import { Typography, Grid, Paper, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const AttractionDetails = () => {
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, content: '' });

  useEffect(() => {
    const fetchAttractionData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await getAttractionById(id);
        setAttraction(response);
      } catch (error) {
        console.error("Error fetching attraction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractionData();
  }, [id]);

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [attraction]);

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

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Chi tiết điểm tham quan</title>
        </Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src="/loading.gif" alt="Loading..." />
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

  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
  const ratings = [0, 0, 0, 0, 0];
  mockReviews.forEach(review => {
    ratings[5 - review.rating]++;
  });

  const handleToggleReviewInput = () => {
    if (showReviewInput && (reviewData.rating > 0 || reviewData.content.trim() !== '')) {
      setOpenConfirmDialog(true);
    } else {
      setShowReviewInput(!showReviewInput);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmClose = () => {
    setShowReviewInput(false);
    setReviewData({ rating: 0, content: '' });
    setOpenConfirmDialog(false);
  };

  const handleReviewDataChange = (data) => {
    setReviewData(data);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
      <Helmet>
        <title>{attraction.name}</title>
      </Helmet>
      <Header />
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', marginBottom: '10px', textAlign: 'left' }}>
          <a href="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</a>
          &gt;
          <a href="/diem-tham-quan" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Điểm tham quan</a>
          &gt; <strong>{attraction.name}</strong>
        </Typography>
        <ToursVisitAttraction />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'gray', fontSize: '1.2rem' }}>
            {attraction.attractionTypeName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
            {attraction.name}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
              <Box className="slick-slider-container" sx={{ height: '450px' }}>
                <Slider ref={setSliderRef} {...settings}>
                  {attraction.images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={image.url}
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
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin</Typography>
              <div dangerouslySetInnerHTML={{ __html: attraction.description }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Địa chỉ: </Typography>
              <Typography sx={{ mb: 3 }}>{attraction.address}</Typography>

              <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website: </Typography>
              <Box sx={{ mb: 3 }}>
                <a href={attraction.website} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                  {attraction.website}
                </a>
              </Box>

              <Typography variant="h4" sx={{ mt: 4, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin liên hệ</Typography>
              <div dangerouslySetInnerHTML={{ __html: attraction.contactInfo }} />
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>
            Đánh giá
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <ReviewBreakdown 
                ratings={ratings}
                totalReviews={totalReviews}
                averageRating={averageRating}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleToggleReviewInput}
                sx={{ mb: 2 }}
              >
                {showReviewInput ? 'Đóng đánh giá' : 'Thêm đánh giá'}
              </Button>
              
              {showReviewInput && (
                <Box sx={{ mb: 3 }}>
                  <ReviewInput onDataChange={handleReviewDataChange} />
                </Box>
              )}
              
              <Box sx={{ mt: 3 }}>
                <ReviewList reviews={mockReviews} />
              </Box>

              <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Xác nhận đóng đánh giá"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Bạn có chắc muốn đóng review này?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseConfirmDialog}>Hủy</Button>
                  <Button onClick={handleConfirmClose} autoFocus>
                    Đồng ý
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ width: '100%' }}>
          <OtherAttractions provinceId={attraction.provinceId} attractionId={attraction.attractionId} />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AttractionDetails;
