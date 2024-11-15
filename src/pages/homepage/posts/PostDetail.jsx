import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Chip, CardMedia, Grid, Container, Snackbar, Alert, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import { fetchPostById } from '@services/PostService';
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

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const pageTopRef = useRef(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [savedCount, setSavedCount] = useState(0);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('success');
    const TEN_MINUTES = 10 * 60 * 1000;
    const [openUnsaveDialog, setOpenUnsaveDialog] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            try {
                const fetchedPost = await fetchPostById(id);
                setPost(fetchedPost);
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
        try {
            if (isSaved) {
                setOpenUnsaveDialog(true);
                return;
            }
            
            setIsSaved(true);
            setShowNotification(true);
            setSavedCount(prev => prev + 1);
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const handleNotificationClick = () => {
        setIsSaved(true);
        setShowNotification(false);
    };

    const handleOpenStorage = (e) => {
        e.preventDefault();
        window.open('/luu-tru', '_blank', 'noopener,noreferrer');
    };

    const handleConfirmUnsave = () => {
        setIsSaved(false);
        setShowNotification(true);
        setSavedCount(prev => Math.max(0, prev - 1));
        setOpenUnsaveDialog(false);
    };

    const handleCloseUnsaveDialog = () => {
        setOpenUnsaveDialog(false);
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
                </Grid>

                {/* Related Posts */}
                <Box sx={{ mt: 8, mb: 10, ml: 9.5 }}>
                    <RelatedPosts provinceId={post.provinceId} currentPostId={post.id} />
                </Box>
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
                    severity="success"
                    sx={{ 
                        width: '100%', 
                        bgcolor: 'rgba(0, 0, 0, 0.8)', 
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
                        '& .MuiAlert-icon': { 
                            color: '#4caf50'
                        },
                        '& .MuiSvgIcon-root': { 
                            color: 'white'
                        },
                        fontSize: '0.95rem',
                        py: 1.5
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Đã lưu vào lưu trữ của bạn ({savedCount} bài viết) - 
                        <Box
                            component="span"
                            onClick={handleOpenStorage}
                            sx={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                        >
                            Mở lưu trữ
                        </Box>
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
