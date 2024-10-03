export const getMockPaymentData = () => {
  return {
    bookingInfo: {
      fullName: "Test",
      email: "test@gmail.com",
      phone: "******890",
      address: "",
      note: "None",
    },
    bookingDetails: {
      bookingId: "240914WJRHMO",
      createdDate: "14/09/2024 08:10",
      totalAmount: 5990000,
      paymentMethod: "Thanh toán QRCode ZaloPay -",
      paidAmount: 0,
      remainingAmount: 5990000,
      status: "Booking của quý khách đã được chúng tôi xác nhận thành công",
      paymentDueDate: "14/09/2024 09:10 - (Theo giờ Việt Nam. Booking sẽ tự động hủy nếu quá thời hạn thanh toán trên)",
    },
    tourInfo: {
      name: "Siêu Sale Thái Lan: Bangkok - Pattaya (Vườn lan Nong Nooch, The Chocolate Factory, tặng buffet tầng 86)",
      bookingId: "240914WJRHMO",
      tourCode: "NNSGN1304-068-170924VN-V-F",
      departureDate: "17/09/2024",
      departureTime: "16:55",
      departureAirport: "SGN",
      arrivalAirport: "BKK",
      airline: "Vietnam Airlines",
      flightNumber: "VN807",
      returnDate: "21/09/2024",
      returnTime: "19:30",
      returnDepartureAirport: "BKK",
      returnArrivalAirport: "SGN",
      returnFlightNumber: "VN606",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/8/25/1233238/Anh-1-Cau-Vang.jpg",
    },
    passengers: [
      {
        fullName: "Test",
        birthDate: "10/01/2001",
        gender: "Nam",
        ageGroup: "Người lớn (23 tuổi)",
        singleRoom: "Không",
      },
    ],
    totalPrice: 5990000,
  };
};
