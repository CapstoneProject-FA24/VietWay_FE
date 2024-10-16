import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Chip } from '@mui/material';

const PostCard = ({ title, description, image, category, postDate }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
    <CardMedia component="img" height="220" image={image} alt={title} />
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Chip label={category} color="primary" size="small" sx={{ mb: 1 }} />
      <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
        {postDate}
      </Typography>
    </CardContent>
  </Card>
);

const PostsGrid = ({ posts }) => (
  <Grid container spacing={3}>
    {posts.slice(0, 4).map((post, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <PostCard {...post} />
      </Grid>
    ))}
  </Grid>
);

export { PostCard, PostsGrid };
