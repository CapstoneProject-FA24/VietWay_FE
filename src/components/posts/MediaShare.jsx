import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkIcon from '@mui/icons-material/Link';
import TwitterIcon from '@mui/icons-material/Twitter';

const MediaShare = ({ tourName }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(tourName);

  // Share URLs based on search results
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer.php?u=${encodedUrl}`,
    instagram: `instagram://share?url=${encodedUrl}`, // Note: Instagram sharing is limited on web
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'center', alignItems: 'center', mb: 1, mt: -1, ml: -1 }}>
      <Tooltip title="Chia sẻ qua Facebook">
        <IconButton 
          onClick={() => window.open(shareLinks.facebook, '_blank')}
          sx={{ color: 'gray', width: 40, height: 40 }}
        >
          <FacebookIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Chia sẻ qua Instagram">
        <IconButton 
          onClick={() => window.open(shareLinks.instagram)}
          sx={{ color: 'gray', width: 40, height: 40 }}
        >
          <InstagramIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Chia sẻ qua X">
        <IconButton 
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          sx={{ color: 'gray', width: 40, height: 40 }}
        >
          <TwitterIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Sao chép liên kết">
        <IconButton 
          onClick={handleCopyLink}
          sx={{ color: 'gray', width: 40, height: 40 }}
        >
          <LinkIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Tooltip>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Đã sao chép liên kết!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MediaShare;