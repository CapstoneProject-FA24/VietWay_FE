import React, { useState } from 'react';
import { Grid, Typography, Container, Box } from '@mui/material';
import ProvincePagesCard from '@components/ProvincePages/ProvincePagesCard';
import ImageGallery from '@components/ProvincePages/ImageGallery';
import { mockProvinceData } from '@hooks/MockProvincePage';
import CategoryFilter from '@components/ProvincePages/CategoryFilter';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { PostsGrid } from '@components/ProvincePages/PostsCard';

const ProvincePages = () => {
  const highlightCategories = ['Tất cả', 'Bảo tàng', 'Công viên', 'Di tích lịch sử', 'Công trình tôn giáo', 'Khu bảo tồn thiên nhiên'];
  const eventCategories = ['Tất cả', 'Đang diễn ra', 'Sắp đến'];
  const discoverCategories = ['Tất cả', 'Văn hóa', 'Ẩm thực', 'Hoạt động', 'Nơi lưu trú'];

  const [highlightsCategory, setHighlightsCategory] = useState('Tất cả');
  const [eventsCategory, setEventsCategory] = useState('Tất cả');
  const [discoverCategory, setDiscoverCategory] = useState('Tất cả');

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

  return (
    <Box sx={{ marginTop: 5 }}>
      <Header/>
      <ImageGallery 
        images={mockProvinceData.galleryImages} 
        author="HaiDang Travel"
      />
      <Typography variant="h2" component="h1" sx={{ textAlign: 'center', marginY: 4, fontWeight: 'bold' }}>
        {mockProvinceData.name}
      </Typography>
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Về {mockProvinceData.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {mockProvinceData.description}
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
            variant="body2" 
            sx={{ fontStyle: 800, textDecoration: 'underline', marginBottom: 2, fontSize: 16, position: 'absolute', right: 0, bottom: -24, color: '#000', 
                  cursor: 'pointer', '&:hover': { textDecoration: 'underline', }, }}>
            Xem thêm
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {renderCards(mockProvinceData.highlights)}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          Sự kiện
        </Typography>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <CategoryFilter 
            categories={eventCategories} 
            selectedCategory={eventsCategory} 
            onCategoryChange={setEventsCategory} 
          />
          <Typography 
            variant="body2" 
            sx={{ fontStyle: 800, textDecoration: 'underline', marginBottom: 2, fontSize: 16, position: 'absolute', right: 0, bottom: -24, color: '#000', 
                  cursor: 'pointer', '&:hover': { textDecoration: 'underline', }, }}>
            Xem thêm
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {renderCards(mockProvinceData.events)}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          Khám phá {mockProvinceData.name} qua các bài viết
        </Typography>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <CategoryFilter 
            categories={discoverCategories} 
            selectedCategory={discoverCategory} 
            onCategoryChange={setDiscoverCategory} 
          />
          <Typography 
            variant="body2" 
            sx={{ fontStyle: 800, textDecoration: 'underline', marginBottom: 2, fontSize: 16, position: 'absolute', right: 0, bottom: -24, color: '#000', 
                  cursor: 'pointer', '&:hover': { textDecoration: 'underline', }, }}>
            Xem thêm
          </Typography>
        </Box>
        <PostsGrid posts={mockProvinceData.discover} />
      </Container>
      <Footer/>
    </Box>
  );
};

export default ProvincePages;
