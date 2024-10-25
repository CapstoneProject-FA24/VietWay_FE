import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Container, Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AttractionCard from '@components/provinces/AttractionCard';
import ImageGallery from '@components/provinces/ImageGallery';
import CategoryFilter from '@components/provinces/CategoryFilter';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import PostCard from '@components/provinces/PostCard';
import { Link } from 'react-router-dom';
import EventCard from '@components/provinces/EventCard';
import { fetchProvinceInfo } from '@services/ProvinceService';
import { fetchAttractions } from '@services/AttractionService';
import { fetchEvents } from '@services/EventService';
import { fetchPosts } from '@services/PostService';

const ProvinceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use navigate hook
  const [province, setProvince] = useState();
  const [attractions, setAttractions] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]); // New state for posts

  const highlightCategories = ['Tất cả', 'Bảo tàng', 'Công viên', 'Di tích lịch sử', 'Công trình tôn giáo', 'Khu bảo tồn thiên nhiên'];
  const eventCategories = ['Tất cả', 'Đang diễn ra', 'Sắp đến'];
  const discoverCategories = ['Tất cả', 'Văn hóa', 'Ẩm thực', 'Hoạt động', 'Nơi lưu trú'];

  const [highlightsCategory, setHighlightsCategory] = useState('Tất cả');
  const [eventsCategory, setEventsCategory] = useState('Tất cả');
  const [discoverCategory, setDiscoverCategory] = useState('Tất cả');

  useEffect(() => {
    loadProvince();
    loadAttractions();
    loadEvents();
    loadPosts(); // Load posts
  }, [id]);

  const loadProvince = async () => {
    try {
      const response = await fetchProvinceInfo(id);
      setProvince(response);
    } catch (error) {
      console.error('Failed to fetch province info:', error);
    }
  };

  const loadAttractions = async () => {
    try {
      const params = {
        pageSize: 6,
        pageIndex: 1,
        provinceIds: [id]
      };
      const response = await fetchAttractions(params);
      setAttractions(response.data);
    } catch (error) {
      console.error('Failed to fetch attractions:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const params = {
        pageSize: 6,
        pageIndex: 1,
        provinceIds: [id]
      };
      const response = await fetchEvents(params);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const params = {
        pageSize: 6,
        pageIndex: 1,
        provinceIds: [id]
      };
      const response = await fetchPosts(params);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const renderAttractionCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    if (data.length > 0) {
      return data.slice(0, 6).map((attraction, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}><AttractionCard attraction={attraction} /></Grid>
      ));
    } else {
      return (
        <Typography gutterBottom sx={{ mt: 1, textAlign: 'center', width: '100%', color: 'grey', fontStyle: 'italic' }}> Chưa có điểm tham quan nào. </Typography>
      )
    }
  };

  const renderEventCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    if (data.length > 0) {
      return data.slice(0, 6).map((event, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}> <EventCard event={event} /> </Grid>
      ));
    } else {
      return (
        <Typography gutterBottom sx={{ mt: 1, textAlign: 'center', width: '100%', color: 'grey', fontStyle: 'italic' }}> Chưa có sự kiện nào. </Typography>
      )
    }
  };

  const renderPostCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    console.log(data.length);
    if (data.length > 0) {
      return data.slice(0, 6).map((post, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}> <PostCard post={post} /> </Grid>
      ));
    } else {
      return (
        <Typography gutterBottom sx={{ mt: 1, textAlign: 'center', width: '100%', color: 'grey', fontStyle: 'italic' }}> Chưa có bài viết nào. </Typography>
      )
    }
  };

  const handleEventCategoryChange = (category) => {
    console.log('Selected category:', category);
    setEventsCategory(category);
    if (category !== 'Tất cả') {
      setEvents(events.filter(event => event.eventCategory === category));
    }
  };

  const handleViewMoreAttractions = () => {
    const searchParams = new URLSearchParams({
      provinceId: province.provinceId,
      applySearch: 'true'
    }).toString();
    navigate(`/diem-tham-quan?${searchParams}`);
  };

  return (
    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '90vw' }}>
      <Header />
      {province && (
        <Box sx={{ ml: 5, mr: 5 }}>
          <ImageGallery images={province.imageUrls} />
          <Container maxWidth="xl" sx={{ mt: 5 }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
              {province.provinceName}
            </Typography>
            <Typography variant="body1" paragraph>
              Miêu tả về {province.provinceName}
            </Typography>
            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                Điểm đến nổi bật
              </Typography>
              <Box display="flex" alignItems="center" onClick={handleViewMoreAttractions} sx={{ cursor: 'pointer' }}>
                <Typography variant="body2" sx={{ color: 'grey', fontSize: '1rem' }}>
                  Xem thêm
                </Typography>
                <ChevronRightIcon sx={{ ml: 1, color: 'grey' }} />
              </Box>
            </Box>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={highlightCategories}
                selectedCategory={highlightsCategory}
                onCategoryChange={setHighlightsCategory} />
            </Box>
            <Grid container spacing={2}>
              {renderAttractionCards(attractions)}
            </Grid>
            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                Sự kiện hấp dẫn
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" component={Link} to={`/su-kien`} sx={{ color: 'grey', fontSize: '1rem' }}>
                  Xem thêm
                </Typography>
                <ChevronRightIcon sx={{ ml: 1, color: 'grey' }} />
              </Box>
            </Box>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={eventCategories}
                selectedCategory={eventsCategory}
                onCategoryChange={handleEventCategoryChange}
              />
            </Box>
            <Grid container spacing={2}>
              {renderEventCards(events)}
            </Grid>
            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                Khám phá {province.provinceName} qua các bài viết
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" component={Link} to={`/bai-viet`} sx={{ color: 'grey', fontSize: '1rem' }}>
                  Xem thêm
                </Typography>
                <ChevronRightIcon sx={{ ml: 1, color: 'grey' }} />
              </Box>
            </Box>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={discoverCategories}
                selectedCategory={discoverCategory}
                onCategoryChange={setDiscoverCategory}
              />
            </Box>
            <Grid container spacing={2}>
              {renderPostCards(posts)}
            </Grid>
          </Container>
        </Box>
      )}
      <Footer />
    </Box>
  );
};

export default ProvinceDetail;
