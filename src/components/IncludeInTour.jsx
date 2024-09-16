import React from 'react';
import { Box, Typography, List, ListItem, Grid } from '@mui/material';

const IncludeInTour = ({ included, notIncluded }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ mr: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem' }}>Bao gồm</Typography>
          <List>
            {included.map((item, index) => (
              <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'disc', ml: 2 }}>
                <Typography>{item}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem' }}>Không bao gồm</Typography>
          <List>
            {notIncluded.map((item, index) => (
              <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'disc', ml: 2 }}>
                <Typography>{item}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

IncludeInTour.defaultProps = {
  included: [
    "Vé tham quan các điểm du lịch",
    "Khách sạn 3 sao (2 người/phòng)",
    "Bữa ăn theo chương trình (2 bữa sáng, 3 bữa trưa, 2 bữa tối)",
    "Hướng dẫn viên tiếng Việt chuyên nghiệp",
    "Phương tiện vận chuyển hiện đại, điều hòa",
    "Nước uống trên xe (1 chai/ngày)"
  ],
  notIncluded: [
    "Chi phí cá nhân (giặt ủi, điện thoại, mua sắm)",
    "Đồ uống trong các bữa ăn",
    "Chi phí phát sinh ngoài chương trình",
    "Tiền tip cho hướng dẫn viên và lái xe"
  ]
};

export default IncludeInTour;

