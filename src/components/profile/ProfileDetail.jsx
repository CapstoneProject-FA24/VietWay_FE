import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Button, TextField, Select, MenuItem, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchProvinces } from '@services/ProvinceService';

const ProfileDetail = ({ profile, onSave }) => {
  const [editMode, setEditMode] = useState({});
  const [editedProfile, setEditedProfile] = useState({...profile});
  const [displayProfile, setDisplayProfile] = useState({...profile});
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    setEditedProfile({...profile});
    setDisplayProfile({...profile});
  }, [profile]);

  const genderOptions = [
    { label: 'Nam', value: 0 },
    { label: 'Nữ', value: 1 },
    { label: 'Khác', value: 2 },
  ];

  const fields = [
    { key: 'fullName', label: 'Tên', icon: <PersonIcon />, editable: true },
    { key: 'email', label: 'Email', icon: <EmailIcon />, editable: true },
    { key: 'phone', label: 'Số điện thoại', icon: <PhoneIcon />, editable: true },
    { key: 'birthday', label: 'Ngày sinh', format: (value) => dayjs(value).format('DD/MM/YYYY'), icon: <CakeIcon />, editable: true, type: 'date' },
    { key: 'genderId', label: 'Giới tính', icon: <WcIcon />, editable: true, type: 'select', options: genderOptions },
    { key: 'provinceId', label: 'Nơi ở', icon: <LocationOnIcon />, editable: true, type: 'select', options: provinces.map(p => ({ label: p.provinceName, value: p.provinceId })) },
  ];

  const handleEdit = (key) => {
    setEditMode(prev => ({ ...prev, [key]: true }));
  };

  const handleCheck = (key) => {
    setEditMode(prev => ({ ...prev, [key]: false }));
    setDisplayProfile(prev => ({ ...prev, [key]: editedProfile[key] }));
  };

  const handleChange = (key, value) => {
    setEditedProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedProfile);
    setDisplayProfile({...editedProfile});
    setEditMode({});
  };

  const getDisplayValue = (field, value) => {
    if (field.key === 'genderId') {
      return genderOptions.find(option => option.value === value)?.label || 'N/A';
    }
    if (field.key === 'provinceId') {
      return provinces.find(p => p.provinceId === value)?.provinceName || profile.provinceName || 'N/A';
    }
    return field.format ? field.format(value) : value || 'N/A';
  };

  return (
    <Box sx={{ my: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'white', fontWeight: 'bold' }}>Thông tin tài khoản</Typography>
      <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={3} sx={{ ml: -7 }}>
          {fields.map((field) => (
            <Grid item xs={12} sm={5.3} key={field.key} sx={{ ml: 7 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>{field.icon}</Box>
                  <Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      {field.label}
                    </Typography>
                    {editMode[field.key] && field.editable ? (
                      field.type === 'select' ? (
                        <Select
                          value={editedProfile[field.key]}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          sx={{ minWidth: 120 }}
                        >
                          {field.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : field.type === 'date' ? (
                        <TextField
                          value={dayjs(editedProfile[field.key]).format('DD/MM/YYYY')}
                          onChange={(e) => handleChange(field.key, dayjs(e.target.value, 'DD/MM/YYYY').toDate())}
                          type="text"
                          placeholder="DD/MM/YYYY"
                        />
                      ) : (
                        <TextField
                          value={editedProfile[field.key]}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          type={field.type || 'text'}
                        />
                      )
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                        {getDisplayValue(field, displayProfile[field.key])}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {field.editable && (
                  <IconButton onClick={() => editMode[field.key] ? handleCheck(field.key) : handleEdit(field.key)}>
                    {editMode[field.key] ? <CheckIcon /> : <EditIcon />}
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />} 
            sx={{ borderRadius: '20px' }}
            onClick={handleSave}
            disabled={JSON.stringify(displayProfile) === JSON.stringify(profile)}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileDetail;
