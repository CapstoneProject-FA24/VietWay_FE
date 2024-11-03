import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Backdrop,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderCard from './FolderCard';

const SideInnerFolderTab = ({ onClose, onBack, folderData, newAttraction }) => {
  const drawerStyles = { width: 550, height: '100vh', bgcolor: 'background.paper', boxShadow: 1, position: 'fixed', right: 0, top: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, zIndex: 1201, overflowY: 'auto', animation: 'slideIn 0.3s ease-out' };

  // Combine new attraction with existing folder items if present
  const folderItems = [
    ...(newAttraction ? [newAttraction] : []),
    ...(folderData?.items || [])
  ];

  return (
    <>
      <Backdrop
        open={true}
        onClick={onClose}
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
          zIndex: 1200,
        }}
      />
      
      <Box sx={drawerStyles}>
        <Box sx={{ p: 2, borderBottom: 2, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
            {folderData?.title || 'Chuyến đi'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {folderItems.map((item) => (
              <FolderCard key={item.id} trip={item} />
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default SideInnerFolderTab;
