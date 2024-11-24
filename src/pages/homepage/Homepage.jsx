import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faClock, faMoneyBill1, faCalendar, faSun } from '@fortawesome/free-regular-svg-icons';
import { Box, Container, Grid, Typography, Paper, Button, CircularProgress, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import axios from 'axios';
import '@styles/Homepage.css';
import Footer from '@layouts/Footer';
import Header from '@layouts/Header';
import SuggestAttractionByProvinces from '@components/homepage/SuggestAttractionByProvinces';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import SuggestTours from '@components/homepage/SuggestTours'
import SuggestProvinces from '@components/homepage/SuggestProvinces';
import FilterBar from '@components/homepage/FilterBar';
import { Helmet } from 'react-helmet';
import Map from '@components/Map';
import ChatBoxPopup from '@layouts/ChatBoxPopup';

const Homepage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '80vh' }}>
        <img src="/loading.gif" alt="Loading..." />
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: 'slider-homepage',
    autoplay: true,
  };

  return (
    <Box className="homepage" sx={{ display: 'flex', flexDirection: 'column', width: '99.6%' }}>
      <Helmet> <title>Trang chủ</title> </Helmet>
      <Header />
      <ChatBoxPopup/>
      <Box component="header" className="hero" sx={{ ml: "-60px", mr: "-65px", mt: -7.5, mb: 10 }} >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1 }} />
        <Slider {...sliderSettings}>
          <img src="hero.jpg" alt="Hero 1" className="hero-image" />
          <img src="vung_tau.jpg" alt="Hero 2" className="hero-image" />
          <img src="https://static-images.vnncdn.net/files/publish/2023/9/1/cau-vang-nag-tran-tuan-viet-3-211.jpg" alt="Hero 3" className="hero-image" />
          <img src="https://honthom.sunworld.vn/wp-content/uploads/2020/07/shutterstock_1662998491-720x270.jpg" alt="Hero 4" className="hero-image" />
          <img src="https://media.tacdn.com/media/attractions-content--1x-1/12/19/ce/12.jpg" alt="Hero 5" className="hero-image" />
        </Slider>
        <Box className="hero-text" sx={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', zIndex: 2 }}>
          <Typography variant="h1" sx={{ fontSize: '4.7rem', mb: 2, color: 'white' }}>Niềm vui quanh ta</Typography>
          <Typography variant="h7" sx={{ width: "40%", color: 'white' }}>Từ những chuyến đi gần đến những cuộc phiêu lưu xa xôi, hãy tìm thấy điều làm bạn hạnh phúc mỗi lúc, mọi nơi</Typography>
          <img src="homepage-wave.png" alt="Wave" style={{ width: "100%", bottom: 0, left: 0, position: "absolute" }} />
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', left: '50vw', transform: 'translateX(-50%)', zIndex: 5, top: 450, width: '60rem' }}>
        <FilterBar />
      </Box>
      <Box>
        <Box component="section" className="why-choose-us">
          <Typography variant="h4" className="section-title" sx={{ mb: 5, fontWeight: 'bold', fontSize: '2rem', marginBottom: '2rem' }}>
            Tại sao nên tin dùng Vietway Tour
          </Typography>
          <Box className="feature-cards">
            <Box className="feature-card">
              <img src="icon/linh-hoat.png" alt="Linh hoạt" className="feature-icon" />
              <Typography variant="h6" className="feature-title" sx={{ fontWeight: 'bold' }}>Linh hoạt</Typography>
              <Typography className="feature-description" sx={{ margin: "1rem 0.5rem 0 0", lineHeight: 1.8 }}>
                Bạn có thể tùy ý hủy hoàn toàn miễn phí và thanh toán bất kì lúc nào để đáp ứng bất kỳ kế hoạch hoặc ngân sách nào của bạn.
              </Typography>
            </Box>
            <Box className="feature-card">
              <img src="icon/trai-nghiem.png" alt="Trải nghiệm tuyệt vời" className="feature-icon" />
              <Typography variant="h6" className="feature-title" sx={{ fontWeight: 'bold' }}>Trải nghiệm tuyệt vời</Typography>
              <Typography className="feature-description" sx={{ margin: "1rem 0.5rem 0 0", lineHeight: 1.8 }}>
                Tìm kiếm các địa điểm tham quan và tour một cách dễ dàng với đầy đủ thông tin
              </Typography>
            </Box>
            <Box className="feature-card">
              <img src="icon/dich-vu.png" alt="Dịch vụ chất lượng cao" className="feature-icon" />
              <Typography variant="h6" className="feature-title" sx={{ fontWeight: 'bold' }}>Dịch vụ chất lượng cao</Typography>
              <Typography className="feature-description" sx={{ margin: "1rem 0.5rem 0 0", lineHeight: 1.8 }}>
                Dịch vụ chất lượng và đáng tin cậy với hàng chục lượt đánh giá sau hơn 3 tháng hoạt động.
              </Typography>
            </Box>
            <Box className="feature-card">
              <img src="icon/ho-tro.png" alt="Hỗ trợ nhiệt tình" className="feature-icon" />
              <Typography variant="h6" className="feature-title" sx={{ fontWeight: 'bold' }}>Hỗ trợ nhiệt tình</Typography>
              <Typography className="feature-description" sx={{ margin: "1rem 0.5rem 0 0", lineHeight: 1.8 }}>
                Thắc mắc về giá cả? Quy trình đặt tour quá rắc rối? Muốn được tư vấn thêm về các tour du lịch? Hãy liên hệ chúng tôi!
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box component="section" className="destinations">
          <Box className="section-header">
            <Typography variant="h4" className="section-title" sx={{ mb: 2, fontWeight: 'bold', fontSize: '2rem' }}>Khám phá các điểm tham quan</Typography>
            <Button component={Link} to="/diem-tham-quan" className="view-all-button" sx={{ mb: '1.5rem' }}>Xem tất cả</Button>
          </Box>
          <SuggestAttractionByProvinces />
        </Box>

        <Box component="section" className="popular-tours">
          <Box className="section-header">
            <Typography variant="h4" className="section-title" sx={{ fontWeight: 'bold', fontSize: '2rem', mb: '2rem' }}>Tour Nổi Tiếng</Typography>
            <Button component={Link} to={"/tour-du-lich"} className="view-all-button" sx={{ mb: '1.5rem' }}>Xem tất cả</Button>
          </Box>
          <SuggestTours />
        </Box>

        <Box component="section" className="featured-destinations">
          <Box className="section-header">
            <Typography variant="h4" className="section-title" sx={{ fontWeight: 'bold', fontSize: '2rem', mb: '1rem' }}>Tìm kiếm các điểm tham quan gần bạn</Typography>
          </Box>
          <Box sx={{ width: '100%', height: '82vh', mb: 10, borderRadius: '10px', overflow: 'hidden' }}>
            <Map />
          </Box>
          <Box className="section-header">
            <Typography variant="h4" className="section-title" sx={{ fontWeight: 'bold', fontSize: '2rem', mb: '1rem' }}>Điểm đến yêu thích</Typography>
            <Button component={Link} to={"/tinh-thanh"} className="view-all-button" sx={{ mb: '1rem' }}>Xem tất cả</Button>
          </Box>
          <SuggestProvinces />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Homepage;
