import React, { useState } from 'react';
import FolderCard from '@components/saved/FolderCard';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Backdrop,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import SideInnerFolderTab from './SideInnerFolderTab';

const SideSavedFolderTab = ({ onClose, attraction, isLiked }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const handleBack = () => {
    setSelectedFolder(null);
  };

  // If a folder is selected, show the inner tab
  if (selectedFolder) {
    return (
      <SideInnerFolderTab
        onClose={onClose}
        onBack={handleBack}
        folderData={selectedFolder}
        newAttraction={isLiked && attraction ? {
          id: attraction.attractionId,
          title: attraction.name,
          location: `${attraction.province}`,
          image: attraction.imageUrl,
          isFavorite: true
        } : null}
      />
    );
  }

  const drawerStyles = { width: 550, height: '100vh', bgcolor: 'background.paper', boxShadow: 1, position: 'fixed', right: 0, top: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, zIndex: 1201, overflowY: 'auto', animation: 'slideIn 0.3s ease-out' };

  const savedTrips = [
    {
      id: 1,
      title: 'Chuyến đi đến Vũng Tàu', 
      location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
      image: 'https://cms.vietnamcoracle.com/wp-content/uploads/2021/08/IMG_8747-copy-blog-title-text-1.jpg',
      isFavorite: true
    },
    {
      id: 2,
      title: 'Chuyến đi đến Đà Nẵng',
      location: 'Đà Nẵng, Đà Nẵng', 
      image: 'https://images2.thanhnien.vn/528068263637045248/2023/4/23/cau-vang-da-nang-16822248307311159361992.jpg',
      isFavorite: false
    }
  ];

  return (
    <>
      <Backdrop
        open={true}
        onClick={onClose}
        sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(5px)', zIndex: 1200 }}
      />
      
      <Box sx={drawerStyles}>
        <Box sx={{ p: 2, borderBottom: 2, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: 50, marginLeft: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CardTravelIcon fontSize='medium'/>
              <Typography variant="h9" component="h4" fontWeight={600}>
                Chuyến đi của tôi
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 2, marginLeft: 2, marginTop: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            {isLiked ? 'Lưu vào một chuyến đi' : 'Chuyến đi của tôi'}
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {savedTrips.map((trip) => (
              <Box key={trip.id} onClick={() => handleFolderClick(trip)}>
                <FolderCard trip={trip} />
              </Box>
            ))}
          </Stack>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: 2
          }}>
            <Button
              startIcon={<AddBoxIcon sx={{ fontSize: 'large', mr: 0.5, color: 'primary.main', borderRadius: 1 }}/>}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                justifyContent: 'flex-start',
                pl: 1,
                fontWeight: 600,
                fontSize: 20
              }}
            >
              Tạo một chuyến đi
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SideSavedFolderTab;
