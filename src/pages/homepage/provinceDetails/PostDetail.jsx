import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Breadcrumbs, Chip, Link, CardMedia, Grid, Paper } from '@mui/material';
import { Helmet } from 'react-helmet';
import { fetchPostById } from '@hooks/MockPost';
import RelatedPosts from '@components/post/RelatedPosts';
import EventDetails from '@components/post/EventDetails';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag } from '@fortawesome/free-solid-svg-icons';

const extractHeadings = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent,
        level: parseInt(heading.tagName.charAt(1))
    }));
};

const TableOfContents = ({ headings }) => (
    <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 80, maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', height: 'calc(100vh - 5rem)'}}>
        <Typography variant="h4" gutterBottom>Mục lục</Typography>
        <hr/>
        {headings.map((heading) => {
            const [isActive, setIsActive] = useState(false);

            useEffect(() => {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        setIsActive(entry.isIntersecting);
                    },
                    { threshold: 0.5 }
                );

                const element = document.getElementById(heading.id);
                if (element) {
                    observer.observe(element);
                }

                return () => {
                    if (element) {
                        observer.unobserve(element);
                    }
                };
            }, [heading.id]);

            return (
                <Link key={heading.id} href={`#${heading.id}`} underline="hover"
                    sx={{ display: 'block', ml: (heading.level - 1) * 2, mb: 1, color: isActive ? 'primary.main' : 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', fontWeight: isActive ? 'bold' : 'normal', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', }, }}>   
                    {heading.text.length > 100 ? `${heading.text.substring(0, 30)}...` : heading.text}
                </Link>
            );
        })}
    </Paper>
);

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [headings, setHeadings] = useState([]);
    const pageTopRef = useRef(null);

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            try {
                const fetchedPost = await fetchPostById(id);
                setPost(fetchedPost);
                setHeadings(extractHeadings(fetchedPost.content));
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

    const addIdsToHeadings = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
            heading.id = `heading-${index}`;
        });
        return doc.body.innerHTML;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
            <Helmet>
                <title>{post.title} | VietWayTour</title>
            </Helmet>
            <Header />
            <Box sx={{ p: 3, flexGrow: 1, mt: 5, maxWidth: '1200px', margin: '0 auto' }}>
                <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#05073C', marginBottom: '10px', textAlign: 'left' }}>
                    <Link to="/trang-chu" style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>Trang chủ</Link> 
                    &gt; <Link to={`/tinh/${post.provinceId}`} style={{ color: '#05073C', textDecoration: 'none', padding: '5px' }}>{post.provinceName}</Link> &gt; <strong>{post.title}</strong>
                </Typography>

                <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
                    {post.title}
                </Typography>

                <CardMedia component="img" height="400" image={post.imageUrl} alt={post.title} sx={{ mb: 2, borderRadius: 2 }} />

                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faTag} style={{ marginRight: '10px', color: '#3572EF' }} />
                    <Chip label={post.category} color="primary" sx={{ mr: 1 }} />
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginLeft: '20px', marginRight: '10px', color: '#3572EF' }} />
                    <Typography variant="body2" color="text.secondary" component="span">
                        Đăng ngày: {new Date(post.createDate).toLocaleDateString('vi-VN')}
                    </Typography>
                </Box>

                {post.isEvent && <EventDetails startDate={post.startDate} endDate={post.endDate} />}

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Box dangerouslySetInnerHTML={{ __html: addIdsToHeadings(post.content) }} sx={{ mt: 3 }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TableOfContents headings={headings} />
                    </Grid>
                </Grid>

                <RelatedPosts provinceId={post.provinceId} currentPostId={post.id} />
            </Box>
            <Footer />
        </Box>
    );
}
