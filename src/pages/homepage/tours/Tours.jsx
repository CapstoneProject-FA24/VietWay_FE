import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Pagination, Select, MenuItem, FormControl, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TourCard from '@components/tours/TourCard';
import { fetchTourTemplates } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourCategory } from '@services/TourCategoryService';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [startDate, setStartDate] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [duration, setDuration] = useState('all');
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('');
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const provinceRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const priceRanges = [
    { value: '0,1000000', label: 'Dưới 1 triệu' },
    { value: '1000000,5000000', label: '1-5 triệu' },
    { value: '5000000,10000000', label: '5-10 triệu' },
    { value: '10000000,', label: 'Trên 10 triệu' },
  ];

  const durationOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: '1', label: 'Trong ngày' },
    { value: '2,3', label: '2-3 ngày' },
    { value: '4,5,6,7', label: '4-7 ngày' },
    { value: '8,9,10,11,12,13,14', label: '8+ ngày' },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const startDate = searchParams.get('startDate');
    const priceRange = searchParams.get('priceRange');
    const provinceId = searchParams.get('provinceId');
    const applySearch = searchParams.get('applySearch');

    if (applySearch === 'true') {
      setSearchInput(name || '');
      setStartDate(startDate || '');
      setPriceRange(priceRange || 'all');
      setSelectedProvince(provinceId || 'all');
      setSearchTerm(name || '');
      setPage(1);

      // Remove 'applySearch' from URL
      searchParams.delete('applySearch');
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

      // Fetch tours with the new parameters
      fetchTours({
        searchTerm: name || '',
        startDateFrom: startDate || '',
        priceRange: priceRange || 'all',
        provinceIds: provinceId !== 'all' ? [provinceId] : [],
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!location.search.includes('applySearch=true')) {
      fetchTours();
    }
    fetchProvinceData();
    fetchCategoryData();
  }, [page, pageSize]);

  const fetchTours = async (overrideParams = {}) => {
    try {
      setLoading(true);
      let min = null;
      let max = null;
      if (overrideParams.priceRange !== 'all' && overrideParams.priceRange) {
        [min, max] = overrideParams.priceRange.split(',');
      } else if (priceRange !== 'all' && priceRange) {
        [min, max] = priceRange.split(',');
      }
      const params = {
        pageSize,
        pageIndex: page,
        searchTerm: overrideParams.searchTerm || searchTerm,
        startDateFrom: overrideParams.startDateFrom || startDate,
        provinceIds: overrideParams.provinceIds || (selectedProvince !== 'all' ? [selectedProvince] : []),
        templateCategoryIds: selectedCategory !== 'all' ? [selectedCategory] : [],
        numberOfDay: duration !== 'all' ? duration.split(',').map(Number) : [],
        minPrice: min ? parseInt(min) : undefined,
        maxPrice: max ? parseInt(max) : undefined
      };
      const response = await fetchTourTemplates(params);
      setTours(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (error) {
      console.error("Error fetching tours:", error);
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
      const fetchedCategories = await fetchTourCategory();
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
    let min = null;
    let max = null;
    if (priceRange !== 'all') {
      [min, max] = priceRange.split(',');
    }
    fetchTours({
      searchTerm: searchInput,
      startDateFrom: startDate,
      provinceIds: selectedProvince !== 'all' ? [selectedProvince] : [],
      templateCategoryIds: selectedCategory !== 'all' ? [selectedCategory] : [],
      numberOfDay: duration !== 'all' ? duration.split(',').map(Number) : [],
      minPrice: min ? parseInt(min) : undefined,
      maxPrice: max ? parseInt(max) : undefined
    });
  };

  const handleProvinceDropdownToggle = () => {
    setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
    if (!isProvinceDropdownOpen) {
      setProvinceSearchTerm('');
    }
  };

  const handleProvinceSearchChange = (event) => {
    setProvinceSearchTerm(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (provinceRef.current && !provinceRef.current.contains(event.target)) {
      setIsProvinceDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <>
        <Helmet> <title>Tour du lịch</title> </Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src="/loading.gif" alt="Loading..." />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', ml: 1, mr: 1 }}>
      <Helmet><title>Tour du lịch</title></Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, mt: 8 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', textAlign: 'left', mb: 2 }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link>
          &gt; <strong>Tour du lịch</strong>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              Khám phá các tour
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm tour..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end"> <SearchIcon /> </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
            />
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Box sx={{ position: 'sticky', top: 10, height: '100vh', overflowY: 'auto', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}>
              <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2, height: '100vh' }}>
                <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0' }}>Bộ lọc</Typography>
                <Box sx={{ p: 3 }}>
                  <FormControl fullWidth ref={provinceRef}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Tỉnh thành</Typography>
                    <Box sx={{ position: 'relative' }}>
                      {!isProvinceDropdownOpen ? (
                        <Button
                          onClick={handleProvinceDropdownToggle}
                          sx={{
                            justifyContent: 'space-between', textAlign: 'left',
                            color: 'black', backgroundColor: 'white', border: '1px solid #ccc',
                            '&:hover': { borderRadius: '5px', backgroundColor: '#f5f5f5' }, pl: 1.7,
                            height: '40px', width: '100%', textTransform: 'none', fontSize: '17px'
                          }}
                        >
                          {selectedProvince === 'all' ? 'Tất cả' : provinces.find(p => p.provinceId === selectedProvince)?.provinceName || 'Tất cả'}
                          <ExpandMoreIcon />
                        </Button>
                      ) : (
                        <Box sx={{ position: 'absolute', left: 0, right: 0, zIndex: 1000, backgroundColor: 'white', boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)' }}>
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
                          <Paper sx={{ maxHeight: 150, overflow: 'auto' }}>
                            <List dense>
                              <ListItem button onClick={() => { setSelectedProvince('all'); handleProvinceDropdownToggle(); }}>
                                <ListItemText primary="Tất cả" primaryTypographyProps={{ height: '1.3rem', fontSize: '17px' }} />
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
                                    <ListItemText primary={province.provinceName} primaryTypographyProps={{ height: '1.3rem', fontSize: '17px' }} />
                                  </ListItem>
                                ))}
                            </List>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Loại tour</Typography>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{ height: '40px' }}
                    >
                      <MenuItem value="all">Tất cả</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.tourCategoryId} value={category.tourCategoryId}>{category.tourCategoryName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Giá tour</Typography>
                    <Select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      sx={{ height: '40px' }}
                    >
                      <MenuItem value="all">Tất cả</MenuItem>
                      {priceRanges.map((range) => (
                        <MenuItem key={range.value} value={range.value}>{range.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Ngày bắt đầu</Typography>
                    <TextField
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiInputBase-input': { height: '27px', padding: '8px' } }}
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 0.5, fontSize: '18px' }}>Số ngày</Typography>
                    <Select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      sx={{ height: '40px' }}
                    >
                      {durationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleApplyFilters}
                      sx={{
                        backgroundColor: '#3572EF', height: '50px',
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
          <Grid item xs={12} md={8.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'left', color: 'black' }}>
                {totalItems} kết quả
              </Typography>
            </Box>
            <Grid container spacing={1}>
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <TourCard key={tour.tourTemplateId} tour={tour} />
                ))
              ) : (
                <Box sx={{ minHeight: '30rem', width: '100%' }}>
                  <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}>
                    Không tìm thấy tour nào!
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

export default Tours;
