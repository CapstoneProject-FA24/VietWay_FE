import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Pagination, TextField, InputAdornment, IconButton, Select, MenuItem } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ProvinceCard from '@components/provinces/ProvinceCard';
import { fetchProvinceWithCountDetails } from '@services/ProvinceService';

const Provinces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [provinces, setProvinces] = useState([]);
  const [totalProvinces, setTotalProvinces] = useState(0);

  useEffect(() => {
    loadProvinces();
  }, [page, pageSize, searchTerm]);

  const loadProvinces = async () => {
    setLoading(true);
    try {
      const params = {
        pageIndex: page,
        pageSize: pageSize,
        searchTerm: searchTerm
      };
      const result = await fetchProvinceWithCountDetails(params);
      setProvinces(result.data);
      setTotalProvinces(result.total);
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '89vw' }}>
      <Helmet>
        <title>Tỉnh thành</title>
      </Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, mt: 8, ml: 5, mr: 5 }}>
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
            {totalProvinces} kết quả
          </Typography>
        </Box>
        {provinces.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {provinces.map(province => (
                <Grid item xs={12} sm={6} md={6} key={province.provinceId}>
                  <ProvinceCard province={province} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Box sx={{ ml: '10%' }} />
              <Pagination
                count={Math.ceil(totalProvinces / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
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
