import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Chip, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <CardActionArea component={Link} to={`/bai-viet/${post.id}`}>
        <CardMedia component="img" height="220" image={post.image} alt={post.title} />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Chip label={post.category} color="primary" size="small" sx={{ mb: 1 }} />
          <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.description}
          </Typography>
          {post.createDate && (
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
              {new Date(post.createDate).toLocaleDateString('vi-VN')}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function PostsGrid({ posts, title }) {
  return (
    <>
      {title && (
        <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          {title}
        </Typography>
      )}
      <Grid container spacing={3}>
        {posts.slice(0, 4).map((post, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
