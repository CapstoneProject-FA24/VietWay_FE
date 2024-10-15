import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Card, CardMedia, Pagination, Select, MenuItem, FormControl, Checkbox, FormGroup, FormControlLabel, OutlinedInput, Button } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFilteredAttractions } from '@hooks/MockAttractions';
import { styled, alpha } from '@mui/material/styles';

const Attractions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    museum: false,
    park: false,
    historical: false,
    religious: false,
    natureReserve: false,
    province: '',
  });

  const provinces = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn',
    'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương',
    'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk',
    'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai',
    'Hà Giang', 'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang',
    'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum',
    'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An',
    'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh',
    'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình',
    'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang',
    'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const province = searchParams.get('tinh') || '';
    setFilters((prevFilters) => ({ ...prevFilters, province }));
  }, [location.search]);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = getFilteredAttractions(filters, sortBy);
        setAttractions(mockData);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [sortBy, filters]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const handleProvinceChange = (event) => {
    const newProvince = event.target.value;
    setFilters({ ...filters, province: newProvince });
    navigate(`/diem-tham-quan?tinh=${newProvince}`, { replace: true });
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
  }));

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Điểm tham quan</title>
        </Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src="/loading.gif" alt="Loading..." />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>Điểm tham quan</title>
      </Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, padding: '40px' }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', marginBottom: '16px', textAlign: 'left' }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link> 
          &gt; <strong>Điểm tham quan</strong>
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', mt: 5 }}>
          Khám phá các địa điểm du lịch
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ borderRadius: '10px' }}>
              <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', mb: 2, backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0' }}>Bộ lọc</Typography>
              <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', ml: 2, mb: -2, fontSize: '18px' }}>Loại điểm đến</Typography>
              <FormGroup sx={{ p: 2 }}>
                <FormControlLabel control={<Checkbox checked={filters.museum} onChange={handleFilterChange} name="museum" />} label="Bảo tàng" />
                <FormControlLabel control={<Checkbox checked={filters.park} onChange={handleFilterChange} name="park" />} label="Công viên" />
                <FormControlLabel control={<Checkbox checked={filters.historical} onChange={handleFilterChange} name="historical" />} label="Di tích lịch sử" />
                <FormControlLabel control={<Checkbox checked={filters.religious} onChange={handleFilterChange} name="religious" />} label="Công trình tôn giáo" />
                <FormControlLabel control={<Checkbox checked={filters.natureReserve} onChange={handleFilterChange} name="natureReserve" />} label="Khu bảo tồn thiên nhiên" />
              </FormGroup>
              <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', ml: 2, mb: -2, fontSize: '18px' }}>Tỉnh thành</Typography>
              <FormControl fullWidth sx={{ mt: 2, p: 2 }}>
                <Select
                  labelId="province-select-label"
                  id="province-select"
                  value={filters.province || "Tất cả"}
                  onChange={(e) => handleProvinceChange({ target: { value: e.target.value === "Tất cả" ? "" : e.target.value } })}
                  input={<OutlinedInput/>}
                >
                  <MenuItem value="Tất cả">
                    <em>Tất cả</em>
                  </MenuItem>
                  {provinces.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'left', color: 'black' }}>
                {attractions.length} kết quả
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ textAlign: 'left', color: 'black', mr: 2 }}>Sắp xếp theo:</Typography>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    labelId="sort-select-label"
                    value={sortBy}
                    onChange={handleSortChange}
                    size="small"
                  >
                    <MenuItem value="popularity">Phổ biến</MenuItem>
                    <MenuItem value="rating">Đánh giá</MenuItem>
                    <MenuItem value="name">Tên</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {attractions.map((attraction) => (
                <Grid item xs={12} key={attraction.id}>
                  <Card sx={{ display: 'flex', height: '200px', textAlign: 'left', borderRadius: '7px' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: '30%', objectFit: 'cover', margin: '7px', borderRadius: '7px' }}
                      image={attraction.images[0].url}
                      alt={attraction.images[0].alt}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {attraction.province}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/diem-tham-quan/${attraction.id}?province=${filters.province}`}
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
                        {attraction.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', marginRight: '8px' }} />
                        <Typography variant="body2" color="text.secondary">
                          {attraction.rating.rate} ({attraction.rating.vote})
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {attraction.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '20%', p: '0px 15px 15px 0px' }}>
                        <StyledButton component={Link} to={`/diem-tham-quan/${attraction.id}?province=${filters.province}`} sx={{ color: 'primary', textTransform: 'none', alignSelf: 'flex-end', borderRadius: '10px', border: '1px solid #3572EF', height: '50px', width: '80%' }}>Xem chi tiết</StyledButton>
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

export default Attractions;
