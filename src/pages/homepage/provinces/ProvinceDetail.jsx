import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Container, Box, CircularProgress } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AttractionCard from '@components/provinces/AttractionCard';
import ImageGallery from '@components/provinces/ImageGallery';
import CategoryFilter from '@components/provinces/CategoryFilter';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import PostCard from '@components/provinces/PostCard';
import { Link } from 'react-router-dom';
import { fetchProvinceInfo } from '@services/ProvinceService';
import { fetchAttractions } from '@services/AttractionService';
import { fetchPosts } from '@services/PostService';
import { fetchPostCategories } from '@services/PostCategoryService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import { fetchTourTemplates } from '@services/TourTemplateService';
import { fetchTourCategory } from '@services/TourCategoryService';
import { Helmet } from 'react-helmet';
import TourCard from '@components/provinces/TourCard';
  
const ProvinceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [province, setProvince] = useState();
  const [attractions, setAttractions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tours, setTours] = useState([]);
  const [attractionCategories, setAttractionCategories] = useState([]);
  const [postCategories, setPostCategories] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [selectedAttractionType, setSelectedAttractionType] = useState('Tất cả');
  const [selectedPostCategory, setSelectedPostCategory] = useState('Tất cả');
  const [selectedTourCategory, setSelectedTourCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProvince();
    loadAttractions();
    loadPosts();
    loadTours();
  }, [id]);

  const loadProvince = async () => {
    try {
      setLoading(true);
      const response = await fetchProvinceInfo(id);
      setProvince(response);
    } catch (error) {
      console.error('Failed to fetch province info:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttractions = async (categoryId = null) => {
    try {
      const params = {
        pageSize: 6,
        pageIndex: 1,
        provinceIds: [id]
      };

      if (categoryId && categoryId !== 'Tất cả') {
        params.attractionTypeIds = [categoryId];
      }

      const response = await fetchAttractions(params);
      const categories = await fetchAttractionType();
      setAttractions(response.data);
      setAttractionCategories(categories);
    } catch (error) {
      console.error('Failed to fetch attractions:', error);
    }
  };

  const loadPosts = async (categoryId = null) => {
    try {
      const params = {
        pageSize: 6,
        pageIndex: 1,
        provinceIds: [id]
      };

      if (categoryId && categoryId !== 'Tất cả') {
        params.postCategoryIds = [categoryId];
      }

      const response = await fetchPosts(params);
      const categories = await fetchPostCategories();
      setPosts(response.data);
      setPostCategories(categories);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const loadTours = async (categoryId = null) => {
    console.log(categoryId);
    try {
      const params = {
        pageSize: 6,
        pageIndex: 1,
        provinceIds: [id]
      };

      if (categoryId && categoryId !== 'Tất cả') {
        params.templateCategoryIds = [categoryId];
      }

      const response = await fetchTourTemplates(params);
      const categories = await fetchTourCategory();
      const formattedCategories = categories.map(category => ({
        ...category,
        name: category.tourCategoryName
      }));
      setTours(response.data);
      setTourCategories(formattedCategories);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

  const renderAttractionCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    if (data.length > 0) {
      return data.slice(0, 6).map((attraction, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}><AttractionCard attraction={attraction} /></Grid>
      ));
    } else {
      return (
        <Typography gutterBottom sx={{ mt: 1, textAlign: 'center', width: '100%', color: 'grey', fontStyle: 'italic' }}> Không tìm thấy điểm tham quan phù hợp. </Typography>
      )
    }
  };

  const renderPostCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    if (data.length > 0) {
      return data.slice(0, 6).map((post, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}> <PostCard post={post} /> </Grid>
      ));
    } else {
      return (
        <Typography gutterBottom sx={{ mt: 1, textAlign: 'center', width: '100%', color: 'grey', fontStyle: 'italic' }}> Không tìm thấy bài viết phù hợp. </Typography>
      )
    }
  };

  const renderTourCards = (data) => {
    if (!data || !Array.isArray(data)) {
      return null;
    }
    if (data.length > 0) {
      return data.slice(0, 6).map((tour, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}> <TourCard tour={tour} /> </Grid>
      ));
    } else {
      return (
        <Typography gutterBottom sx={{ mt: 1, textAlign: 'center', width: '100%', color: 'grey', fontStyle: 'italic' }}> Không tìm thấy tour du lịch phù hợp. </Typography>
      )
    }
  };

  const handleViewMoreAttractions = () => {
    const searchParams = new URLSearchParams({
      provinceId: province.provinceId,
      applySearch: 'true'
    }).toString();
    navigate(`/diem-tham-quan?${searchParams}`);
  };

  const handleViewMorePosts = () => {
    const searchParams = new URLSearchParams({
      provinceId: province.provinceId,
      applySearch: 'true'
    }).toString();
    navigate(`/bai-viet?${searchParams}`);
  };

  const handleViewMoreTours = () => {
    const searchParams = new URLSearchParams({
      provinceId: province.provinceId,
      applySearch: 'true'
    }).toString();
    navigate(`/tour-du-lich?${searchParams}`);
  };

  const handleAttractionCategoryChange = (category) => {
    if (typeof category === 'string') {
      setSelectedAttractionType(category);
      const categoryId = category === 'Tất cả' ? null :
        attractionCategories.find(cat => cat.name === category)?.attractionTypeId;
      loadAttractions(categoryId);
    }
  };

  const handlePostCategoryChange = (category) => {
    if (typeof category === 'string') {
      setSelectedPostCategory(category);
      const categoryId = category === 'Tất cả' ? null :
        postCategories.find(cat => cat.name === category)?.postCategoryId;
      loadPosts(categoryId);
    }
  };

  const handleTourCategoryChange = (category) => {
    if (typeof category === 'string') {
      setSelectedTourCategory(category);
      const categoryId = category === 'Tất cả' ? null :
        tourCategories.find(cat => cat.name === category)?.tourCategoryId;
      loadTours(categoryId);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet> <title>Chi tiết tỉnh thành</title> </Helmet> <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!province) {
    return (
      <>
        <Helmet> <title>Không tìm thấy tỉnh thành</title> </Helmet> <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Không tìm thấy thông tin tỉnh thành</Typography>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '89vw' }}>
      <Helmet> <title>{province.provinceName}</title> </Helmet> <Header />
      {province && (
        <Box sx={{ ml: 5, mr: 5 }}>
          <ImageGallery images={province.imageUrls} />
          <Container maxWidth="xl" sx={{ mt: 5 }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
              {province.provinceName}
            </Typography>
            <Typography variant="body1" paragraph>
              Miêu tả về {province.provinceName}
            </Typography>
            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                Điểm đến nổi bật
              </Typography>
              <Box display="flex" alignItems="center" onClick={handleViewMoreAttractions} sx={{ cursor: 'pointer' }}>
                <Typography variant="body2" sx={{ color: 'grey', fontSize: '1rem' }}>
                  Xem thêm
                </Typography>
                <ChevronRightIcon sx={{ ml: 1, color: 'grey' }} />
              </Box>
            </Box>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={Array.isArray(attractionCategories) ? ['Tất cả', ...attractionCategories.map(cat => cat.name)] : ['Tất cả']}
                selectedCategory={selectedAttractionType}
                onCategoryChange={handleAttractionCategoryChange}
              />
            </Box>
            <Grid container spacing={2}>
              {renderAttractionCards(attractions)}
            </Grid>

            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                Khám phá {province.provinceName} qua các bài viết
              </Typography>
              <Box display="flex" alignItems="center" onClick={handleViewMorePosts} sx={{ cursor: 'pointer' }}>
                <Typography variant="body2" sx={{ color: 'grey', fontSize: '1rem' }}>
                  Xem thêm
                </Typography>
                <ChevronRightIcon sx={{ ml: 1, color: 'grey' }} />
              </Box>
            </Box>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={Array.isArray(postCategories) ? ['Tất cả', ...postCategories.map(cat => cat.name)] : ['Tất cả']}
                selectedCategory={selectedPostCategory}
                onCategoryChange={handlePostCategoryChange}
              />
            </Box>
            <Grid container spacing={2}>
              {renderPostCards(posts)}
            </Grid>

            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                Trải nghiệm hành trình đầy thú vị tại {province.provinceName} cùng Vietway
              </Typography>
              <Box display="flex" alignItems="center" onClick={handleViewMoreTours} sx={{ cursor: 'pointer' }}>
                <Typography variant="body2" sx={{ color: 'grey', fontSize: '1rem' }}>
                  Xem thêm
                </Typography>
                <ChevronRightIcon sx={{ ml: 1, color: 'grey' }} />
              </Box>
            </Box>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CategoryFilter
                categories={Array.isArray(tourCategories) ? ['Tất cả', ...tourCategories.map(cat => cat.name)] : ['Tất cả']}
                selectedCategory={selectedTourCategory}
                onCategoryChange={handleTourCategoryChange}
              />
            </Box>
            <Grid container spacing={2}>
              {renderTourCards(tours)}
            </Grid>
          </Container>
        </Box>
      )}
      <Footer />
    </Box>
  );
};

export default ProvinceDetail;
