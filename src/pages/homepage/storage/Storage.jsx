import React, { useState, useEffect } from 'react';
import { Container, Box, Tabs, Tab, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Alert, Pagination } from '@mui/material';
import AttractionStorageCard from '@components/saved/AttractionStorageCard';
import PostStorageCard from '@components/saved/PostStorageCard';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { Helmet } from 'react-helmet';
import { CircularProgress, Button, Checkbox, IconButton } from '@mui/material';
import { getLikedAttractions } from '@services/AttractionService';
import { getCookie } from '@services/AuthenService';
import { likeAttraction } from '@services/AttractionService';
import { fetchLikedPosts, likePost } from '@services/PostService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchPostCategories } from '@services/PostCategoryService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import { useNavigate } from 'react-router-dom';

const Storage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedProvince, setSelectedProvince] = useState('all');
    const [selectedAttractionType, setSelectedAttractionType] = useState('all');
    const [selectedPostProvince, setSelectedPostProvince] = useState('all');
    const [selectedPostType, setSelectedPostType] = useState('all');
    const [savedAttractions, setSavedAttractions] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [attractionSort, setAttractionSort] = useState('newest');
    const [postSort, setPostSort] = useState('newest');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [postCategories, setPostCategories] = useState([]);
    const [attractionTypes, setAttractionTypes] = useState([]);
    const [attractionPage, setAttractionPage] = useState(1);
    const [postPage, setPostPage] = useState(1);
    const [attractionTotal, setAttractionTotal] = useState(0);
    const [postTotal, setPostTotal] = useState(0);
    const PAGE_SIZE = 9; // Items per page
    const navigate = useNavigate();

    useEffect(() => {
        const customerToken = getCookie('customerToken');
        if (!customerToken) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        const fetchSavedItems = async () => {
            try {
                const customerToken = getCookie('customerToken');
                if (customerToken) {
                    // Fetch liked attractions
                    const attractionsResponse = await getLikedAttractions(PAGE_SIZE, attractionPage);
                    const serverAttractions = attractionsResponse.data.items.map(item => ({
                        attractionId: item.attractionId,
                        name: item.name,
                        address: item.address,
                        province: item.province,
                        attractionType: item.attractionCategory,
                        imageUrl: item.imageUrl,
                        createdAt: item.createdDate
                    }));
                    setSavedAttractions(serverAttractions);
                    setAttractionTotal(attractionsResponse.data.total);

                    // Fetch liked posts
                    const postsResponse = await fetchLikedPosts(PAGE_SIZE, postPage);
                    const serverPosts = postsResponse.items.map(item => ({
                        postId: item.postId,
                        title: item.title,
                        imageUrl: item.imageUrl,
                        postCategory: item.postCategoryName,
                        provinceName: item.provinceName,
                        description: item.description,
                        createdAt: item.createdAt
                    }));
                    setSavedPosts(serverPosts);
                    setPostTotal(postsResponse.total);
                } else {
                    setSavedAttractions([]);
                    setSavedPosts([]);
                }
            } catch (error) {
                console.error('Error fetching saved items:', error);
                setApiError(true);
                setSavedAttractions([]);
                setSavedPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedItems();
    }, [attractionPage, postPage]); // Refetch when page changes

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                // Fetch all filter data in parallel
                const [
                    provincesData,
                    postCategoriesData,
                    attractionTypesData
                ] = await Promise.all([
                    fetchProvinces(),
                    fetchPostCategories(),
                    fetchAttractionType()
                ]);

                setProvinces(provincesData);
                setPostCategories(postCategoriesData);
                setAttractionTypes(attractionTypesData);
            } catch (error) {
                console.error('Error fetching filter data:', error);
                setApiError(true);
            }
        };

        fetchFilterData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const sortItems = (items, sortType) => {
        const sortedItems = [...items];
        switch (sortType) {
            case 'a-z':
                return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
            case 'z-a':
                return sortedItems.sort((a, b) => b.title.localeCompare(a.title));
            case 'newest':
                return sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sortedItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            default:
                return sortedItems;
        }
    };

    const filteredAttractions = sortItems(
        savedAttractions.filter(attraction => {
            const matchProvince = selectedProvince === 'all' || attraction.province === selectedProvince;
            const matchType = selectedAttractionType === 'all' || attraction.attractionType === selectedAttractionType;
            return matchProvince && matchType;
        }),
        attractionSort
    );

    const filteredPosts = sortItems(
        savedPosts.filter(post => {
            const matchProvince = selectedPostProvince === 'all' || post.provinceName === selectedPostProvince;
            const matchType = selectedPostType === 'all' || post.postCategory === selectedPostType;
            return matchProvince && matchType;
        }),
        postSort
    );

    const SortSelect = ({ value, onChange }) => (
        <FormControl fullWidth size="small">
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
                value={value}
                label="Sắp xếp theo"
                onChange={onChange}
            >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="oldest">Cũ nhất</MenuItem>
                <MenuItem value="a-z">A-Z</MenuItem>
                <MenuItem value="z-a">Z-A</MenuItem>
            </Select>
        </FormControl>
    );

    const handleEditMode = () => {
        setIsEditMode(!isEditMode);
        setSelectedItems([]); // Clear selections when toggling edit mode
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            }
            return [...prev, itemId];
        });
    };

    const handleRemoveSelected = async () => {
        try {
            if (activeTab === 0) {
                // Unlike attractions
                for (const attractionId of selectedItems) {
                    await likeAttraction(attractionId, false);
                }
                setSavedAttractions(prev => prev.filter(item => !selectedItems.includes(item.attractionId)));
            } else {
                // Unlike posts
                for (const postId of selectedItems) {
                    await likePost(postId, false);
                }
                setSavedPosts(prev => prev.filter(item => !selectedItems.includes(item.postId)));
            }
            
            setSelectedItems([]);
            setIsEditMode(false);
            
            // Show success notification
            setNotificationMessage(`Đã xóa các ${activeTab === 0 ? 'điểm tham quan' : 'bài viết'} khỏi danh sách yêu thích`);
            setShowNotification(true);
        } catch (error) {
            console.error('Error removing items:', error);
            setApiError(true);
            setNotificationMessage(`Không thể xóa một số ${activeTab === 0 ? 'điểm tham quan' : 'bài viết'}. Vui lòng thử lại sau`);
            setShowNotification(true);
        }
    };

    const renderActionButtons = () => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Đã lưu {activeTab === 0 ? filteredAttractions.length : filteredPosts.length} {activeTab === 0 ? 'điểm tham quan' : 'bài viết'}
            </Typography>
            <Box>
                {isEditMode ? (
                    <>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={handleRemoveSelected}
                            disabled={selectedItems.length === 0}
                            sx={{ mr: 2 }}
                        >
                            Bỏ lưu ({selectedItems.length})
                        </Button>
                        <Button variant="outlined" onClick={handleEditMode}>
                            Hủy
                        </Button>
                    </>
                ) : (
                    <Button variant="outlined" onClick={handleEditMode}>
                        Chỉnh sửa
                    </Button>
                )}
            </Box>
        </Box>
    );

    // Optional: Add error message display
    const renderErrorMessage = () => {
        if (apiError) {
            return (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Không thể kết nối với máy chủ. Đang hiển thị dữ liệu từ bộ nhớ cục bộ.
                </Alert>
            );
        }
        return null;
    };

    const handleAttractionPageChange = (event, newPage) => {
        setAttractionPage(newPage);
    };

    const handlePostPageChange = (event, newPage) => {
        setPostPage(newPage);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '89vw' }}>
                <Helmet><title>Lưu trữ</title></Helmet>
                <Header />
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexGrow: 1 
                }}>
                    <CircularProgress />
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '89vw' }}>
            <Helmet><title>Lưu trữ</title></Helmet>
            <Header />
            
            <Box sx={{ 
                flexGrow: 1,
                mt: 8,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 'calc(100vh - 64px - 8rem)'
            }}>
                <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontSize: '2.5rem', fontFamily: 'Inter, sans-serif', color: '#05073C', mb: 3 }}>
                        CÁC MỤC ĐÃ LƯU
                    </Typography>
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label="ĐIỂM THAM QUAN" sx={{ fontWeight: 600, fontSize: '1rem' }} />
                        <Tab label="BÀI VIẾT" sx={{ fontWeight: 600, fontSize: '1rem' }} />
                    </Tabs>

                    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
                        {activeTab === 0 && (
                            <Box>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Tỉnh thành</InputLabel>
                                            <Select value={selectedProvince} label="Tỉnh thành" onChange={(e) => setSelectedProvince(e.target.value)}>
                                                <MenuItem value="all">Tất cả</MenuItem>
                                                {provinces.map((province) => (
                                                    <MenuItem key={province.provinceId} value={province.provinceName}>
                                                        {province.provinceName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Loại điểm tham quan</InputLabel>
                                            <Select value={selectedAttractionType} label="Loại điểm tham quan" onChange={(e) => setSelectedAttractionType(e.target.value)}>
                                                <MenuItem value="all">Tất cả</MenuItem>
                                                {attractionTypes.map((type) => (
                                                    <MenuItem key={type.attractionTypeId} value={type.name}>
                                                        {type.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <SortSelect value={attractionSort} onChange={(e) => setAttractionSort(e.target.value)} />
                                    </Grid>
                                </Grid>

                                {renderActionButtons()}

                                <Grid container spacing={3}>
                                    {filteredAttractions.length > 0 ? (
                                        <>
                                            {filteredAttractions.map((attraction) => (
                                                <Grid item xs={12} sm={6} md={4} key={attraction.attractionId}>
                                                    <AttractionStorageCard 
                                                        attraction={attraction}
                                                        isEditMode={isEditMode}
                                                        isSelected={selectedItems.includes(attraction.attractionId)}
                                                        onSelect={() => handleSelectItem(attraction.attractionId)}
                                                    />
                                                </Grid>
                                            ))}
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                                    <Pagination 
                                                        count={Math.ceil(attractionTotal / PAGE_SIZE)}
                                                        page={attractionPage}
                                                        onChange={handleAttractionPageChange}
                                                        color="primary"
                                                    />
                                                </Box>
                                            </Grid>
                                        </>
                                    ) : (
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <Typography sx={{ fontSize: '2rem', textAlign: 'center', p: 5 }}>
                                                Không tìm thấy điểm tham quan phù hợp!
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                                <img src="/location-not-found.png" alt="No attractions found" style={{ maxWidth: '300px', height: 'auto' }} />
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        )}

                        {activeTab === 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Tỉnh thành</InputLabel>
                                            <Select value={selectedPostProvince} label="Tỉnh thành" onChange={(e) => setSelectedPostProvince(e.target.value)}>
                                                <MenuItem value="all">Tất cả</MenuItem>
                                                {provinces.map((province) => (
                                                    <MenuItem key={province.provinceId} value={province.provinceName}>
                                                        {province.provinceName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Loại bài viết</InputLabel>
                                            <Select value={selectedPostType} label="Loại bài viết" onChange={(e) => setSelectedPostType(e.target.value)}>
                                                <MenuItem value="all">Tất cả</MenuItem>
                                                {postCategories.map((category) => (
                                                    <MenuItem key={category.postCategoryId} value={category.name}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <SortSelect value={postSort} onChange={(e) => setPostSort(e.target.value)} />
                                    </Grid>
                                </Grid>

                                {renderActionButtons()}

                                <Grid container spacing={2}>
                                    {filteredPosts.length > 0 ? (
                                        <>
                                            {filteredPosts.map((post) => (
                                                <Grid item xs={12} md={6} lg={4} key={post.postId}>
                                                    <PostStorageCard 
                                                        post={post}
                                                        isEditMode={isEditMode}
                                                        isSelected={selectedItems.includes(post.postId)}
                                                        onSelect={() => handleSelectItem(post.postId)}
                                                    />
                                                </Grid>
                                            ))}
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                                    <Pagination 
                                                        count={Math.ceil(postTotal / PAGE_SIZE)}
                                                        page={postPage}
                                                        onChange={handlePostPageChange}
                                                        color="primary"
                                                    />
                                                </Box>
                                            </Grid>
                                        </>
                                    ) : (
                                        <Box sx={{ minHeight: '30rem', width: '100%' }}>
                                            <Typography sx={{ fontSize: '2rem', textAlign: 'center', width: '100%', p: 5 }}>
                                                Không tìm thấy bài viết phù hợp!
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                                                <img src="/post-not-found.png" alt="No posts found" style={{ maxWidth: '300px', height: 'auto' }} />
                                            </Box>
                                        </Box>
                                    )}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default Storage;
