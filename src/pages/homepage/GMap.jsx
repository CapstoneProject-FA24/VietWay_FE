import React, { useState, useEffect } from 'react';import { Box, Container, Grid, Typography, Paper, Button, CircularProgress, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import Map from '@components/Map';

const GMap = () => {


  return (
    <Box sx={{ width: '100vw', height: '100vh', m: '-60px' }}>
        <Map />
    </Box>
  );
};

export default GMap;