import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UnsavedConfirmPopup = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: '12px', width: '100%', maxWidth: '400px' }
            }}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Xác nhận bỏ lưu
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2 }}>
                <Typography>
                    Bạn có chắc muốn bỏ lưu?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="outlined" sx={{ minWidth: '100px', borderRadius: '8px' }}>
                    Không
                </Button>
                <Button onClick={onConfirm} variant="contained" sx={{ minWidth: '100px', borderRadius: '8px', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
                    Có
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UnsavedConfirmPopup;
