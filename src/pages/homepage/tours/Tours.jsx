import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Pagination, Select, MenuItem, FormControl, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import TourCard from '@components/tours/TourCard';
import { fetchTourTemplates } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourCategory } from '@services/TourCategoryService';
import SearchIcon from '@mui/icons-material/Search';

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
    fetchTours();
    fetchProvinceData();
    fetchCategoryData();
  }, [page, pageSize, searchTerm]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {
        pageSize,
        pageIndex: page,
        searchTerm: searchTerm,
        startDateFrom: startDate,
        provinceIds: selectedProvince !== 'all' ? [selectedProvince] : [],
        templateCategoryIds: selectedCategory !== 'all' ? [selectedCategory] : [],
        numberOfDay: duration !== 'all' ? duration.split(',').map(Number) : [],
      };

      if (priceRange !== 'all' && priceRange) {
        const [min, max] = priceRange.split(',');
        params.minPrice = min;
        params.maxPrice = max;
      }

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
    fetchTours();
  };

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
            <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', mb: 2, backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0' }}>Bộ lọc</Typography>
              <Box sx={{ p: 1 }}>
                <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Tỉnh thành</Typography>
                  <Select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    sx={{ height: '40px' }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {provinces.map((province) => (
                      <MenuItem key={province.provinceId} value={province.provinceId}>{province.provinceName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Danh mục</Typography>
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
                <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Giá tour</Typography>
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
                <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Ngày bắt đầu</Typography>
                  <TextField
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-input': { height: '30px', padding: '8px' } }}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Số ngày</Typography>
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
                <Box sx={{ pl: 2, pr: 2, mt: 2 }}>
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
                    <img src="/location-not-found.png" alt="No results found" style={{ maxWidth: '300px', height: 'auto' }}/>
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