import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Chip, Link, CardMedia, Grid, Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import { fetchPostById } from '@hooks/MockPost';
import RelatedPosts from '@components/posts/RelatedPosts';
import EventDetails from '@components/posts/EventDetails';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import MediaShare from '@components/posts/MediaShare';

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const pageTopRef = useRef(null);

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

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!post) {
        return <Typography>Post not found</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
            <Helmet>
                <title>{post.title} | VietWayTour</title>
            </Helmet>
            <Header />
            
            {/* Hero Section with Image */}
            <Box sx={{ 
                position: 'relative',
                width: '95vw',
                ml: '-2vw',
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
                    ml: -9.5,
                    position: 'relative', 
                    zIndex: 2,
                    width: '100vw',
                    maxWidth: '100vw !important',
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={8}>
                        {/* Breadcrumb */}
                        {/*<Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#fff',
                                mb: 2,
                                '& a': {
                                    color: '#fff',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }
                            }}
                        >
                            <Link href="/trang-chu">Trang chủ</Link> 
                            {' > '} 
                            <Link href={`/tinh/${post.provinceId}`}>{post.provinceName}</Link>
                        </Typography>

                        {/* Article Container */}
                        <Box sx={{ 
                            bgcolor: 'white',
                            padding: { xs: 3, md: 5 },
                            borderRadius: 2,
                            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                            overflow: 'hidden'
                        }}>
                            {/* Title Section */}
                            <Box sx={{ p: { xs: 3, md: 5 } }}>
                                <Typography 
                                    variant="h1" 
                                    sx={{ 
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        fontWeight: 800,
                                        color: '#1A1A1A',
                                        mb: 3,
                                        lineHeight: 1.2,
                                        letterSpacing: '-0.02em'
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
                                </Box>

                                <MediaShare postTitle={post.title} />

                                {post.isEvent && <EventDetails startDate={post.startDate} endDate={post.endDate} />}
                            </Box>

                            {/* Article Content */}
                            <Box 
                                sx={{ 
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
                <Box sx={{ mt: 8, mb: 10 }}>
                    <RelatedPosts provinceId={post.provinceId} currentPostId={post.id} />
                </Box>
            </Container>
            <Footer />
        </Box>
    );
}
