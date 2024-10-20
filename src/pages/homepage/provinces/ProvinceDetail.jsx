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

const ProvinceDetail = () => {
  const { id } = useParams();
  const [provinceData, setProvinceData] = useState(null);

  const highlightCategories = ['Tất cả', 'Bảo tàng', 'Công viên', 'Di tích lịch sử', 'Công trình tôn giáo', 'Khu bảo tồn thiên nhiên'];
  const eventCategories = ['Tất cả', 'Đang diễn ra', 'Sắp đến'];
  const discoverCategories = ['Tất cả', 'Văn hóa', 'Ẩm thực', 'Hoạt động', 'Nơi lưu trú'];

  const [highlightsCategory, setHighlightsCategory] = useState('Tất cả');
  const [eventsCategory, setEventsCategory] = useState('Tất cả');
  const [discoverCategory, setDiscoverCategory] = useState('Tất cả');

  const [discoverPosts, setDiscoverPosts] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const province = mockProvinceData.find(p => p.id === parseInt(id));
    if (province) {
      console.log('Province:', province.name);
      setProvinceData(province);
      setDiscoverPosts(province.discover);
      const provinceEvents = mockEvents.filter(event => event.provinceName === province.name);
      setFilteredEvents(provinceEvents);
    }
  }, [id]);

  const renderCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    return data.slice(0, 6).map((item, index) => (
      <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
        <ProvincePagesCard {...item} />
      </Grid>
    ));
  };

  const filteredDiscoverPosts = discoverCategory === 'Tất cả'
    ? discoverPosts
    : discoverPosts.filter(post => post.category === discoverCategory);

  const handleEventCategoryChange = (category) => {
    console.log('Selected category:', category);
    setEventsCategory(category);
    if (category === 'Tất cả') {
      setFilteredEvents(mockEvents.filter(event => event.provinceName === provinceData.name));
    } else {
      setFilteredEvents(mockEvents.filter(event => 
        event.provinceName === provinceData.name && event.status === category
      ));
    }
    console.log('Updated filteredEvents:', updatedFilteredEvents);
    setFilteredEvents(updatedFilteredEvents);
  };

  console.log('filteredEvents:', filteredEvents);

  return (
    <Box sx={{ marginTop: 5 }}>
      <Header />
      {provinceData && (
        <>
          <ImageGallery
            images={provinceData.galleryImages}
          />
          <Typography variant="h2" component="h1" sx={{ textAlign: 'center', marginY: 4, fontWeight: 'bold' }}>
            {provinceData.name}
          </Typography>
          <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Về {provinceData.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {provinceData.description}
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
              {renderCards(provinceData.highlights)}
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
              {filteredEvents.slice(0, 6).map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                  <EventCard
                    image={event.image}
                    title={event.title}
                    description={event.description}
                    eventType={event.eventType}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    provinceName={event.provinceName}
                    address={event.address}
                  />
                </Grid>
              ))}
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
