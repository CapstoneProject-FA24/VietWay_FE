import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Để bắt URL

const PaymentResultPage = () => {
    const location = useLocation();
    const [paymentStatus, setPaymentStatus] = useState("");

    useEffect(() => {
        // Lấy các tham số từ URL (query string)
        const searchParams = new URLSearchParams(location.search);
        const txnRef = searchParams.get("vnp_TxnRef");
        const amount = searchParams.get("vnp_Amount");
        const responseCode = searchParams.get("vnp_ResponseCode");
        const transactionStatus = searchParams.get("vnp_TransactionStatus");

        // Xử lý kết quả thanh toán
        if (responseCode === "00" && transactionStatus === "0") {
            setPaymentStatus("Thanh toán thành công! Mã đơn hàng: " + txnRef);
        } else {
            setPaymentStatus("Thanh toán thất bại! Vui lòng thử lại.");
        }
    }, [location]);

    return (
        <div>
            <h1>Kết quả thanh toán</h1>
            <p>{paymentStatus}</p>
        </div>
    );
};

export default PaymentResultPage;
