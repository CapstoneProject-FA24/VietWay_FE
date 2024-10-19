import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Chip, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import { useParams, Link } from 'react-router-dom';

const PaymentHistory = ({ payments }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'thành công':
                return <CheckCircleIcon sx={{ color: 'success.main' }} />;
            case 'thất bại':
                return <ErrorIcon sx={{ color: 'error.main' }} />;
            default:
                return <PendingIcon sx={{ color: 'warning.main' }} />;
        }
    };

    return (
        <Box sx={{ my: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>Lịch Sử Thanh Toán</Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="payment history table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5', width: '30%' }}>
                            <TableCell sx={{ fontWeight: 'bold', width: '12%' }}>Mã Giao Dịch</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '12%' }}>Mã Booking</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '23%' }}>Tên Tour</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '15%' }}>Số Tiền</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Ngân Hàng</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '5%' }}>Trạng Thái</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '12%' }}>Thời Gian Thanh Toán</TableCell>
                            <TableCell sx={{ width: '10%' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((payment) => (
                                <TableRow
                                    key={payment.paymentId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}
                                >
                                    <TableCell>{payment.paymentId}</TableCell>
                                    <TableCell>{payment.bookingId}</TableCell>
                                    <TableCell>{payment.tourName}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{payment.amount.toLocaleString()} VND</TableCell>
                                    <TableCell align="center">{payment.bankName}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            icon={getStatusIcon(payment.status)} label={payment.status}
                                            color={payment.status.toLowerCase() === 'thành công' ? 'success' : 'error'}
                                            variant="outlined" size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">{new Date(payment.payTime).toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            component={Link}
                                            to={`/tai-khoan/thanh-toan/${payment.paymentId}`}
                                            variant="contained"
                                            size="small"
                                            sx={{ borderRadius: 20 }}
                                        >
                                            Chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]} component="div" count={payments.length} rowsPerPage={rowsPerPage}
                page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} sx={{ mt: 2 }}
            />
        </Box>
    );
};

export default PaymentHistory;
