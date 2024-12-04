import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Chip, CardMedia, Grid, Container, Snackbar, Alert, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import { fetchPostById, likePost } from '@services/PostService';
import { getCookie } from '@services/AuthenService';
import RelatedPosts from '@components/posts/RelatedPosts';
import EventDetails from '@components/posts/EventDetails';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import MediaShare from '@components/posts/MediaShare';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { CircularProgress } from '@mui/material';
import UnsavedConfirmPopup from '@components/saved/UnsavedConfirmPopup';

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const pageTopRef = useRef(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [openUnsaveDialog, setOpenUnsaveDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isApiError, setIsApiError] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            try {
                const fetchedPost = await fetchPostById(id);
                setPost(fetchedPost);
                setIsSaved(fetchedPost.isLiked);
            } catch (error) {
                console.error("Error fetching post data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id]);

    useEffect(() => {
        if (pageTopRef.current) {
            pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [post]);

    const handleBookmarkClick = async () => {
        const customerToken = getCookie('customerToken');
        if (!customerToken) {
            setIsApiError(true);
            setAlertMessage('Vui lòng đăng nhập để lưu bài viết');
            setShowNotification(true);
            return;
        }

        try {
            if (isSaved) {
                setOpenUnsaveDialog(true);
                return;
            }

            await likePost(post.id, true);
            setIsSaved(true);
            setAlertMessage('Đã lưu vào lưu trữ của bạn');
            setShowNotification(true);
            setIsApiError(false);
        } catch (error) {
            console.error('Error bookmarking post:', error);
            setIsApiError(true);
            setAlertMessage('Không thể lưu bài viết. Vui lòng thử lại sau');
            setShowNotification(true);
        }
    };

    const handleConfirmUnsave = async () => {
        try {
            await likePost(post.id, false);
            setIsSaved(false);
            setAlertMessage('Đã xóa khỏi lưu trữ của bạn');
            setShowNotification(true);
            setOpenUnsaveDialog(false);
            setIsApiError(false);
        } catch (error) {
            console.error('Error handling unsave:', error);
            setIsApiError(true);
            setAlertMessage('Không thể xóa bài viết. Vui lòng thử lại sau');
            setShowNotification(true);
        }
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const handleCloseUnsaveDialog = () => {
        setOpenUnsaveDialog(false);
    };

    const handleOpenStorage = () => {
        navigate('/storage');
    };

    if (loading) {
        return (
            <>
                <Helmet> <title>Chi tiết bài viết</title> </Helmet> <Header />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <CircularProgress /> </Box>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Header />
                <Helmet>
                    <title>Không tìm thấy bài viết</title>
                </Helmet>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4">Không tìm thấy thông tin bài viết</Typography>
                </Box>
            </>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '98vh', width: '99.6%' }} ref={pageTopRef}>
            <Helmet>
                <title>{post.title}</title>
            </Helmet>
            <Header />

            <Box sx={{
                position: 'relative',
                width: '99vw',
                ml: '-65px',
                height: { xs: '400px', md: '70vh' },
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '30%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                }
            }}>
                <CardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(1.1)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.15)'
                        }
                    }}
                />
            </Box>

            {/* Main Content */}
            <Container
                disableGutters={true}
                sx={{
                    mt: -12,
                    ml: -7,
                    position: 'relative',
                    zIndex: 2,
                    width: '98vw',
                    maxWidth: '98vw !important',
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={9}>
                        <Box sx={{
                            bgcolor: 'white',
                            padding: { xs: 3, md: 5 },
                            borderRadius: 2,
                            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                            overflow: 'hidden'
                        }}>

                            {/* Bookmark Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={handleBookmarkClick} variant="outlined"
                                    sx={{
                                        color: 'black',
                                        marginLeft: 'auto',
                                        borderColor: 'black',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'black',
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }, padding: '6px 16px'
                                    }}
                                    startIcon={isSaved ?
                                        <BookmarkIcon sx={{ color: 'primary.main' }} /> :
                                        <BookmarkBorderIcon />
                                    }
                                >
                                    Đánh dấu
                                </Button>
                            </Box>

                            {/* Title Section */}
                            <Box sx={{ p: { xs: 3, md: 5 } }}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        fontWeight: 700,
                                        color: '#1A1A1A',
                                        mb: 3,
                                        lineHeight: 1.2,
                                        letterSpacing: '-0.02em',
                                        fontFamily: '"Tinos", serif'
                                    }}
                                >
                                    {post.title}
                                </Typography>

                                {/* Meta Info */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    mb: 4,
                                    flexWrap: 'wrap'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FontAwesomeIcon icon={faTag} style={{ color: '#666' }} />
                                        <Chip
                                            label={post.category}
                                            sx={{
                                                bgcolor: '#f5f5f5',
                                                color: '#666',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    bgcolor: '#eeeeee'
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#666' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(post.createDate).toLocaleDateString('vi-VN')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FontAwesomeIcon icon={faMapLocation} style={{ color: '#666' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {post.provinceName}
                                        </Typography>
                                    </Box>
                                </Box>

                                <MediaShare postTitle={post.title} />

                                {post.isEvent && <EventDetails startDate={post.startDate} endDate={post.endDate} />}
                            </Box>

                            {/* Article Content */}
                            <Box
                                sx={{
                                    mt: -5,
                                    p: { xs: 3, md: 5 },
                                    '& p': {
                                        fontSize: '1.2rem',
                                        lineHeight: 1.8,
                                        color: '#333',
                                        mb: 4,
                                        fontFamily: '"Inter", sans-serif'
                                    },
                                    '& h2': {
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        color: '#1A1A1A',
                                        mt: 6,
                                        mb: 4,
                                        letterSpacing: '-0.02em'
                                    },
                                    '& h3': {
                                        fontSize: '1.75rem',
                                        fontWeight: 600,
                                        color: '#1A1A1A',
                                        mt: 5,
                                        mb: 3
                                    },
                                    '& img': {
                                        width: '100%',
                                        borderRadius: 2,
                                        my: 5,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    },
                                    '& a': {
                                        color: '#0066CC',
                                        textDecoration: 'none',
                                        borderBottom: '1px solid transparent',
                                        transition: 'border-color 0.2s',
                                        '&:hover': {
                                            borderBottomColor: '#0066CC'
                                        }
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={11} md={11}>
                        <RelatedPosts provinceId={post.provinceId} currentPostId={post.id} />
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    '& .MuiPaper-root': {
                        minWidth: '300px'
                    }
                }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={isApiError ? "error" : "success"}
                    sx={{
                        width: '100%', mt: 10,
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '& .MuiAlert-icon': {
                            color: isApiError ? '#f44336' : '#4caf50'
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'white'
                        },
                        fontSize: '0.95rem',
                        py: 1.5
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {alertMessage} {!isApiError && getCookie('customerToken') && (
                            <> -
                                <Box
                                    component="span"
                                    onClick={handleOpenStorage}
                                    sx={{
                                        textDecoration: 'underline',
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.8
                                        }
                                    }}
                                >
                                    Mở lưu trữ
                                </Box>
                            </>
                        )}
                    </Box>
                </Alert>
            </Snackbar>

            <UnsavedConfirmPopup
                open={openUnsaveDialog}
                onClose={handleCloseUnsaveDialog}
                onConfirm={handleConfirmUnsave}
            />

            <Footer />
        </Box>
    );
}
