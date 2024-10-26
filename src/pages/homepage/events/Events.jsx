import React, { useState, useEffect, useRef } from 'react';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const provinceRef = useRef(null);

  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryRef = useRef(null);

  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const provinceId = searchParams.get('provinceId');
    const startDate = searchParams.get('startDate');
    const applySearch = searchParams.get('applySearch');
    
    if (applySearch === 'true') {
      setSearchInput(name || '');
      setSelectedProvince(provinceId || 'all');
      setStartDateFrom(startDate || '');
      setSearchTerm(name || '');
      setPage(1);

      searchParams.delete('applySearch');
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

      fetchEventData({
        searchTerm: name || '',
        startDateFrom: startDate || '',
        provinceIds: provinceId !== 'all' ? provinceId === null ||  provinceId === '' ? null :[provinceId] : [],
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
        startDateFrom: overrideParams.startDateFrom || startDateFrom,
        startDateTo: overrideParams.startDateTo || startDateTo,
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
      startDateFrom: startDateFrom,
      startDateTo: startDateTo,
    });
  };

  const handleProvinceDropdownToggle = () => {
    setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
    if (!isProvinceDropdownOpen) {
      setProvinceSearchTerm('');
    }
  };

  const handleCategoryDropdownToggle = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    if (!isCategoryDropdownOpen) {
      setCategorySearchTerm('');
    }
  };

  const handleProvinceSearchChange = (event) => {
    setProvinceSearchTerm(event.target.value);
  };

  const handleCategorySearchChange = (event) => {
    setCategorySearchTerm(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (provinceRef.current && !provinceRef.current.contains(event.target)) {
      setIsProvinceDropdownOpen(false);
    }
    if (categoryRef.current && !categoryRef.current.contains(event.target)) {
      setIsCategoryDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStartDateFromChange = (event) => {
    setStartDateFrom(event.target.value);
  };

  const handleStartDateToChange = (event) => {
    setStartDateTo(event.target.value);
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
          <Grid item xs={12} md={3.3}>
            <Box sx={{ position: 'sticky', top: 70, maxHeight: '100vh', overflowY: 'auto', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}>
              <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0', fontSize: '30px' }}>Bộ lọc</Typography>
                <Box sx={{ mt: -1, p: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControl fullWidth ref={provinceRef}>
                    <Typography sx={{ textAlign: 'left', color: 'black', fontSize: '18px' }}>Tỉnh thành</Typography>
                    <Box sx={{ position: 'relative', mb: isProvinceDropdownOpen ? '19.5%' : 0 }}>
                      {!isProvinceDropdownOpen ? (
                        <Button
                          onClick={handleProvinceDropdownToggle}
                          sx={{
                            justifyContent: 'space-between', textAlign: 'left',
                            color: 'black', backgroundColor: 'white', border: '1px solid #ccc',
                            '&:hover': { borderRadius: '5px', backgroundColor: '#f5f5f5' },
                            height: '50px', width: '100%', textTransform: 'none', fontSize: '17px'
                          }}
                        >
                          {selectedProvince === 'all' ? 'Tất cả' : provinces.find(p => p.provinceId === selectedProvince)?.provinceName || 'Tất cả'}
                          <ExpandMoreIcon />
                        </Button>
                      ) : (
                        <Box sx={{
                          position: 'absolute', left: 0, right: 0, zIndex: 1000, backgroundColor: 'white', borderRadius: '10px',
                          boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
                        }}>
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
                            sx={{ mb: 1, '& .MuiInputBase-root': { height: '50px' } }}
                          />
                          <Paper sx={{ maxHeight: 150, overflow: 'auto', borderRadius: '10px' }}>
                            <List dense>
                              <ListItem button onClick={() => { setSelectedProvince('all'); handleProvinceDropdownToggle(); }}>
                                <ListItemText primary="Tất cả" primaryTypographyProps={{ height: '1.3rem' }} />
                              </ListItem>
                              {provinces
                                .filter(province => province.provinceName.toLowerCase().includes(provinceSearchTerm.toLowerCase()))
                                .map((province) => (
                                  <ListItem
                                    button
                                    key={province.provinceId}
                                    onClick={() => { setSelectedProvince(province.provinceId); handleProvinceDropdownToggle(); }}
                                    selected={selectedProvince === province.provinceId}
                                  >
                                    <ListItemText primary={province.provinceName} primaryTypographyProps={{ height: '1.3rem' }} />
                                  </ListItem>
                                ))}
                            </List>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2 }} ref={categoryRef}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Loại sự kiện</Typography>
                    <Box sx={{ position: 'relative' }}>
                      {!isCategoryDropdownOpen ? (
                        <Button
                          onClick={handleCategoryDropdownToggle}
                          sx={{
                            justifyContent: 'space-between', textAlign: 'left', color: 'black',
                            backgroundColor: 'white', border: '1px solid #ccc',
                            '&:hover': { borderRadius: '5px', backgroundColor: '#f5f5f5' },
                            height: '50px', width: '100%', textTransform: 'none', fontSize: '17px'
                          }}
                        >
                          {selectedCategory === 'all' ? 'Tất cả' : categories.find(c => c.eventCategoryId === selectedCategory)?.name || 'Tất cả'}
                          <ExpandMoreIcon />
                        </Button>
                      ) : (
                        <Box sx={{
                          position: 'absolute', left: 0, right: 0, zIndex: 1000, backgroundColor: 'white', borderRadius: '10px',
                          boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
                        }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Tìm kiếm loại sự kiện..."
                            value={categorySearchTerm}
                            onChange={handleCategorySearchChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ mb: 1, '& .MuiInputBase-root': { height: '40px' } }}
                          />
                          <Paper sx={{ maxHeight: 150, overflow: 'auto', borderRadius: '10px' }}>
                            <List dense>
                              <ListItem button onClick={() => { setSelectedCategory('all'); handleCategoryDropdownToggle(); }} sx={{ py: 0.5 }}>
                                <ListItemText primary="Tất cả" primaryTypographyProps={{ height: '1.3rem' }} />
                              </ListItem>
                              {categories
                                .filter(category => category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                                .map((category) => (
                                  <ListItem
                                    button
                                    key={category.eventCategoryId}
                                    onClick={() => { setSelectedCategory(category.eventCategoryId); handleCategoryDropdownToggle(); }}
                                    selected={selectedCategory === category.eventCategoryId}
                                    sx={{ py: 0.5 }}
                                  >
                                    <ListItemText primary={category.name} primaryTypographyProps={{ height: '1.3rem' }} />
                                  </ListItem>
                                ))}
                            </List>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Ngày bắt đầu từ</Typography>
                    <TextField
                      type="date"
                      value={startDateFrom}
                      onChange={handleStartDateFromChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ '& .MuiInputBase-root': { height: '50px' } }}
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2, mb: 7 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Ngày bắt đầu đến</Typography>
                    <TextField
                      type="date"
                      value={startDateTo}
                      onChange={handleStartDateToChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ '& .MuiInputBase-root': { height: '50px' } }}
                    />
                  </FormControl>
                  <Box sx={{ position: 'absolute', bottom: 25, left: 25, right: 25 }}>
                    <Button
                      variant="contained" fullWidth onClick={handleApplyFilters}
                      sx={{
                        backgroundColor: '#3572EF', height: '52px', fontSize: '15.3px',
                        '&:hover': { borderRadius: '5px', backgroundColor: '#1C3F94' }
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
