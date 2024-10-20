import React from 'react';
import { Box, Typography, Avatar, Rating, Divider } from '@mui/material';
import { mockFeedbacks } from '@hooks/MockFeedback';

const FeedbackList = ({ tourTemplateId }) => {
    const tourFeedbacks = mockFeedbacks
        .filter(feedback => feedback.tourTemplateId === tourTemplateId)
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

    return (
        <Box sx={{ mt: 5, mb: 10 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '2rem', color: '#05073C', mb: 3 }}>
                Đánh giá từ khách hàng
            </Typography>
            {tourFeedbacks.length > 0 ? (
                tourFeedbacks.map((feedback, index) => (
                    <Box key={feedback.id} sx={{ mb: 3, ml: 3, width: '80%', borderRadius: 3, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2 }}>{feedback.customerName[0]}</Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {feedback.customerName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(feedback.createDate).toLocaleDateString('vi-VN')}
                                </Typography>
                            </Box>
                        </Box>
                        <Rating value={feedback.rating} readOnly sx={{ mb: 1 }} />
                        <Typography variant="body1">
                            {feedback.feedback}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography>Chưa có đánh giá nào cho tour này.</Typography>
            )}
        </Box>
    );
};

export default FeedbackList;
