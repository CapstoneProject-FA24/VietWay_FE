import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Pagination, Select, MenuItem, FormControl, Button, TextField, InputAdornment, IconButton, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import EventCard from '@components/events/EventCard';
import { fetchEvents } from '@hooks/MockPost';
import { fetchProvinces } from '@services/ProvinceService';
import SearchIcon from '@mui/icons-material/Search';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    province: 'all',
    category: 'all'
  });

  useEffect(() => {
    fetchEventData();
    fetchProvinceData();
    // Simulating fetching categories
    setCategories([
      { categoryId: '1', categoryName: 'Lễ hội' },
      { categoryId: '2', categoryName: 'Triển lãm' },
      // Add more categories as needed
    ]);
  }, [page, pageSize, searchTerm, appliedFilters]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
      setTotalItems(fetchedEvents.length);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinceData = async () => {
    try {
      const fetchedProvinces = await fetchProvinces();
      setProvinces(fetchedProvinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

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

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      province: selectedProvince,
      category: selectedCategory
    });
    setPage(1);
  };

  const filteredProvinces = useMemo(() => {
    return provinces.filter(province =>
      province.provinceName.toLowerCase().includes(provinceSearchTerm.toLowerCase())
    );
  }, [provinces, provinceSearchTerm]);

  const sortedProvinces = useMemo(() => {
    if (selectedProvince === 'all') return filteredProvinces;
    return [
      filteredProvinces.find(p => p.provinceId === selectedProvince),
      ...filteredProvinces.filter(p => p.provinceId !== selectedProvince)
    ].filter(Boolean);
  }, [filteredProvinces, selectedProvince]);

  const handleProvinceSearchChange = (event) => {
    setProvinceSearchTerm(event.target.value);
  };

  const handleProvinceSelect = (provinceId) => {
    setSelectedProvince(provinceId === 'all' ? 'all' : provinceId);
  };

  if (loading) {
    return (
      <>
        <Helmet><title>Sự kiện</title></Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', ml: 1, mr: 1 }}>
      <Helmet><title>Sự kiện</title></Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, mt: 8 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', textAlign: 'left', mb: 2 }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link>
          &gt; <strong>Sự kiện</strong>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              Khám phá các sự kiện
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm sự kiện..."
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
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 8, maxHeight: 'calc(100vh)', overflowY: 'auto', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}>
              <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2, }}>
                <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', mb: 1, backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0' }}>Bộ lọc</Typography>
                <Box sx={{ p: 1 }}>
                  <FormControl fullWidth sx={{ pl: 2, pr: 2 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.2, fontSize: '16px' }}>Danh mục</Typography>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{ height: '40px' }}
                    >
                      <MenuItem value="all">Tất cả</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>{category.categoryName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 1.5 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.2, fontSize: '16px' }}>Tỉnh thành</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Tìm kiếm tỉnh thành..."
                      value={provinceSearchTerm}
                      onChange={handleProvinceSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 1, '& .MuiInputBase-root': { height: '40px' } }}
                    />
                    <List sx={{ maxHeight: 315, overflow: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
                      <ListItem
                        button
                        selected={selectedProvince === 'all'}
                        onClick={() => handleProvinceSelect('all')}
                        sx={{
                          backgroundColor: selectedProvince === 'all' ? '#e3f2fd' : 'inherit',
                          '&:hover': { backgroundColor: '#e3f2fd' },
                          '&.Mui-selected': { backgroundColor: '#c0d5ff' },
                        }}
                      >
                        <ListItemText primary="Tất cả" />
                      </ListItem>
                      {sortedProvinces.map((province) => (
                        <ListItem
                          button
                          key={province.provinceId}
                          selected={selectedProvince === province.provinceId}
                          onClick={() => handleProvinceSelect(province.provinceId)}
                          sx={{
                            backgroundColor: selectedProvince === province.provinceId ? '#e3f2fd' : 'inherit',
                            '&:hover': { backgroundColor: '#e3f2fd' },
                            '&.Mui-selected': { backgroundColor: '#c0d5ff' },
                          }}
                        >
                          <ListItemAvatar>
                            <img
                              src={province.imageURL} alt={province.provinceName}
                              style={{
                                width: '120px', height: '65px', marginRight: 10, marginBottom: -9, marginTop: -3,
                                borderRadius: '5px'
                              }} />
                          </ListItemAvatar>
                          <ListItemText primary={province.provinceName} />
                        </ListItem>
                      ))}
                    </List>
                  </FormControl>

                  <Box sx={{ pl: 2, pr: 2, mt: 1, mb: -0.5 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleApplyFilters}
                      sx={{
                        backgroundColor: '#3572EF',
                        '&:hover': { backgroundColor: '#1C3F94' }
                      }}
                    >
                      Áp dụng bộ lọc
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'left', color: 'black' }}>
                {totalItems} kết quả
              </Typography>
            </Box>
            <Grid container spacing={1}>
              {events.length > 0 ? (
                events.map((event) => (
                  <Grid item xs={12} key={event.id}>
                    <EventCard event={event} />
                  </Grid>
                ))
              ) : (
                <Box sx={{ minHeight: '30rem', width: '100%' }}>
                  <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}>
                    Không tìm thấy sự kiện nào!
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                    <img src="/event-not-found.png" alt="No results found" style={{ maxWidth: '300px', height: 'auto' }} />
                  </Box>
                </Box>
              )}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(totalItems / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ m: '0 auto' }}
              />
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                variant="outlined"
                sx={{ height: '40px' }}
              >
                <MenuItem value={5}>5 / trang</MenuItem>
                <MenuItem value={10}>10 / trang</MenuItem>
                <MenuItem value={20}>20 / trang</MenuItem>
              </Select>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default Events;
