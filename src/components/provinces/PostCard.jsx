import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Chip, Box, Slide } from '@mui/material';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      component={Link} to={`/bai-viet/${post.postId}`}
      sx={{
        maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '10px',
        overflow: 'hidden', boxShadow: '0 0px 8px rgba(0,0,0,0.3)', position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardMedia component="img" height="270" image={post.imageUrl} alt={post.title} sx={{ objectFit: 'cover' }} />
      <Box sx={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: isHovered ? 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.85) 65%)' :
          'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.9) 85%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px'
      }}>
        {/* <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
        </Typography> */}
        <Typography variant="h4" component="div" sx={{
          fontWeight: 'bold', fontSize: '1.3rem', color: 'white', marginBottom: '4px',
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>
          {post.title}
        </Typography>
        {isHovered && (
          <Slide direction="up" in={isHovered}>
            <Typography variant="body2" sx={{
              fontSize: '0.9rem', color: 'lightGray',
              overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
            }}>
              {post.description}
            </Typography>
          </Slide>
        )}
      </Box>
      <CardContent sx={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        padding: 0,
      }}>
        <Chip
          label={post.postCategory} size="medium" sx={{
            fontSize: '0.75rem', fontWeight: 'bold',
            bgcolor: 'rgba(255,255,255,0.8)', color: 'black', height: '25px'
          }} />
      </CardContent>
    </Card>
  );
}

export default PostCard;