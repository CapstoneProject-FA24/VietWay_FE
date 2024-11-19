import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function NotFound() {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: '100vh',
          minHeight: '100vh',
          textAlign: 'center',
          marginTop: '-120px',
          gap: 3 // Adds space between elements
        }}
      >
        <Box
          component="img"
          src="/404.png"
          alt="404 Error"
          sx={{
            maxWidth: '100%',
            height: 'auto',
            width: 'auto'
          }}
        />
        
        <Typography 
          variant="h4" 
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            marginTop: '-70px',
            maxWidth: 'auto'
          }}
        >
          Úi! Lỗi đã xảy ra với trang web, bạn hãy quay lại sau nhé!
        </Typography>
      </Box>
    </Container>
  );
}
