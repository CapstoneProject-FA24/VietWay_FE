import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Button, TextField, Select, MenuItem, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchProvinces } from '@services/ProvinceService';
import { getCustomerInfo, updateCustomerInfo } from '@services/CustomerService';

const ProfileDetail = ({ profile, onProfileUpdate }) => {
  const [editMode, setEditMode] = useState({});
  const [editedProfile, setEditedProfile] = useState({});
  const [displayProfile, setDisplayProfile] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProvinces().then(setProvinces);
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const customerInfo = await getCustomerInfo();
      setEditedProfile(customerInfo);
      setDisplayProfile(customerInfo);
    } catch (error) {
      console.error('Failed to fetch customer info:', error);
    }
  };

  const genderOptions = [
    { label: 'Nam', value: 0 },
    { label: 'Nữ', value: 1 },
    { label: 'Khác', value: 2 },
  ];

  const fields = [
    { key: 'fullName', label: 'Tên', icon: <PersonIcon />, editable: true },
    { key: 'email', label: 'Email', icon: <EmailIcon />, editable: !displayProfile.loginWithGoogle },
    { key: 'phone', label: 'Số điện thoại', icon: <PhoneIcon />, editable: false },
    { key: 'birthday', label: 'Ngày sinh', format: (value) => dayjs(value).format('DD/MM/YYYY'), icon: <CakeIcon />, editable: true, type: 'date' },
    { key: 'genderId', label: 'Giới tính', icon: <WcIcon />, editable: true, type: 'select', options: genderOptions },
    { key: 'provinceId', label: 'Nơi ở', icon: <LocationOnIcon />, editable: true, type: 'select', options: provinces.map(p => ({ label: p.provinceName, value: p.provinceId })) },
  ];

  const handleEdit = (key) => {
    setEditMode(prev => ({ ...prev, [key]: true }));
  };

  const handleCancel = (key) => {
    setEditMode(prev => ({ ...prev, [key]: false }));
    setEditedProfile(prev => ({ ...prev, [key]: displayProfile[key] }));
  };

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidDOB = (date) => {
    return dayjs(date).isBefore(dayjs());
  };

  const validateField = (key, value) => {
    let error = '';
    if (key === 'email') {
      if (!value) {
        error = 'Email không được để trống';
      } else if (!isValidEmail(value)) {
        error = 'Email không hợp lệ';
      }
    } else if (key === 'birthday' && !isValidDOB(value)) {
      error = 'Ngày sinh không hợp lệ';
    }
    setErrors(prev => ({ ...prev, [key]: error }));
    return error === '';
  };

  const handleChange = (key, value) => {
    setEditedProfile(prev => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const formatDateForAPI = (date) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS');
  };

  const handleSave = async () => {
    const isValid = fields.every(field => 
      !errors[field.key] && validateField(field.key, editedProfile[field.key])
    );

    if (isValid) {
      try {
        const updatedProfile = { ...editedProfile };
        if (updatedProfile.birthday) {
          updatedProfile.birthday = formatDateForAPI(updatedProfile.birthday);
        }
        await updateCustomerInfo(updatedProfile);
        setDisplayProfile({...editedProfile});
        setEditMode({});
        onProfileUpdate(editedProfile);
      } catch (error) {
        console.error('Failed to update customer info:', error);
      }
    } else {
      console.error('Form has errors. Please correct them before saving.');
    }
  };

  const getDisplayValue = (field, value) => {
    if (field.key === 'genderId') {
      return genderOptions.find(option => option.value === value)?.label || 'N/A';
    }
    if (field.key === 'provinceId') {
      return provinces.find(p => p.provinceId === value)?.provinceName || displayProfile.provinceName || 'N/A';
    }
    return field.format ? field.format(value) : value || 'N/A';
  };

  const isProfileChanged = () => {
    return fields.some(field => {
      const displayValue = displayProfile[field.key];
      const editedValue = editedProfile[field.key];
      
      if (field.type === 'date') {
        return !dayjs(displayValue).isSame(dayjs(editedValue), 'day');
      }
      
      return displayValue !== editedValue;
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                          <DatePicker
                            value={dayjs(editedProfile[field.key])}
                            onChange={(newValue) => handleChange(field.key, newValue.toDate())}
                            format="DD/MM/YYYY"
                            maxDate={dayjs()}
                            slotProps={{
                              textField: {
                                size: "small",
                                fullWidth: true,
                                error: !!errors[field.key],
                                helperText: errors[field.key],
                              },
                            }}
                          />
                        ) : (
                          <TextField
                            value={editedProfile[field.key]}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            type={field.type || 'text'}
                            error={!!errors[field.key]}
                            helperText={errors[field.key]}
                          />
                        )
                      ) : (
                        <>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                            {getDisplayValue(field, displayProfile[field.key])}
                          </Typography>
                          {field.helperText && (
                            <Typography variant="caption" color="text.secondary">
                              {field.helperText}
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                  {field.editable && (
                    <IconButton 
                      onClick={() => editMode[field.key] ? handleCancel(field.key) : handleEdit(field.key)}
                      disabled={!field.editable}
                    >
                      {editMode[field.key] ? <CloseIcon /> : <EditIcon />}
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
              disabled={!isProfileChanged()}
            >
              Lưu thay đổi
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ProfileDetail;
