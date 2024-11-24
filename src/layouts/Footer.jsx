import React from 'react';
import { Box, Container, Grid, Typography, Link, TextField, Button } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#f2fbff', py: 6, boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)', marginLeft: '-65px', marginRight: '-65px', textAlign: 'left', mt: 10, mb: -14 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: '#0b1a57', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
              Liên hệ
            </Typography>
            <Typography variant="body2" sx={{ color: '#000000', mb: 1.5 }}>
              ĐT:  (84-28) 38 279 279
            </Typography>
            <Typography variant="body2" sx={{ color: '#000000', mb: 1.5 }}>
              Fax: (84-28) 38 224 987.
            </Typography>
            <Typography variant="body2" sx={{ color: '#000000', mb: 1.5 }}>
              190 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM
            </Typography>
            <Typography variant="body2" sx={{ color: '#000000', mb: 1.5 }}>
              VietWayService@gmail.com
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ marginLeft: 7 }}>
            <Typography variant="h6" sx={{ color: '#0b1a57', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
              VietWay Tour
            </Typography>
            <Box component="ul" sx={{ listStyleType: 'none', p: 0, m: 0 }}>
              {['Về chúng tôi', 'Chính sách và điều khoản sử dụng', 'Chính sách bảo mật thông tin', 'Chính sách hủy tour', 'Quy định thanh toán'].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link href="#" sx={{ color: '#555', textDecoration: 'none', fontSize: 14, transition: 'color 0.3s, transform 0.3s', display: 'inline-block', '&:hover': { color: '#000000', transform: 'translateX(5px)' } }}>
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ marginLeft: -7 }}>
            <Typography variant="h6" sx={{ color: '#0b1a57', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
              Cổng thanh toán
            </Typography>
            <img src="https://upload.wikimedia.org/wikipedia/vi/7/77/ZaloPay_Logo.png" alt="ZaloPay" style={{ width: 'auto', height: '3rem' }} />
            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" style={{ width: 'auto', height: '3.3rem' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
