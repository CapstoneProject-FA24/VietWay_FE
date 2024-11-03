import { BookingStatus } from "@hooks/Statuses";

export const getBookingStatusInfo = (statusCode) => {
  switch (statusCode) {
    case BookingStatus.Pending:
      return { text: "Đang chờ thanh toán", color: "#FFA000" };
    case BookingStatus.Confirmed:
      return { text: "Đã thanh toán", color: "#15B392" };
    case BookingStatus.Completed:
      return { text: "Hoàn tất", color: "#4CAF50" };
    case BookingStatus.Expired:
      return { text: "Hết hạn thanh toán", color: "#9E9E9E" };
    case BookingStatus.Cancelled:
      return { text: "Đã hủy", color: "#F44336" };
    case BookingStatus.PendingRefund:
      return { text: "Đang chờ hoàn tiền", color: "#FF9800" };
    case BookingStatus.Refunded:
      return { text: "Đã hoàn tiền", color: "#387478" };
    default:
      return { text: "Không xác định", color: "#9E9E9E" };
  }
};