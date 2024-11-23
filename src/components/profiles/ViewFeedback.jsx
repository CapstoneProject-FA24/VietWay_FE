import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Rating, IconButton, styled, Box, Divider } from '@mui/material';
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
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '2.6rem',
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  fontSize: '3rem',
  '& .MuiRating-iconFilled': {
    color: '#FFD700',
  },
  readOnly: true,
}));

const ViewFeedback = ({ onClose, feedback }) => {
  return (
    <StyledDialog onClose={onClose} open={true} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Title variant="h6">Đánh giá của bạn</Title>
        <IconButton 
          aria-label="close" 
          onClick={onClose} 
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Điểm đánh giá
          </Typography>
          <StyledRating
            value={feedback.rating}
            readOnly
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Nhận xét của bạn
          </Typography>
          <Typography variant="body1" sx={{ 
            backgroundColor: '#f5f5f5',
            p: 2,
            borderRadius: '8px',
            minHeight: '100px',
            userSelect: 'none',
            pointerEvents: 'none'
          }}>
            {feedback.comment}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Trạng thái
          </Typography>
          <Typography variant="body1" sx={{ color: feedback.isPublic ? 'success.main' : 'text.secondary' }}>
            {feedback.isPublic ? 'Công khai' : 'Riêng tư'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Thời gian đánh giá
          </Typography>
          <Typography variant="body1">
            {new Date(feedback.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default ViewFeedback;
