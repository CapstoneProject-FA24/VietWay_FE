import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, Box, IconButton, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled, alpha } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCookie, removeCookie } from '@services/AuthenService';

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  marginTop: '10px',
  marginLeft: '3rem',
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    marginTop: 8,
    minWidth: 160,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    '& .MuiMenu-list': {
      padding: '8px',
    },
    '& .MuiMenuItem-root': {
      fontSize: '16px',
      padding: '12px 16px',
      borderRadius: 8,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
      },
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 20,
      width: 10,
      height: 10,
      backgroundColor: theme.palette.background.paper,
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '16px',
  fontFamily: 'Inter, sans-serif',
  color: theme.palette.text.primary,
  '&:not(:last-child)': {
    marginBottom: '4px',
  },
}));

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const customerToken = getCookie('customerToken');
    setIsLoggedIn(!!customerToken);

    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeCookie('customerToken');
    setIsLoggedIn(false);
    handleClose();
    navigate('/trang-chu');
  };

  const handleAccount = () => {
    handleClose();
    navigate('/tai-khoan');
  };

  const handleSaved = () => {
    handleClose();
    navigate('/luu-tru');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: location.pathname === '/trang-chu' && scrollY === 0 ? 'transparent' : 'white',
        boxShadow: location.pathname === '/trang-chu' && scrollY === 0 ? 0 : 1,
        width: '100%',
        transition: 'background-color 0.3s, box-shadow 0.3s',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/trang-chu" sx={{ color: 'text.primary' }}>
          <img src={location.pathname === '/trang-chu' && scrollY === 0 ? "/logo2.png" : "/logo2_color.png"} alt="Logo" style={{ height: '55px', marginTop: '15px' }} />
        </Typography>    
        <Box sx={{ display: 'flex', ml: 0.5 }}>
          <StyledButton component={Link} to="/trang-chu" sx={{ textTransform: 'none',
              fontWeight: location.pathname === '/trang-chu' ? 'bold' : 'normal', mr: 1.5,
              color: location.pathname === '/trang-chu' && scrollY === 0 ? 'white' : 'black' }}>
            Trang chủ
          </StyledButton>
          <StyledButton
            color="inherit" component={Link} to="/tinh-thanh"
            sx={{
              textTransform: 'none', ml: 1.5, mr: 1.5,
              fontWeight: location.pathname === '/tinh-thanh' ? 'bold' : 'normal', 
              color: location.pathname === '/trang-chu' && scrollY === 0 ? 'white' : 'black'
            }}
          >
            Tỉnh thành
          </StyledButton>
          <StyledButton
            color="inherit" component={Link} to="/diem-tham-quan"
            sx={{
              textTransform: 'none', ml: 1.5, mr: 1.5,
              fontWeight: location.pathname === '/diem-tham-quan' ? 'bold' : 'normal', 
              color: location.pathname === '/trang-chu' && scrollY === 0 ? 'white' : 'black'
            }}
          >
            Điểm tham quan
          </StyledButton>
          <StyledButton
            color="inherit" component={Link} to="/tour-du-lich"
            sx={{
              textTransform: 'none', ml: 1.5, mr: 1.5,
              fontWeight: location.pathname === '/tour-du-lich' ? 'bold' : 'normal', 
              color: location.pathname === '/trang-chu' && scrollY === 0 ? 'white' : 'black'
            }}
          >
            Tour du lịch
          </StyledButton>
          <StyledButton
            color="inherit" component={Link} to="/bai-viet"
            sx={{ textTransform: 'none', ml: 1.5, mr: 1.5,
              fontWeight: location.pathname === '/bai-viet' ? 'bold' : 'normal', 
              color: location.pathname === '/trang-chu' && scrollY === 0 ? 'white' : 'black'
            }}
          >
            Bài viết
          </StyledButton>
          {/* <StyledButton
            color="inherit" component={Link} to="/su-kien"
            sx={{ textTransform: 'none', ml: 1.5, mr: 1.5,
              fontWeight: location.pathname === '/su-kien' ? 'bold' : 'normal', 
              color: location.pathname === '/trang-chu' && scrollY === 0 ? 'white' : 'black'
            }}
          >
            Tin tức sự kiện
          </StyledButton> */}
        </Box>
        
        <Box sx={{ display: 'flex' }}>
          {isLoggedIn ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  border: location.pathname === '/trang-chu' && scrollY === 0 
                    ? '2px solid white' 
                    : '2px solid #666',
                  padding: '8px',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <AccountCircleIcon 
                  sx={{ 
                    color: location.pathname === '/trang-chu' && scrollY === 0 
                      ? "white" 
                      : "#666",
                    fontSize: 28
                  }}
                />
              </IconButton>
              <StyledMenu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                  },
                }}
              >
                <StyledMenuItem onClick={handleAccount}>
                  Tài khoản
                </StyledMenuItem>
                <StyledMenuItem onClick={handleSaved}>
                  Lưu trữ
                </StyledMenuItem>
                <StyledMenuItem onClick={handleLogout}>
                  Đăng xuất
                </StyledMenuItem>
              </StyledMenu>
            </>
          ) : (
            <>
              <StyledButton color="inherit" component={Link} to="/dang-ky" sx={{ color: location.pathname === '/trang-chu' && scrollY === 0  ? "white" : "black", textTransform: 'none' }}>Đăng ký</StyledButton>
              <StyledButton color="inherit" component={Link} to="/dang-nhap" sx={{ color: 'white', textTransform: 'none', backgroundColor: '#3572EF', borderRadius: '100px', padding: '9px 14px', marginLeft: '10px', '&:hover': { backgroundColor: '#CAECFF' } }}>Đăng nhập</StyledButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
