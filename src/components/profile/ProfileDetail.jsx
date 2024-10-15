import React from 'react';
import { Box, Grid, Typography, Paper, Button } from '@mui/material';

const ProfileDetail = ({ profile }) => {
  return (
    <Box sx={{ my: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>Thông tin tài khoản</Typography>
      <Paper sx={{ p: 4, borderRadius: '8px' }}>
        <Grid container spacing={2}>
          {['name', 'email', 'password', 'phone', 'dob'].map((field) => (
            <React.Fragment key={field}>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>
                  {field === 'name' ? 'Tên' :
                   field === 'email' ? 'Email' :
                   field === 'password' ? 'Mật khẩu' :
                   field === 'phone' ? 'Số điện thoại' :
                   'Ngày sinh'}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 2 }}>
                  {profile[field]}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="text">Edit</Button>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfileDetail;

