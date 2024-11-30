import { BookingStatus } from "@hooks/Statuses";

export const getBookingStatusInfo = (statusCode) => {
  switch (statusCode) {
    case BookingStatus.Pending:
      return { text: "Đang chờ thanh toán", color: "#FFA000" };
    case BookingStatus.Deposited:
      return { text: "Đã đặt cọc", color: "#FF9800" };
    case BookingStatus.Paid:
      return { text: "Đã thanh toán", color: "#15B392" };
    case BookingStatus.Completed:
      return { text: "Hoàn tất", color: "#4CAF50" };
    case BookingStatus.Cancelled:
      return { text: "Đã hủy", color: "#F44336" };
    default:
      return { text: "Không xác định", color: "#9E9E9E" };
  }
};