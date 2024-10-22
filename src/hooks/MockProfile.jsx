export const mockProfiles = [
  {
    id: "USR001",
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    password: "password123",
    dob: "01/01/1990"
  },
  {
    id: "USR002",
    name: "Tran Thi B",
    email: "tranthib@example.com",
    phone: "0902345678",
    password: "password234",
    dob: "02/02/1991"
  },
  {
    id: "USR003",
    name: "Le Van C",
    email: "levanc@example.com",
    phone: "0903456789",
    password: "password345",
    dob: "03/03/1992"
  },
  {
    id: "USR004",
    name: "Pham Thi D",
    email: "phamthid@example.com",
    phone: "0904567890",
    password: "password456",
    dob: "04/04/1993"
  },
  {
    id: "USR005",
    name: "Hoang Van E",
    email: "hoangvane@example.com",
    phone: "0905678901",
    password: "password567",
    dob: "05/05/1994"
  }
];

export const mockPayments = [
  {
    paymentId: 'PAY-123456', bookingId: 'BOOK-789012', amount: 1500000,
    payTime: '2024-03-15T10:35:00', status: 'Thành công'
  },
  {
    paymentId: 'PAY-123434', bookingId: 'BOOK-789245', amount: 16000000,
    payTime: '2024-03-15T10:35:00', status: 'Thành công'
  },
  {
    paymentId: 'PAY-123435', bookingId: 'BOOK-789246', amount: 1000000,
    payTime: '2024-03-15T10:35:00', status: 'Đã hoàn tiền'
  },
  {
    paymentId: 'PAY-123436', bookingId: 'BOOK-789247', amount: 890000,
    payTime: '2024-03-15T10:35:00', status: 'Thất bại'
  },
];

export const mockPaymentDetails = [
  {
    paymentId: 'PAY-123456', 
    booking: {
      bookingId: 'BOOK-789012',
      tourName: 'Khám phá vịnh Hạ Long 3 ngày 2 đêm',
      tourId: 'TOUR-HL001'
    }, 
    amount: 1500000, payTime: '2024-03-15T10:35:00', status: 'Thành công',
    note: '', bankCode: 'VCB',
  },
  {
    paymentId: 'PAY-123434', 
    booking: {
      bookingId: 'BOOK-789245',
      tourName: 'Khám phá đảo ngọc Phú Quốc 4 ngày 3 đêm',
      tourId: 'TOUR-PQ002'
    },
    amount: 16000000, payTime: '2024-03-15T10:35:00', status: 'Thành công',
    note: '', bankCode: 'TCB',
  },
  {
    paymentId: 'PAY-123435', 
    booking: {
      bookingId: 'BOOK-789246',
      tourName: 'Đà Lạt mộng mơ 2 ngày 1 đêm',
      tourId: 'TOUR-DL003'
    },
    amount: 1000000, payTime: '2024-03-15T10:35:00', status: 'Đã hoàn tiền',
    note: 'Hoàn tiền do hủy tour Đà Lạt', bankCode: 'ACB',
  },
  {
    paymentId: 'PAY-123436', 
    booking: {
      bookingId: 'BOOK-789247',
      tourName: 'Tour Sapa cuối tuần',
      tourId: 'TOUR-SP004'
    },
    amount: 890000, payTime: '2024-03-15T10:35:00', status: 'Thất bại',
    note: 'Giao dịch thất bại do thẻ hết hạn', bankCode: 'MB',
  },
];