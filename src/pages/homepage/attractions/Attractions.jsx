import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Pagination, Select, MenuItem, FormControl, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AttractionCard from '@components/AttractionCard';
import { fetchAttractions } from '@services/AttractionService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import SearchIcon from '@mui/icons-material/Search';

const Attractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedAttractionType, setSelectedAttractionType] = useState('all');
  const [provinces, setProvinces] = useState([]);
  const [attractionTypes, setAttractionTypes] = useState([]);

  useEffect(() => {
    fetchAttractionData();
    fetchProvinceData();
    fetchAttractionTypeData();
  }, [page, pageSize, searchTerm]);

  const fetchAttractionData = async () => {
    try {
      setLoading(true);
      const params = {
        pageSize,
        pageIndex: page,
        searchTerm: searchTerm,
        provinceIds: selectedProvince !== 'all' ? [selectedProvince] : [],
        attractionTypeIds: selectedAttractionType !== 'all' ? [selectedAttractionType] : [],
      };

      const response = await fetchAttractions(params);
      setAttractions(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (error) {
      console.error("Error fetching attractions:", error);
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

  const fetchAttractionTypeData = async () => {
    try {
      const fetchedAttractionTypes = await fetchAttractionType();
      setAttractionTypes(fetchedAttractionTypes);
    } catch (error) {
      console.error('Error fetching attraction types:', error);
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
    fetchAttractionData();
  };

  if (loading) {
    return (
      <>
        <Helmet> <title>Điểm tham quan</title> </Helmet>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', ml: 1, mr: 1 }}>
      <Helmet><title>Điểm tham quan</title></Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, mt: 8 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', textAlign: 'left', mb: 2 }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link>
          &gt; <strong>Điểm tham quan</strong>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              Khám phá các điểm tham quan
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm điểm tham quan..."
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
                  <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Loại điểm tham quan</Typography>
                  <Select
                    value={selectedAttractionType}
                    onChange={(e) => setSelectedAttractionType(e.target.value)}
                    sx={{ height: '40px' }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {attractionTypes.map((type) => (
                      <MenuItem key={type.attractionTypeId} value={type.attractionTypeId}>{type.attractionTypeName}</MenuItem>
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
              {attractions.length > 0 ? (
                attractions.map((attraction) => (
                  <Grid item xs={12} key={attraction.attractionId}>
                    <AttractionCard attraction={attraction} />
                  </Grid>
                ))
              ) : (
                <Box sx={{ minHeight: '30rem', width: '100%' }}>
                  <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}>
                    Không tìm thấy điểm tham quan nào!
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

export default Attractions;
