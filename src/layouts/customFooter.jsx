import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
} from "@mui/material";

const BookTourFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f2fbff",
        py: 6,
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        mt: "auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#0b1a57",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Liên hệ
            </Typography>
            <Typography variant="body2" sx={{ color: "#000000", mb: 1.5 }}>
              190 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM
            </Typography>
            <Typography variant="body2" sx={{ color: "#000000", mb: 1.5 }}>
              VietWayService@gmail.com
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ marginLeft: 7 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#0b1a57",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Công ty
            </Typography>
            <Box component="ul" sx={{ listStyleType: "none", p: 0, m: 0 }}>
              {[
                "Về chúng tôi",
                "Vietway Review",
                "Liên hệ chúng tôi",
                "Travel Guides",
                "Data Policy",
                "Cookie Policy",
                "Legal",
                "Sitemap",
              ].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link
                    href="#"
                    sx={{
                      color: "#555",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.3s, transform 0.3s",
                      display: "inline-block",
                      "&:hover": {
                        color: "#000000",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ marginLeft: -7 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#0b1a57",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Hỗ trợ
            </Typography>
            <Box component="ul" sx={{ listStyleType: "none", p: 0, m: 0 }}>
              {[
                "Liên hệ qua hotline",
                "Liên hệ trực tuyến",
                "Cách chúng tôi hoạt động",
              ].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link
                    href="#"
                    sx={{
                      color: "#555",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.3s, transform 0.3s",
                      display: "inline-block",
                      "&:hover": {
                        color: "#000000",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ marginLeft: -7 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#0b1a57",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Thông tin
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#000000", mb: 1.5, mr: -8 }}
            >
              Hãy để lại email để biết thêm nhiều tin tức cập nhật mới về các
              điểm tham quan và tour du lịch
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mt: 2,
                mr: -8,
              }}
            >
              <TextField
                fullWidth
                id="email"
                label="Email của bạn"
                name="email"
                autoComplete="email"
                variant="outlined"
                size="small"
                type="email"
                sx={{
                  flex: 1,
                  borderRadius: "25px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    height: "45px",
                  },
                }}
              />
              <Button
                type="submit"
                sx={{
                  bgcolor: "#3572ef",
                  color: "#fff",
                  borderRadius: "25px",
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#0b1a57" },
                }}
              >
                Gửi
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 4,
            color: "#777",
            fontSize: 13,
            borderTop: "1px solid #eee",
            pt: 2,
            mb: -11,
          }}
        >
          Bản quyền của VietwayTours © 2024
        </Typography>
      </Container>
    </Box>
  );
};

export default BookTourFooter;
