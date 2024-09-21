import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Card, CardMedia, Pagination, Select, MenuItem, FormControl, Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { getFilteredTours } from '@hooks/MockTours';
import { styled } from '@mui/material/styles';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChairAltOutlinedIcon from '@mui/icons-material/ChairAltOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
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

  const navigate = useNavigate();

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
    window.scrollTo(0, 0); // Scroll to top when component loads
  }, [sortBy]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = getFilteredTours({}, sortBy); // Do not apply filters
      console.log("Fetched tours:", mockData); // Add this line for debugging
      if (mockData.length === 0) {
        console.log("No tours found with current filters:", filters);
      }
      setTours(mockData);
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

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Tour du lịch</title>
        </Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', ml: 1, mr: 1 }}>
      <Helmet>
        <title>Tour du lịch</title>
      </Helmet>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', marginBottom: '16px', textAlign: 'left' }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link> 
          &gt; <strong>Tour du lịch</strong>
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', mt: 5 }}>
          Khám phá các tour
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3.5}>
            <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2}}>
              <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', mb: 2, backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0' }}>Bộ lọc</Typography>
              <Box sx={{ p: 1 }}>
              <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Tỉnh thành</Typography>
                <Select
                  value={tempFilters.destinationProvince}
                  onChange={handleFilterChange}
                  name="destinationProvince"
                  sx={{ height: '40px' }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {provinces.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ pl: 2, pr: -1, mt: 2 }}>
                <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Giá tour</Typography>
                <FormGroup row>
                  {priceOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      sx={{ width: '48%' }}
                      control={
                        <Checkbox
                          checked={tempFilters.priceRange.some(range => range[0] === option.value[0] && range[1] === option.value[1])}
                          onChange={(event) => handleFilterChange({ target: { name: 'priceRange', value: option.value } })}
                          name="priceRange"
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Ngày bắt đầu</Typography>
                <TextField
                  type="date"
                  value={tempFilters.startDate || ''}
                  onChange={(event) => handleDateChange('startDate', event)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ '& .MuiInputBase-input': { height: '30px', padding: '8px' } }}
                />
              </FormControl>

              <FormControl fullWidth sx={{  pl: 2, pr: -1, mt: 2 }}>
                <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Số ngày</Typography>
                <FormGroup row>
                  {totalDaysOptions.map((option, index) => (
                    <FormControlLabel
                      key={option}
                      sx={{ width: '48%' }}
                      control={
                        <Checkbox
                          checked={tempFilters.totalDays.includes(option)}
                          onChange={handleFilterChange}
                          name="totalDays"
                          value={option}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <FormControl fullWidth sx={{ pl: 2, pr: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Công ty du lịch</Typography>
                <Select
                  value={tempFilters.travelCompany || ''}
                  onChange={(event) => handleFilterChange({ target: { name: 'travelCompany', value: event.target.value } })}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    <em>Tất cả</em>
                  </MenuItem>
                  <MenuItem value="Amazing Tours">Amazing Tours</MenuItem>
                  <MenuItem value="Viet Tours">Viet Tours</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pl: 2, pr: 2}}>
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
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    size="small"
                    sx={{ height: '40px' }}
                  >
                    <MenuItem value="price">Giá</MenuItem>
                    <MenuItem value="duration">Thời gian</MenuItem>
                    <MenuItem value="startDate">Ngày khởi hành</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {tours.map((tour) => (
                <Grid item xs={12} key={tour.id}>
                  <Card sx={{ display: 'flex', height: '225px', textAlign: 'left', borderRadius: '7px' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: '28%', objectFit: 'cover', margin: '7px', borderRadius: '7px' }}
                      image={tour.images[0].url}
                      alt={tour.images[0].alt}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%', p: 2 }}>
                    <Typography
                        gutterBottom 
                        sx={{ 
                          textAlign: 'right',
                          color: 'grey',
                          fontSize: '0.9rem',
                          mb: 0
                        }}
                      >
                        {tour.travelCompany}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/tour-du-lich/${tour.id}`}
                        gutterBottom 
                        sx={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          display: '-webkit-box', 
                          WebkitLineClamp: 1, 
                          WebkitBoxOrient: 'vertical',
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        {tour.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SubtitlesOutlinedIcon sx={{ marginRight: '8px' }} />
                        {tour.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1  }}>
                        <MapOutlinedIcon sx={{ marginRight: '8px' }} />
                        Khởi hành từ: {tour.pickupPoints[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1  }}>
                        <CalendarMonthOutlinedIcon sx={{ marginRight: '8px' }} />
                        Ngày khởi hành: {tour.startDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1  }}>
                        <ChairAltOutlinedIcon sx={{ marginRight: '8px' }} />
                        Số chỗ còn nhận: {tour.totalAcceptedParticipants}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '1px', backgroundColor: '#e0e0e0', margin: '0 15px' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '20%', p: '5px 15px 15px 5px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                        <AccessTimeOutlinedIcon sx={{ marginRight: '8px', fontSize: '1.7rem' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                          {tour.days}N{tour.days - 1}D
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" sx={{ alignSelf: 'flex-end', mb: 1 }}>
                        {tour.price.adult.toLocaleString()} VNĐ
                      </Typography>
                      <StyledButton component={Link} to={`/tour-du-lich/${tour.id}`} sx={{ color: 'primary', textTransform: 'none', alignSelf: 'center', borderRadius: '10px', border: '1px solid #3572EF', height: '50px', width: '80%' }}>Xem chi tiết</StyledButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination count={10} page={page} onChange={handlePageChange} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default Tours;
