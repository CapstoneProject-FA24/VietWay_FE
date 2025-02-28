import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, TextField, Select, MenuItem, Button, List, ListItem, ListItemText, IconButton, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useNavigate } from 'react-router-dom';
import { fetchProvinces } from '@services/ProvinceService';

dayjs.locale('vi');

const FilterBar = () => {
  const [value, setValue] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [budget, setBudget] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProvinceData();
  }, []);

  const fetchProvinceData = async () => {
    try {
      const fetchedProvinces = await fetchProvinces();
      setProvinces(fetchedProvinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const handleChange = (event, newValue) => { setValue(newValue); };

  const handleSearch = () => {
    let searchParams = {};
    switch (value) {
      case 0:
        searchParams = new URLSearchParams({
          name: selectedDestination,
          startDate: departureDate ? dayjs(departureDate).format('YYYY-MM-DD') : '',
          priceRange: budget || 'all',
          provinceId: selectedProvince || 'all',
          applySearch: 'true'
        }).toString();
        navigate(`/tour-du-lich?${searchParams}`);
        break;
      case 1:
        searchParams = new URLSearchParams({
          name: selectedDestination,
          provinceId: selectedProvince,
          applySearch: 'true'
        }).toString();
        navigate(`/diem-tham-quan?${searchParams}`);
        break;
      case 2:
        searchParams = new URLSearchParams({
          name: selectedDestination,
          provinceId: selectedProvince,
          applySearch: 'true'
        }).toString();
        navigate(`/bai-viet?${searchParams}`);
        break;
    }
  };

  const renderFilterFields = () => {
    switch (value) {
      case 0:
        return (
          <>
            <TextField
              placeholder="Bạn muốn đi đâu?" value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)} sx={{ width: '30%' }}
              InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton><SearchIcon /></IconButton></InputAdornment>) }}
            />
            <DatePicker
              label="Ngày đi" value={departureDate}
              onChange={(newValue) => setDepartureDate(newValue)}
              format="DD/MM/YYYY" sx={{ width: '23%' }}
            />
            <Select
              value={budget} onChange={(e) => setBudget(e.target.value)}
              displayEmpty sx={{ width: '23%' }}
            >
              <MenuItem value="" disabled> Chọn khoảng giá </MenuItem>
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="0,1000000">Dưới 1 triệu</MenuItem>
              <MenuItem value="1000000,5000000">1-5 triệu</MenuItem>
              <MenuItem value="5000000,10000000">5-10 triệu</MenuItem>
              <MenuItem value="10000000,">Trên 10 triệu</MenuItem>
            </Select>
          </>
        );
      case 1: // Điểm tham quan
      case 2: // Bài viết
        return (
          <>
            <TextField
              placeholder={value === 1 ? "Tên điểm tham quan" : "Tên bài viết"} value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)} sx={{ width: '50%' }}
              InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton><SearchIcon /></IconButton></InputAdornment>) }}
            />
            <Select
              value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}
              displayEmpty sx={{ width: '30%' }}
            >
              <MenuItem value="" disabled> Chọn tỉnh thành </MenuItem>
              {provinces.map((province) => (
                <MenuItem key={province.provinceId} value={province.provinceId}> {province.provinceName} </MenuItem>
              ))}
            </Select>
          </>
        );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: '100%', bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 1, position: 'relative', zIndex: 3, transform: 'none !important' }}>
        <Tabs value={value} onChange={handleChange} sx={{ width: '100%' }}>
          <Tab icon={<DirectionsBusIcon />} label="Tour du lịch" iconPosition="start" sx={{ width: '33%' }} />
          <Tab icon={<LocationOnIcon />} label="Địa điểm tham quan" iconPosition="start" sx={{ width: '33%' }} />
          <Tab icon={<ArticleIcon />} label="Bài viết" iconPosition="start" sx={{ width: '33%' }} />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {renderFilterFields()}
          <Button variant="contained" color="primary" onClick={handleSearch}
            sx={{ width: '15%', height: '120%', borderRadius: '10px', padding: '8px 15px' }}>
            Tìm kiếm
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default FilterBar;