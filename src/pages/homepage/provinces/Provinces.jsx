import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Pagination, TextField, InputAdornment, IconButton } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { provinces } from '@hooks/MockProvinces';
import SearchIcon from '@mui/icons-material/Search';
import ProvinceCard from '@components/provinces/ProvinceCard';

const Provinces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredProvinces = provinces.filter(province =>
    province.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Danh sách tỉnh thành</title>
        </Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src="/loading.gif" alt="Loading..." />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '80vw' }}>
      <Helmet>
        <title>Tỉnh thành</title>
      </Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, mt: 8 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', textAlign: 'left', mb: 2 }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none' }}>Trang chủ </Link> 
          &gt; <strong>Tỉnh thành</strong>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              Khám phá các tỉnh thành
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm tỉnh thành..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography sx={{ textAlign: 'left', color: 'black' }}>
            {filteredProvinces.length} kết quả
          </Typography>
        </Box>
        {filteredProvinces.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {filteredProvinces.slice((page - 1) * pageSize, page * pageSize).map(province => (
                <Grid item xs={12} sm={6} md={6} key={province.id}>
                  <ProvinceCard province={province} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={Math.ceil(filteredProvinces.length / pageSize)} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
              />
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <img src="/location-not-found.png" alt="Location not found" style={{ width: '20rem', height: 'auto', marginBottom: '16px' }} />
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Không tìm thấy tỉnh thành phù hợp
            </Typography>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default Provinces;
