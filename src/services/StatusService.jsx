import { BookingStatus } from "@hooks/Statuses";

export const getBookingStatusInfo = (statusCode) => {
  switch (statusCode) {
    case BookingStatus.Pending:
      return { text: "Chờ thanh toán", color: "#FFA000" };
    case BookingStatus.Deposited:
      return { text: "Đã đặt cọc", color: "#00cbdf" };
    case BookingStatus.Paid:
      return { text: "Đã thanh toán", color: "#2eb033" };
    case BookingStatus.Completed:
      return { text: "Hoàn tất", color: "#9d9d9d" };
    case BookingStatus.Cancelled:
      return { text: "Đã hủy", color: "#F44336" };
    default:
      return { text: "Không xác định", color: "#9E9E9E" };
  }
};