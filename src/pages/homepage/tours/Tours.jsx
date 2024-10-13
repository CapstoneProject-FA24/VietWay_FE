import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Card, CardMedia, Pagination, Select, MenuItem, FormControl, Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import TourCard from '@components/TourCard'
import { fetchTourTemplates } from '@services/TourTemplateService';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('startDate');
  const [filters, setFilters] = useState({
    destinationProvince: '',
    priceRange: [],
    startDate: null,
    endDate: null,
    totalDays: [],
  });
  const [tempFilters, setTempFilters] = useState({
    destinationProvince: '',
    priceRange: [],
    startDate: null,
    endDate: null,
    totalDays: [],
  });
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const provinces = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Quảng Ninh', 'Lâm Đồng',
    // Add more provinces as needed
  ];

  const totalDaysOptions = [
    'Trong ngày',
    '2-3 ngày',
    '4-7 ngày',
    '7+ ngày'
  ];

  const priceOptions = [
    { value: [0, 1000000], label: 'Dưới 1 triệu' },
    { value: [1000000, 5000000], label: '1-5 triệu' },
    { value: [5000000, 10000000], label: '5-10 triệu' },
    { value: [10000000, 20000000], label: 'Trên 10 triệu' },
  ];

  useEffect(() => {
    fetchTours();
    window.scrollTo(0, 0);
  }, [sortBy, page, pageSize, filters, searchTerm]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {
        pageSize: pageSize,
        pageIndex: page,
        searchTerm: searchTerm,
        status: 2,
        // Add other filter parameters here
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

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'totalDays') {
      const newTotalDays = tempFilters.totalDays.includes(value)
        ? tempFilters.totalDays.filter(day => day !== value)
        : [...tempFilters.totalDays, value];
      setTempFilters({ ...tempFilters, totalDays: newTotalDays });
    } else if (name === 'priceRange') {
      const newPriceRange = tempFilters.priceRange.some(range => range[0] === value[0] && range[1] === value[1])
        ? tempFilters.priceRange.filter(range => range[0] !== value[0] || range[1] !== value[1])
        : [...tempFilters.priceRange, value];
      setTempFilters({ ...tempFilters, priceRange: newPriceRange });
    } else {
      setTempFilters({ ...tempFilters, [name]: value });
    }
  };

  const handleDateChange = (name, event) => {
    setTempFilters({ ...tempFilters, [name]: event.target.value });
  };

  const handleSubmitFilters = () => {
    setFilters(tempFilters);
    window.scrollTo(0, 0);
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
  }));

  function valuetext(value) {
    return `${value.toLocaleString()} VNĐ`;
  }

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1); // Reset to first page when searching
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
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C'}}>
              Khám phá các tour
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <TextField fullWidth variant="outlined" placeholder="Tìm kiếm tour..." value={searchInput}
              onChange={handleSearchInputChange} onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end"> <SearchIcon /> </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '15px' } }} />
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', mb: 2, backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0' }}>Bộ lọc</Typography>
              <Box sx={{ p: 1 }}>
                <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Tỉnh thành</Typography>
                  <Select value={tempFilters.destinationProvince}
                    onChange={handleFilterChange} name="destinationProvince"
                    sx={{ height: '40px' }} >
                    <MenuItem value="">Tất cả</MenuItem>
                    {provinces.map((province) => (
                      <MenuItem key={province} value={province}> {province} </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ pl: 2, pr: -1, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Giá tour</Typography>
                  <FormGroup row>
                    {priceOptions.map((option, index) => (
                      <FormControlLabel key={index} sx={{ width: '48%' }}
                        control={
                          <Checkbox checked={tempFilters.priceRange.some(range => range[0] === option.value[0] && range[1] === option.value[1])}
                            onChange={(event) => handleFilterChange({ target: { name: 'priceRange', value: option.value } })} name="priceRange" />
                        }
                        label={option.label} />
                    ))}
                  </FormGroup>
                </FormControl>
                <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Ngày bắt đầu</Typography>
                  <TextField type="date" value={tempFilters.startDate || ''}
                    onChange={(event) => handleDateChange('startDate', event)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-input': { height: '30px', padding: '8px' } }} />
                </FormControl>
                <FormControl fullWidth sx={{ pl: 2, pr: -1, mt: 2 }}>
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Số ngày</Typography>
                  <FormGroup row>
                    {totalDaysOptions.map((option, index) => (
                      <FormControlLabel key={option} sx={{ width: '48%' }}
                        control={
                          <Checkbox checked={tempFilters.totalDays.includes(option)}
                            onChange={handleFilterChange} name="totalDays" value={option} />
                        }
                        label={option} />
                    ))}
                  </FormGroup>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pl: 2, pr: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSubmitFilters} sx={{ width: '100%', height: '50px', borderRadius: '5px' }}>
                    Áp dụng bộ lọc
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'left', color: 'black' }}>
                {tours.length} kết quả
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ textAlign: 'left', color: 'black', mr: 2 }}>Sắp xếp theo:</Typography>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select value={sortBy} onChange={handleSortChange} size="small" sx={{ height: '40px' }} >
                    <MenuItem value="price">Giá</MenuItem>
                    <MenuItem value="duration">Thời gian</MenuItem>
                    <MenuItem value="startDate">Ngày khởi hành</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Grid container spacing={1}>
              {tours.map((tour) => (
                <TourCard key={tour.tourTemplateId} tour={tour} />
              ))}
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