import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, TextField, Select, MenuItem, Button, List, ListItem, ListItemText, IconButton, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SearchIcon from '@mui/icons-material/Search';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import WorkIcon from '@mui/icons-material/Work';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useNavigate } from 'react-router-dom';
import { fetchProvinces } from '@services/ProvinceService';

dayjs.locale('vi');

const FilterBar = () => {
  const [value, setValue] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [budget, setBudget] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = () => {
    let searchParams = {};
    switch (value) {
      case 0: // Tour du lịch
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
      case 3: // Sự kiện
        searchParams = new URLSearchParams({
          name: selectedDestination,
          provinceId: selectedProvince,
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''
        }).toString();
        navigate(`/su-kien?${searchParams}`);
        break;
    }
  };

  const renderFilterFields = () => {
    switch (value) {
      case 0: // Tour du lịch
        return (
          <>
            <TextField
              placeholder="Bạn muốn đi đâu?" value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              sx={{ width: '30%' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton> <SearchIcon /> </IconButton>
                  </InputAdornment>
                ),
              }}
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
              <MenuItem value="" disabled>
                Chọn khoảng giá
              </MenuItem>
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
              placeholder={value === 1 ? "Tên điểm tham quan" : "Tên bài viết"}
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              sx={{ width: '50%' }}
            />
            <Select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              displayEmpty
              sx={{ width: '30%' }}
            >
              <MenuItem value="" disabled>
                Chọn tỉnh thành
              </MenuItem>
              {provinces.map((province) => (
                <MenuItem key={province.provinceId} value={province.provinceId}>
                  {province.provinceName}
                </MenuItem>
              ))}
            </Select>
          </>
        );
      case 3: // Sự kiện
        return (
          <>
            <TextField
              placeholder="Tên sự kiện"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              sx={{ width: '30%' }}
            />
            <Select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              displayEmpty
              sx={{ width: '25%' }}
            >
              <MenuItem value="" disabled>
                Chọn tỉnh thành
              </MenuItem>
              {provinces.map((province) => (
                <MenuItem key={province.provinceId} value={province.provinceId}>
                  {province.provinceName}
                </MenuItem>
              ))}
            </Select>
            <DatePicker
              label="Ngày bắt đầu"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              format="DD/MM/YYYY"
              sx={{ width: '23%' }}
            />
          </>
        );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 1 }}>
        <Tabs value={value} onChange={handleChange} sx={{ width: '100%' }}>
          <Tab icon={<DirectionsBusIcon />} label="Tour trọn gói" iconPosition="start" sx={{ width: '28%' }}/>
          <Tab icon={<HotelIcon />} label="Địa điểm tham quan" iconPosition="start" sx={{ width: '31%' }}/>
          <Tab icon={<FlightIcon />} label="Bài viết" iconPosition="start" sx={{ width: '20%' }}/>
          <Tab icon={<WorkIcon />} label="Sự kiện" iconPosition="start" sx={{ width: '21%' }}/>
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {renderFilterFields()}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ width: '15%', height: '100%' }}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default FilterBar;
