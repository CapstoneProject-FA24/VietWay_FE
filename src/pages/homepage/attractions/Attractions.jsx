import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Pagination, Select, MenuItem, FormControl, Button, TextField, InputAdornment, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AttractionCard from '@components/attractions/AttractionCard';
import { fetchAttractions } from '@services/AttractionService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('');
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const provinceRef = useRef(null);

  const [attractionTypeSearchTerm, setAttractionTypeSearchTerm] = useState('');
  const [isAttractionTypeDropdownOpen, setIsAttractionTypeDropdownOpen] = useState(false);
  const attractionTypeRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const provinceId = searchParams.get('provinceId');
    const attractionTypeId = searchParams.get('attractionTypeId');
    const applySearch = searchParams.get('applySearch');

    if (applySearch === 'true') {
      setSearchInput(name || '');
      setSelectedProvince(provinceId || 'all');
      setSelectedAttractionType(attractionTypeId || 'all');
      setSearchTerm(name || '');
      setPage(1);

      searchParams.delete('applySearch');
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

      fetchAttractionData({
        searchTerm: name || '',
        provinceIds: provinceId !== 'all' ? [provinceId] : [],
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!location.search.includes('applySearch=true')) {
      fetchAttractionData();
    }
    fetchProvinceData();
    fetchAttractionTypeData();
  }, [page, pageSize]);

  const fetchAttractionData = async (overrideParams = {}) => {
    try {
      setLoading(true);
      const params = {
        pageSize,
        pageIndex: page,
        searchTerm: overrideParams.searchTerm || searchTerm,
        provinceIds: overrideParams.provinceIds || (selectedProvince !== 'all' ? [selectedProvince] : []),
        attractionTypeIds: overrideParams.attractionTypeIds || (selectedAttractionType !== 'all' ? [selectedAttractionType] : []),
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
    setSearchTerm(searchInput);
    fetchAttractionData({
      searchTerm: searchInput,
      provinceIds: selectedProvince !== 'all' ? [selectedProvince] : [],
      attractionTypeIds: selectedAttractionType !== 'all' ? [selectedAttractionType] : [],
    });
  };

  const handleProvinceSearchChange = (event) => {
    setProvinceSearchTerm(event.target.value);
  };

  const handleProvinceSelect = (provinceId) => {
    setSelectedProvince(provinceId);
  };

  const handleProvinceDropdownToggle = () => {
    setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
    if (!isProvinceDropdownOpen) {
      setProvinceSearchTerm('');
    }
  };

  const handleAttractionTypeDropdownToggle = () => {
    setIsAttractionTypeDropdownOpen(!isAttractionTypeDropdownOpen);
    if (!isAttractionTypeDropdownOpen) {
      setAttractionTypeSearchTerm('');
    }
  };

  const handleAttractionTypeSearchChange = (event) => {
    setAttractionTypeSearchTerm(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (provinceRef.current && !provinceRef.current.contains(event.target)) {
      setIsProvinceDropdownOpen(false);
    }
    if (attractionTypeRef.current && !attractionTypeRef.current.contains(event.target)) {
      setIsAttractionTypeDropdownOpen(false);
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
          <Grid item xs={12} md={3.3}>
            <Box sx={{ position: 'sticky', top: 100, maxHeight: '100vh', minHeight: '77vh', overflowY: 'auto', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}>
              <Paper elevation={3} sx={{ borderRadius: '10px', pb: 2, maxHeight: '100vh', minHeight: '77vh' }}>
                <Typography variant="h5" sx={{ fontWeight: '500', textAlign: 'center', color: 'white', mb: 1, backgroundColor: '#3572EF', p: 2, width: '100%', borderRadius: '10px 10px 0 0', fontSize: '30px' }}>Bộ lọc</Typography>
                <Box sx={{ p: 3 }}>
                <FormControl fullWidth ref={provinceRef}>
                    <Typography sx={{ textAlign: 'left', color: 'black', mb: 1, fontSize: '18px' }}>Tỉnh thành</Typography>
                    <Box sx={{ position: 'relative' }}>
                      {!isProvinceDropdownOpen ? (
                        <Button
                          onClick={handleProvinceDropdownToggle}
                          sx={{
                            justifyContent: 'space-between', textAlign: 'left',
                            color: 'black', backgroundColor: 'white', border: '1px solid #ccc',
                            '&:hover': { borderRadius: '5px', backgroundColor: '#f5f5f5' },
                            height: '55px', width: '100%', textTransform: 'none', fontSize: '17px'
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
                            sx={{ mb: 1, '& .MuiInputBase-root': { height: '40px' } }}
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
                                    button key={province.provinceId}
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
                  <FormControl fullWidth sx={{ mt: 3.5 }} ref={attractionTypeRef}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, mt: 1, fontSize: '18px' }}>Loại điểm tham quan</Typography>
                    <Box sx={{ position: 'relative' }}>
                      {!isAttractionTypeDropdownOpen ? (
                        <Button
                          onClick={handleAttractionTypeDropdownToggle}
                          sx={{
                            justifyContent: 'space-between', textAlign: 'left', color: 'black',
                            backgroundColor: 'white', border: '1px solid #ccc',
                            '&:hover': { borderRadius: '5px', backgroundColor: '#f5f5f5' },
                            height: '55px', width: '100%', textTransform: 'none', fontSize: '17px'
                          }}
                        >
                          {selectedAttractionType === 'all' ? 'Tất cả' : attractionTypes.find(t => t.attractionTypeId === selectedAttractionType)?.name || 'Tất cả'}
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
                            placeholder="Tìm kiếm loại điểm tham quan..."
                            value={attractionTypeSearchTerm}
                            onChange={handleAttractionTypeSearchChange}
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
                              <ListItem button onClick={() => { setSelectedAttractionType('all'); handleAttractionTypeDropdownToggle(); }} sx={{ py: 0.5 }}>
                                <ListItemText primary="Tất cả" primaryTypographyProps={{ height: '1.3rem' }} />
                              </ListItem>
                              {attractionTypes
                                .filter(type => type.name.toLowerCase().includes(attractionTypeSearchTerm.toLowerCase()))
                                .map((type) => (
                                  <ListItem
                                    button
                                    key={type.attractionTypeId}
                                    onClick={() => { setSelectedAttractionType(type.attractionTypeId); handleAttractionTypeDropdownToggle(); }}
                                    selected={selectedAttractionType === type.attractionTypeId}
                                    sx={{ py: 0.5 }}
                                  >
                                    <ListItemText primary={type.name} primaryTypographyProps={{ height: '1.3rem' }} />
                                  </ListItem>
                                ))}
                            </List>
                          </Paper>
                        </Box>
                      )}
                    </Box>
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
          <Grid item xs={12} md={8.7}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'left', color: 'black' }}>
                {totalItems} kết quả
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {attractions.length > 0 ? (
                attractions.map((attraction) => (
                  <Grid item xs={12} md={6} key={attraction.attractionId}>
                    <AttractionCard attraction={attraction} />
                  </Grid>
                ))
              ) : (
                <Box sx={{ minHeight: '30rem', width: '100%' }}>
                  <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}>
                    Không tìm thấy điểm tham quan nào!
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

export default Attractions;
