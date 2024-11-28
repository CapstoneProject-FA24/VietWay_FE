import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Divider, FormControl, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { fetchTourById } from '@services/TourService';

const CancelBookingPopup = ({ open, onClose, onConfirm, loading, tour }) => {
    const [tourInfo, setTourInfo] = useState(null);
    const [loadingPolicy, setLoadingPolicy] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const reasons = [ 'Thay đổi kế hoạch', 'Lý do sức khỏe', 'Thời tiết không thuận lợi', 'Vấn đề tài chính', 'Thay đổi số lượng người tham gia tour', 'Lý do gia đình', 'Đã đặt tour khác', 'Khác' ];

    const handleConfirm = () => {
        if (!cancelReason || (cancelReason === 'Khác' && !otherReason)) {
            return;
        }
        const finalReason = cancelReason === 'Khác' ? otherReason : cancelReason;
        onConfirm(finalReason);
    };

    useEffect(() => {
        const loadTourInfo = async () => {
            if (open && tour.tourId) {
                try {
                    setLoadingPolicy(true);
                    const result = await fetchTourById(tour.tourId);
                    setTourInfo(result);
                } catch (error) {
                    console.error('Failed to fetch tour info:', error);
                } finally {
                    setLoadingPolicy(false);
                }
            }
        };

        loadTourInfo();
    }, [open, tour.tourId]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setCancelReason('');
            setOtherReason('');
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
                <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 40, mb: 1 }} />
                <Typography variant="h6" component="div">
                    Xác nhận hủy đặt tour
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        Bạn có chắc chắn muốn hủy đặt tour:
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {tour.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Mã tour: {tour.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Mã booking: {tour.bookingId}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {loadingPolicy ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : tourInfo?.refundPolicies ? (
                        <Box sx={{ textAlign: 'left', mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Chính sách hoàn tiền:
                            </Typography>
                            {tourInfo.refundPolicies
                                .sort((a, b) => b.refundPercent - a.refundPercent)
                                .map((policy, index) => (
                                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                        • Hủy trước ngày {new Date(policy.cancelBefore).toLocaleDateString()}: Hoàn {policy.refundPercent}% tổng tiền
                                    </Typography>
                                ))}
                        </Box>
                    ) : null}

                    <Box sx={{ textAlign: 'left', mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Lý do hủy tour:
                        </Typography>
                        <FormControl required fullWidth>
                            <RadioGroup
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            >
                                {reasons.map((reason) => (
                                    <FormControlLabel
                                        key={reason}
                                        value={reason}
                                        control={<Radio />}
                                        label={reason}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                        
                        {cancelReason === 'Khác' && (
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Nhập lý do khác"
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
                <Button onClick={onClose} variant="outlined" disabled={loading} fullWidth>
                    Không
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    color="error" 
                    disabled={loading || !cancelReason || (cancelReason === 'Khác' && !otherReason)} 
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} /> : 'Xác nhận hủy'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelBookingPopup;