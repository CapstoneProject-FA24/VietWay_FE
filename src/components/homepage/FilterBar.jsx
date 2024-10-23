import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

dayjs.locale('vi');

const FilterBar = () => {
  const [value, setValue] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [budget, setBudget] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('API_URL_FOR_DESTINATIONS');
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = () => {
    console.log('Search with:', { selectedDestination, departureDate, budget });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%'}}>
      <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 1 }}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab icon={<DirectionsBusIcon />} label="Tour trọn gói" />
          <Tab icon={<HotelIcon />} label="Địa điểm tham quan" />
          <Tab icon={<FlightIcon />} label="Bài viết" />
          <Tab icon={<WorkIcon />} label="Sự kiện" />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <TextField placeholder="Bạn muốn đi đâu?" value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} sx={{ width: '25%' }} InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {selectedDestination && (
            <List sx={{ position: 'absolute', zIndex: 1, bgcolor: 'background.paper', width: '25%', maxHeight: 200, overflow: 'auto' }}>
              {destinations
                .filter((dest) =>
                  dest.name.toLowerCase().includes(selectedDestination.toLowerCase())
                )
                .map((dest) => (
                  <ListItem
                    key={dest.id}
                    button
                    onClick={() => setSelectedDestination(dest.name)}
                  >
                    <ListItemText primary={dest.name} />
                  </ListItem>
                ))}
            </List>
          )}
          <DatePicker
            label="Ngày đi"
            value={departureDate}
            onChange={(newValue) => setDepartureDate(newValue)}
            format="DD/MM/YYYY"
            sx={{ width: '25%' }}
          />
          <Select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            displayEmpty
            sx={{ width: '25%' }}
          >
            <MenuItem value="" disabled>
              Ngân sách
            </MenuItem>
            <MenuItem value="0-5">Dưới 5 triệu</MenuItem>
            <MenuItem value="5-10">5-10 triệu</MenuItem>
            <MenuItem value="10-20">10-20 triệu</MenuItem>
            <MenuItem value="20+">Trên 20 triệu</MenuItem>
          </Select>
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
