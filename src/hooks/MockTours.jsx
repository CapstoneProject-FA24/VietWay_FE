export const mockTours = [
  {
    code: "NDSGN564-047",
    name: "Khám phá Hạ Long 3 ngày 2 đêm",
    bookingId: "BOOK-HL001",
    startProvince: "Hà Nội",
    startDate: "2023-07-01",
    endDate: "2023-07-03",
    totalParticipants: 20,
    bookingDate: "2023-06-15",
    totalPrice: 3500000,
    image: "https://ik.imagekit.io/tvlk/blog/2022/10/kinh-nghiem-du-lich-vinh-ha-long-5.jpg?tr=dpr-2,w-675",
    bookedTourStatus: "Đã hoàn tất"
  },
  {
    code: "NDSGN564-047",
    name: "Khám phá Sapa 4 ngày 3 đêm",
    bookingId: "BOOK-SP001",
    startProvince: "Hà Nội",
    startDate: "2023-10-05",
    endDate: "2023-10-08",
    totalParticipants: 20,
    bookingDate: "2023-09-20",
    totalPrice: 5500000,
    image: "https://r2.nucuoimekong.com/wp-content/uploads/ban-cat-sapa-a.jpg",
    bookedTourStatus: "Đã hoàn tất"
  },
  {
    code: "NDSGN564-047",
    name: "Khám phá Hội An - Đà Nẵng 5 ngày 4 đêm",
    bookingId: "BOOK-HN001",
    startProvince: "TP.HCM",
    startDate: "2023-11-11",
    endDate: "2023-11-15",
    totalParticipants: 25,
    bookingDate: "2023-10-25",
    totalPrice: 7000000,
    image: "https://toquoc.mediacdn.vn/280518851207290880/2023/9/13/318486b4-c187-40b5-9220-1afe6e4ccf5eb99d0408-1694595766050422505578.jpg",
    bookedTourStatus: "Quá hạn thanh toán"
  },
  {
    code: "NDSGN564-047",
    name: "Khám phá Nha Trang 3 ngày 2 đêm",
    bookingId: "BOOK-NT001",
    startProvince: "TP.HCM",
    startDate: "2023-12-07",
    endDate: "2023-12-09",
    totalParticipants: 30,
    bookingDate: "2023-11-20",
    totalPrice: 4000000,
    image: "https://ik.imagekit.io/tvlk/blog/2023/07/bai-bien-nha-trang-8-1024x576.jpg?tr=dpr-2,w-675",
    bookedTourStatus: "Đã hoàn tất"
  },
  {
    code: "NDSGN564-047",
    name: "Khám phá Bến Tre 2 ngày 1 đêm",
    bookingId: "BOOK-BT001",
    startProvince: "TP.HCM",
    startDate: "2024-01-13",
    endDate: "2024-01-14",
    totalParticipants: 15,
    bookingDate: "2023-12-30",
    totalPrice: 2500000,
    image: "https://thamhiemmekong.com/wp-content/uploads/2019/04/ben-tre-4.jpg",
    bookedTourStatus: "Đã hủy"
  },
  {
    code: "NDSGN564-047",
    name: "Khám phá Huế 3 ngày 2 đêm",
    bookingId: "BOOK-HUE001",
    startProvince: "Đà Nẵng",
    startDate: "2024-02-14",
    endDate: "2024-02-16",
    totalParticipants: 20,
    bookingDate: "2024-01-30",
    totalPrice: 4500000,
    image: "https://dulichconvoi.com/wp-content/uploads/2019/10/hinh-anh-hue-1-1.jpg",
    bookedTourStatus: "Chờ thanh toán"
  },
  {
    code: "NDSGN564-047-150324XE-M",
    name: "Khám phá Mũi Né 3 ngày 2 đêm",
    bookingId: "BOOK-MN001",
    startProvince: "TP.HCM",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    totalParticipants: 25,
    bookingDate: "2024-02-28",
    totalPrice: 3800000,
    image: "https://happytourvn.com/public/userfiles/tour/29/MUI-NE-KOVER-5524-1544670379-6577-1545735577.jpg",
    bookedTourStatus: "Đã thanh toán"
  }
];

export const getTourById = (id) => {
  return mockTours.find(tour => tour.id === id);
};
