import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Avatar } from '@mui/material';

const PostCard = ({ title, description, image, category, author, date }) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  }}>
    <CardMedia
      component="img"
      height="200"
      image={image}
      alt={title}
    />
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="bold">
        {category}
      </Typography>
      <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {description}
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
