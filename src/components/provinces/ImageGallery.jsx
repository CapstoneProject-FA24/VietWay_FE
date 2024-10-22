import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageIcon from '@mui/icons-material/Image';

const ImageGallery = ({ images, author }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dotsRef = useRef(null);
  const maxVisibleDots = 5;

  useEffect(() => {
    if (dotsRef.current) {
      const activeDot = dotsRef.current.querySelector('.active-dot');
      if (activeDot) {
        activeDot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const renderDots = () => {
    const totalDots = images.length;
    const dots = [];

    for (let i = 0; i < totalDots; i++) {
      const isActive = i === currentIndex;
      dots.push(
        <Box
          key={i}
          className={isActive ? 'active-dot' : ''}
          onClick={() => setCurrentIndex(i)}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: isActive ? 1 : 0.7,
            margin: '0 4px',
            transition: 'all 0.3s ease-in-out',
            transform: isActive ? 'scale(1.5)' : 'scale(1)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
      );
    }
    return dots;
  };

  return (
    <Box sx={{ borderRadius: 3, position: 'relative', height: '500px', overflow: 'hidden', '&:hover .MuiIconButton-root': { opacity: 1 } }}>
      <Box
        component="img"
        src={images[currentIndex]}
        alt={`Gallery image ${currentIndex + 1}`}
        sx={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          transition: 'transform 0.5s ease-in-out'
        }}
      />
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: 0,
          transition: 'opacity 0.3s', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: 0,
          transition: 'opacity 0.3s', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          color: 'white',
          padding: 2,
          paddingTop: 4,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Typography variant="body2"></Typography>
        <Box
          sx={{
            position: 'relative',
            width: '120px',
            overflow: 'hidden',
          }}
        >
          <Box
            ref={dotsRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              transition: 'transform 0.3s ease-in-out',
              transform: `translateX(${Math.max(0, Math.min(images.length - maxVisibleDots, currentIndex - Math.floor(maxVisibleDots / 2))) * -16}px)`,
            }}
          >
            {renderDots()}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', padding: '4px 8px' }}>
          <ImageIcon sx={{ marginRight: 1 }} />
          <Typography variant="body1">{images.length}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ImageGallery;
