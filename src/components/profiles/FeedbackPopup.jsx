import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Rating, TextField, Button, IconButton, styled, Box, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '2.6rem',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const ContactInfo = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  fontSize: '3rem',
  '& .MuiRating-iconFilled': {
    color: '#FFD700',
  },
  '& .MuiRating-iconHover': {
    color: '#FFD700',
  },
}));

const FeedbackPopup = ({ onClose, id }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = () => {
    console.log('Tour ID:', id);
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    onClose();
  };

  const handleClose = () => {
    if (rating > 0 || feedback.trim() !== '') {
      setConfirmOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    onClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.6rem' }}>Xác nhận</DialogTitle>
      <DialogContent>
        <Typography sx={{ textAlign: 'center' }}>Bạn có chắc muốn hủy đánh giá này?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
        <Button onClick={handleConfirmClose} autoFocus>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <StyledDialog onClose={handleClose} open={true} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Title variant="h6">Đánh giá tour</Title>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Subtitle color="primary" gutterBottom>
            Cảm ơn bạn đã chọn đặt tour trên Vietway
          </Subtitle>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom align="center">Chuyến đi của bạn như thế nào?</Typography>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <StyledRating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="feedback"
            label="Chia sẻ những ý kiến chi tiết về trải nghiệm của bạn"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <ContactInfo sx={{ color: (theme) => theme.palette.primary.main }}>
            Liên hệ hotline <strong>1900 123 456</strong> hoặc <strong>emailsupport@vietwaytour.com</strong>
            <br />
            để được hỗ trợ thêm
          </ContactInfo>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="outlined" sx={{ width: '120px' }}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={rating === 0} 
            sx={{ 
              width: '120px', 
              backgroundColor: '#3ABEF9',
              '&:hover': {
                backgroundColor: '#2196f3',
              },
            }}
          >
            Gửi
          </Button>
        </DialogActions>
      </StyledDialog>
      <ConfirmDialog />
    </>
  );
};

export default FeedbackPopup;
