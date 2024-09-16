import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from '../../../layouts/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import OtherAttractions from '../../../components/OtherAttractions';
import Footer from '../../../layouts/Footer';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getAttractionById } from '../../../hooks/MockAttractions';
import ToursVisitAttraction from '../../../components/ToursVisitAttraction';


const AttractionDetails = () => {
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const { id } = useParams();
  const pageTopRef = useRef(null);

  useEffect(() => {
    const fetchAttractionData = async () => {
      try {
        setLoading(true);
        // Simulating API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = getAttractionById(id);
        console.log("a: "+mockData);
        setAttraction(mockData);
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
          <CircularProgress />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
      <Helmet>
          <title>{attraction.name}</title>
        </Helmet>
      <Header/>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', marginBottom: '10px', textAlign: 'left' }}>
          <a href="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</a> 
          &gt; 
          <a href="/diem-tham-quan" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Điểm tham quan</a> 
          &gt; <strong>{attraction.name}</strong>
        </Typography>
        <ToursVisitAttraction/>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {attraction.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '-16px', marginBottom: '16px' }}>
          <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', marginRight: '8px', marginTop: '-4px' }} />
          <Typography variant="body1" sx={{ fontWeight: '500', fontFamily: 'Inter, sans-serif', color: '#05073C', fontSize: '17px' }}>
            {attraction.rating.rate} ({attraction.rating.vote})
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
              <Box className="slick-slider" sx={{ height: '450px' }}>
                <Slider ref={slider => setSliderRef(slider)} {...settings}>
                  {attraction.images.map((image, index) => (
                    <div key={index}>
                      <img src={image.url} alt={image.alt} style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover' }} />
                    </div>
                  ))}
                </Slider>
              </Box>
            </Paper>
            <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3 }}>
              {attraction.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 110,
                    height: 110,
                    flexShrink: 0,
                    mr: 3,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: currentSlide === index ? '2px solid #3572EF' : 'none'
                  }}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem' }}>Giới thiệu</Typography>
              <Typography paragraph sx={{ textAlign: 'justify' }}>{attraction.introduction}</Typography>
            </Box>
            {attraction.contact && (
              <Box sx={{ mb: 3, ml: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', fontWeight: '700' }}>Thông tin liên hệ</Typography>
                {attraction.contact.address && <Typography sx={{ textAlign: 'left' }}>Địa chỉ: {attraction.contact.address}</Typography>}
                {attraction.contact.phone && <Typography sx={{ textAlign: 'left' }}>Số điện thoại: {attraction.contact.phone}</Typography>}
                {attraction.contact.email && <Typography sx={{ textAlign: 'left' }}>Email: {attraction.contact.email}</Typography>}
                {attraction.contact.website && <Typography sx={{ textAlign: 'left' }}>Website: <a href={attraction.contact.website} target="_blank" rel="noopener noreferrer">{attraction.contact.website}</a></Typography>}
              </Box>
            )}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem' }}>Tổng quan</Typography>
              <Typography paragraph sx={{ textAlign: 'justify' }}>{attraction.generalInfo}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem' }}>Lịch sử</Typography>
              {attraction.history.map((item) => (
                <Box key={item.order} sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ textAlign: 'justify' }}>{item.content}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, pl: 5.5, pr: 5.5, borderRadius: '10px', ml: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Giờ mở cửa</Typography>
              <TableContainer sx={{ border: '1px solid #D9D9D9', borderRadius: '10px', marginTop: '10px', marginBottom: '10px' }}>
                <Table>
                  <TableBody>
                    {attraction.openingHours.map((row) => (
                      <TableRow key={row.day}>
                        <TableCell component="th" scope="row" align="center">
                          {row.day}
                        </TableCell>
                        <TableCell align="center">{`${row.openTime} - ${row.closeTime}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper elevation={3} sx={{ p: 4, pl: 5.5, pr: 5.5, borderRadius: '10px', ml: 2  }}>
              <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Giá vé</Typography>
              <TableContainer sx={{ border: '1px solid #D9D9D9', borderRadius: '10px', marginTop: '10px', marginBottom: '10px' }}>
                <Table>
                  <TableBody>
                    {attraction.ticketPrices.map((row) => (
                      <TableRow key={row.type}>
                        <TableCell component="th" scope="row" align="center">
                          {row.type}
                        </TableCell>
                        <TableCell align="center">{row.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        <OtherAttractions />
      </Box>
      <Footer />
    </Box>
  );
};

export default AttractionDetails;
