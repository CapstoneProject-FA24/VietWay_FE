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
  const categories = ['Essentials', 'Events', 'Discover'];
  const [discoverCategory, setDiscoverCategory] = useState('Essentials');
  const [highlightsCategory, setHighlightsCategory] = useState('Essentials');
  const [eventsCategory, setEventsCategory] = useState('Essentials');

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
        <CategoryFilter categories={categories} selectedCategory={highlightsCategory} onCategoryChange={setHighlightsCategory} />
        <Grid container spacing={2}>
          {renderCards(mockProvinceData.highlights)}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          Sự kiện
        </Typography>
        <CategoryFilter categories={categories} selectedCategory={eventsCategory} onCategoryChange={setEventsCategory} />
        <Grid container spacing={2}>
          {renderCards(mockProvinceData.events)}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          Khám phá {mockProvinceData.name} qua các bài viết
        </Typography>
        <CategoryFilter 
          categories={categories} 
          selectedCategory={discoverCategory} 
          onCategoryChange={setDiscoverCategory} 
        />
        <PostsGrid posts={mockProvinceData.discover} />
      </Container>
      <Footer/>
    </Box>
  );
};

export default ProvincePages;
