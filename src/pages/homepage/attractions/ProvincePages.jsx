import React from 'react';
import { Grid, Typography, Container, Box } from '@mui/material';
import ProvincePagesCard from '@components/ProvincePagesCard';
import { mockProvinceData } from '@hooks/MockProvincePage';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';

const ProvincePages = () => {
  const renderCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    return data.slice(0, 6).map((item, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <ProvincePagesCard {...item} />
      </Grid>
    ));
  };

  return (
    <Box>
      <Header/>
      <Box 
        sx={{ backgroundImage: `url(${mockProvinceData.coverImage})`, 
        backgroundSize: 'cover', backgroundPosition: 'center', height: '400px', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: 4, marginTop: 5, borderRadius: 2 }}>
      </Box>
      <Typography variant="h2" component="h1" sx={{ textAlign: 'center', marginBottom: 4, fontWeight: 'bold'
       }}>
        {mockProvinceData.name}
      </Typography>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Về {mockProvinceData.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {mockProvinceData.description}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          Điểm đến nổi bật
        </Typography>
        <Grid container spacing={3}>
          {renderCards(mockProvinceData.highlights)}
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          Sự kiện
        </Typography>
        <Grid container spacing={3}>
          {renderCards(mockProvinceData.events)}
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          Khám phá {mockProvinceData.name}
        </Typography>
        <Grid container spacing={3}>
          {renderCards(mockProvinceData.discover)}
        </Grid>
      </Container>
      <Footer/>
    </Box>
  );
};

export default ProvincePages;
