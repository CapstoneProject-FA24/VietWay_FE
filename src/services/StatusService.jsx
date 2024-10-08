import { BookingStatus } from "@hooks/Statuses";

export const getBookingStatusInfo = (statusCode) => {
  switch (statusCode) {
    case BookingStatus.Pending:
      return { text: "Đang chờ xử lý", color: "#FFA500" }; // Orange
    case BookingStatus.Confirmed:
      return { text: "Đã xác nhận", color: "#4CAF50" }; // Green
    case BookingStatus.Cancelled:
      return { text: "Đã hủy", color: "#F44336" }; // Red
    case BookingStatus.Completed:
      return { text: "Đã hoàn thành", color: "#2196F3" }; // Blue
    default:
      return { text: "Không xác định", color: "#9E9E9E" }; // Grey
  }
};