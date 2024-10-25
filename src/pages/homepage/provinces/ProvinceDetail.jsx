import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Container, Box } from '@mui/material';
import ProvincePagesCard from '@components/provinces/ProvincePagesCard';
import ImageGallery from '@components/provinces/ImageGallery';
import CategoryFilter from '@components/provinces/CategoryFilter';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { PostsGrid } from '@components/provinces/PostsCard';
import { Link } from 'react-router-dom';
import { mockProvinceData } from '@hooks/MockProvincePage';
import { mockEvents } from '@hooks/MockEvent';
import EventCard from '@components/provinces/EventCard';
import { fetchProvinceInfo } from '@services/ProvinceService';
import { fetchAttractions } from '@services/AttractionService';
import { fetchEvents } from '@services/EventService';

const ProvinceDetail = () => {
  const { id } = useParams();
  const [provinceData, setProvinceData] = useState(null);
  const [province, setProvince] = useState();
  const [attractions, setAttractions] = useState([]);
  const [events, setEvents] = useState([]);

  const highlightCategories = ['Tất cả', 'Bảo tàng', 'Công viên', 'Di tích lịch sử', 'Công trình tôn giáo', 'Khu bảo tồn thiên nhiên'];
  const eventCategories = ['Tất cả', 'Đang diễn ra', 'Sắp đến'];
  const discoverCategories = ['Tất cả', 'Văn hóa', 'Ẩm thực', 'Hoạt động', 'Nơi lưu trú'];

  const [highlightsCategory, setHighlightsCategory] = useState('Tất cả');
  const [eventsCategory, setEventsCategory] = useState('Tất cả');
  const [discoverCategory, setDiscoverCategory] = useState('Tất cả');

  const [discoverPosts, setDiscoverPosts] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    loadProvince();
    loadAttractions();
    loadEvents();
    const pro = mockProvinceData.find(p => p.id === parseInt(id));
    if (pro) {
      setProvinceData(pro);
      setDiscoverPosts(pro.discover);
      setFilteredEvents(events);
    }
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
      console.error('Failed to fetch province info:', error);
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
      console.error('Failed to fetch province info:', error);
    }
  };

  const renderAttractionCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    return data.slice(0, 6).map((attraction, index) => (
      <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
        <ProvincePagesCard attraction={attraction} />
      </Grid>
    ));
  };

  const renderEventCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    return data.slice(0, 6).map((event, index) => (
      <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
        <EventCard event={event} />
      </Grid>
    ));
  };

  const filteredDiscoverPosts = discoverCategory === 'Tất cả'
    ? discoverPosts
    : discoverPosts.filter(post => post.category === discoverCategory);

  const handleEventCategoryChange = (category) => {
    console.log('Selected category:', category);
    setEventsCategory(category);
    if (category !== 'Tất cả') {
      setEvents(events.filter(event => event.eventCategory === category));
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ marginTop: 5 }}>
      <Header />
      {province && (
        <>
          <ImageGallery images={province.imageUrls} />
          <Typography variant="h2" component="h1" sx={{ textAlign: 'center', marginY: 4, fontWeight: 'bold' }}>
            {province.provinceName}
          </Typography>
          <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Về {province.provinceName}
            </Typography>
            <Typography variant="body1" paragraph>
              Miêu tả về {province.provinceName}
            </Typography>

            <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
              Điểm đến nổi bật
            </Typography>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={highlightCategories}
                selectedCategory={highlightsCategory}
                onCategoryChange={setHighlightsCategory} />
              <Typography
                component={Link} to={`/diem-tham-quan`} variant="body2"
                sx={{
                  fontStyle: 800, textDecoration: 'underline', marginBottom: 2, fontSize: 16, position: 'absolute', right: 0, bottom: -24, color: '#000',
                  cursor: 'pointer', '&:hover': { textDecoration: 'underline', },
                }}>
                Xem thêm
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {renderAttractionCards(attractions)}
            </Grid>

            <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
              Sự kiện
            </Typography>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={eventCategories}
                selectedCategory={eventsCategory}
                onCategoryChange={handleEventCategoryChange}
              />
              <Typography
                variant="body2" component={Link} to={`/su-kien`}
                sx={{
                  fontStyle: 800, textDecoration: 'underline', marginBottom: 2, fontSize: 16, position: 'absolute', right: 0, bottom: -24, color: '#000',
                  cursor: 'pointer', '&:hover': { textDecoration: 'underline', },
                }}>
                Xem thêm
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {renderEventCards(events)}
            </Grid>

            <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
              Khám phá {provinceData.name} qua các bài viết
            </Typography>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={discoverCategories}
                selectedCategory={discoverCategory}
                onCategoryChange={setDiscoverCategory}
              />
              <Typography
                variant="body2" component={Link} to={`/bai-viet`}
                sx={{
                  fontStyle: 800, textDecoration: 'underline', marginBottom: 2, fontSize: 16, position: 'absolute', right: 0, bottom: -24, color: '#000',
                  cursor: 'pointer', '&:hover': { textDecoration: 'underline', },
                }}>
                Xem thêm
              </Typography>
            </Box>
            <PostsGrid posts={filteredDiscoverPosts} maxPosts={6} />
          </Container>
        </>
      )}
      <Footer />
    </Box>
  );
};

export default ProvinceDetail;
