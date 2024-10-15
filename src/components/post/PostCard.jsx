import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    return (
        <Card sx={{ maxWidth: 345, m: 1 }}>
            <CardActionArea component={Link} to={`/post/${post.id}`}>
                <CardMedia
                    component="img"
                    height="140"
                    image={post.imageUrl}
                    alt={post.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {post.category} | {new Date(post.createDate).toLocaleDateString('vi-VN')}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
