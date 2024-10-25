import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Pagination, Select, MenuItem, FormControl, Button, TextField, InputAdornment, IconButton, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EventListCard from '@components/events/EventListCard';
import { fetchEvents } from '@services/EventService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchEventCategory } from '@services/EventCategoryService';
import SearchIcon from '@mui/icons-material/Search';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const provinceId = searchParams.get('provinceId');
    const categoryId = searchParams.get('categoryId');
    const applySearch = searchParams.get('applySearch');

    if (applySearch === 'true') {
      setSearchInput(name || '');
      setSelectedProvince(provinceId || 'all');
      setSelectedCategory(categoryId || 'all');
      setSearchTerm(name || '');
      setPage(1);

      searchParams.delete('applySearch');
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

      fetchEventData({
        searchTerm: name || '',
        provinceIds: provinceId !== 'all' ? [provinceId] : [],
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!location.search.includes('applySearch=true')) {
      fetchEventData();
    }
    fetchProvinceData();
    fetchCategoryData();
  }, [page, pageSize]);

  const fetchEventData = async (overrideParams = {}) => {
    try {
      setLoading(true);
      const params = {
        pageSize,
        pageIndex: page,
        searchTerm: overrideParams.searchTerm || searchTerm,
        provinceIds: overrideParams.provinceIds || (selectedProvince !== 'all' ? [selectedProvince] : []),
        eventCategoryIds: overrideParams.eventCategoryIds || (selectedCategory !== 'all' ? [selectedCategory] : []),
      };

      const response = await fetchEvents(params);
      setEvents(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / pageSize));
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

  const fetchCategoryData = async () => {
    try {
      const fetchedCategories = await fetchEventCategory();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    setPage(1);
    setSearchTerm(searchInput);
    fetchEventData({
      searchTerm: searchInput,
      provinceIds: selectedProvince !== 'all' ? [selectedProvince] : [],
      eventCategoryIds: selectedCategory !== 'all' ? [selectedCategory] : [],
    });
  };

  const handleProvinceSearchChange = (event) => {
    setProvinceSearchTerm(event.target.value);
  };

  const handleProvinceSelect = (provinceId) => {
    setSelectedProvince(provinceId);
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
          <Grid item xs={12} md={3.7}>
            <Box sx={{ position: 'sticky', top: 8, maxHeight: 'calc(100vh)', overflowY: 'auto', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}>
              <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2, }}>
                <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', mb: 1, backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0' }}>Bộ lọc</Typography>
                <Box sx={{ p: 1 }}>
                  <FormControl fullWidth sx={{ pl: 2, pr: 2 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.2, fontSize: '16px' }}>Loại sự kiện</Typography>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{ height: '40px' }}
                    >
                      <MenuItem value="all">Tất cả</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.eventCategoryId} value={category.eventCategoryId}>
                          {category.name}
                        </MenuItem>
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
                      {provinces.filter(province =>
                        province.provinceName.toLowerCase().includes(provinceSearchTerm.toLowerCase())
                      ).sort((a, b) => {
                        if (a.provinceId === selectedProvince) return -1;
                        if (b.provinceId === selectedProvince) return 1;
                        return 0;
                      }).map((province) => (
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
                      variant="contained" fullWidth onClick={handleApplyFilters}
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
          <Grid item xs={12} md={8.3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'left', color: 'black' }}>
                {totalItems} kết quả
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {events.length > 0 ? (
                events.map((event) => (
                  <Grid item xs={6} key={event.eventId}>
                    <EventListCard event={event} />
                  </Grid>
                ))
              ) : (
                <Box sx={{ minHeight: '30rem', width: '100%' }}>
                  <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}>
                    Không tìm thấy sự kiện nào!
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                    <img src="/location-not-found.png" alt="No results found" style={{ maxWidth: '300px', height: 'auto' }} />
                  </Box>
                </Box>
              )}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Pagination
                count={totalPages}
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
                <MenuItem value={4}>4 / trang</MenuItem>
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
