import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Pagination, Select, MenuItem, FormControl, Button, TextField, InputAdornment, IconButton, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PostListCard from '@components/posts/PostListCard';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchPostCategories } from '@services/PostCategoryService';
import { fetchPosts } from '@services/PostService';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Posts = () => {
  const [posts, setPosts] = useState([]);
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
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const provinceRef = useRef(null);
  const categoryRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const title = searchParams.get('name');
    const provinceId = searchParams.get('provinceId');
    const postCategoryId = searchParams.get('postCategoryId');
    const applySearch = searchParams.get('applySearch');

    if (applySearch === 'true') {
      setSearchInput(title || '');
      setSelectedProvince(provinceId || 'all');
      setSelectedCategory(postCategoryId || 'all');
      setSearchTerm(title || '');
      setPage(1);

      searchParams.delete('applySearch');
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

      fetchPostData({
        searchTerm: title || '',
        provinceIds: provinceId !== 'all' ? provinceId === null || provinceId === '' ? null : [provinceId] : [],
        postCategoryIds: postCategoryId !== 'all' ? postCategoryId === null || postCategoryId === '' ? null : [postCategoryId] : [],
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!location.search.includes('applySearch=true')) {
      fetchPostData();
    }
    fetchProvinceData();
    fetchCategoryData();
  }, [page, pageSize]);

  const fetchPostData = async (overrideParams = {}) => {
    try {
      setLoading(true);
      const params = {
        pageSize,
        pageIndex: page,
        searchTerm: overrideParams.searchTerm || searchTerm,
        provinceIds: overrideParams.provinceIds || (selectedProvince !== 'all' ? [selectedProvince] : []),
        postCategoryIds: overrideParams.postCategoryIds || (selectedCategory !== 'all' ? [selectedCategory] : []),
      };
      const response = await fetchPosts(params);
      setPosts(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (error) {
      console.error("Error fetching posts:", error);
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
      const fetchedCategories = await fetchPostCategories();
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
    if (event.key === 'Enter') { handleSearch(); }
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
    fetchPostData({
      searchTerm: searchInput,
      provinceIds: selectedProvince !== 'all' ? [selectedProvince] : [],
      postCategoryIds: selectedCategory !== 'all' ? [selectedCategory] : [],
    });
  };

  const handleProvinceDropdownToggle = () => {
    setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
    if (!isProvinceDropdownOpen) { setProvinceSearchTerm(''); }
  };

  const handleProvinceSearchChange = (event) => {
    setProvinceSearchTerm(event.target.value);
  };

  const handleCategorySearchChange = (event) => {
    setCategorySearchTerm(event.target.value);
  };

  const handleCategoryDropdownToggle = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    if (!isCategoryDropdownOpen) { setCategorySearchTerm(''); }
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

  if (loading) {
    return (
      <>
        <Helmet> <title>Bài viết</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', ml: 1, mr: 1 }}>
      <Helmet><title>Bài viết</title></Helmet> <Header />
      <Box sx={{ flexGrow: 1, mt: 8 }}>
        <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', textAlign: 'left', mb: 2 }}>
          <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link> &gt; <strong>Bài viết</strong>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              Khám phá các bài viết
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth variant="outlined" placeholder="Tìm kiếm bài viết..." value={searchInput}
              onChange={handleSearchInputChange} onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end"> <SearchIcon /> </IconButton>
                  </InputAdornment>
                ),
              }} sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
            />
          </Grid>
          <Grid item xs={12} md={3.7}>
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
                            fullWidth variant="outlined" placeholder="Tìm kiếm tỉnh thành..."
                            value={provinceSearchTerm} onChange={handleProvinceSearchChange}
                            InputProps={{
                              startAdornment: (<InputAdornment position="start"> <SearchIcon /> </InputAdornment>),
                            }} sx={{ mb: 1, '& .MuiInputBase-root': { height: '40px' } }}
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
                  <FormControl fullWidth sx={{ mt: 3.5 }} ref={categoryRef}>
                    <Typography sx={{ fontWeight: '500', textAlign: 'left', color: 'black', mb: 1, mt: 1, fontSize: '18px' }}>Danh mục</Typography>
                    <Box sx={{ position: 'relative' }}>
                      {!isCategoryDropdownOpen ? (
                        <Button
                          onClick={handleCategoryDropdownToggle}
                          sx={{
                            justifyContent: 'space-between', textAlign: 'left', color: 'black',
                            backgroundColor: 'white', border: '1px solid #ccc',
                            '&:hover': { borderRadius: '5px', backgroundColor: '#f5f5f5' },
                            height: '55px', width: '100%', textTransform: 'none', fontSize: '17px'
                          }}
                        >
                          {selectedCategory === 'all' ? 'Tất cả' : categories.find(c => c.postCategoryId === selectedCategory)?.name || 'Tất cả'}
                          <ExpandMoreIcon />
                        </Button>
                      ) : (
                        <Box sx={{
                          position: 'absolute', left: 0, right: 0, zIndex: 1000, backgroundColor: 'white', borderRadius: '10px',
                          boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
                        }}>
                          <TextField
                            fullWidth variant="outlined" placeholder="Tìm kiếm danh mục..."
                            value={categorySearchTerm} onChange={handleCategorySearchChange}
                            InputProps={{
                              startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ),
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
                                    button key={category.postCategoryId}
                                    onClick={() => { setSelectedCategory(category.postCategoryId); handleCategoryDropdownToggle(); }}
                                    selected={selectedCategory === category.postCategoryId} sx={{ py: 0.5 }}
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
              <Typography sx={{ textAlign: 'left', color: 'black' }}> {totalItems} kết quả </Typography>
            </Box>
            <Grid container spacing={2}>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Grid item xs={12} md={6} key={post.postId}> <PostListCard post={post} /> </Grid>
                ))
              ) : (
                <Box sx={{ minHeight: '30rem', width: '100%' }}>
                  <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}> Không tìm thấy bài viết nào!</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                    <img src="/location-not-found.png" alt="No results found" style={{ maxWidth: '300px', height: 'auto' }} />
                  </Box>
                </Box>
              )}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Pagination count={Math.ceil(totalItems / pageSize)} page={page} onChange={handlePageChange} color="primary" sx={{ m: '0 auto' }} />
              <Select value={pageSize} onChange={handlePageSizeChange} variant="outlined" sx={{ height: '40px' }} >
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

export default Posts;
