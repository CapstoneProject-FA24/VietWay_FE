export const getZaloPayMessage = (code) => {
  const errorTypes = {
    'System error': 'Hệ thống đang có lỗi, vui lòng quay lại sau.',
    'User error': null,
    'Merchant error': null,
    'Bank error': null,
    'Unknown': null
  };

  const codeMap = {
    '1': { message: 'Giao dịch thành công', type: 'Successful' },
    '0': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'System error' },
    '-1': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'User error' },
    '-2': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'Merchant error' },
    '-3': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'Merchant error' },
    '-4': { message: 'Ứng dụng tạm thời không thể thanh toán, vui lòng quay lại sau.', type: 'Merchant error' },
    '-5': { message: 'Số tiền không hợp lệ.', type: 'Merchant error' },
    '-6': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'System error' },
    '-7': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'System error' },
    '-8': { message: 'Số tiền thanh toán vượt quá hạn mức cho phép.', type: 'User error' },
    '-9': { message: 'Tài khoản không đủ số dư để thực hiện giao dịch.', type: 'User error' },
    '-10': { message: 'Lỗi xác thực OTP.', type: 'User error' },
    '-11': { message: 'Tài khoản chưa được xác thực hoặc bị khóa.', type: 'User error' },
    '-12': { message: 'Giao dịch đã tồn tại.', type: 'Merchant error' },
    '-13': { message: 'Giao dịch đã hết hạn.', type: 'Merchant error' },
    '-14': { message: 'Giao dịch thất bại.', type: 'Unknown' },
    '-15': { message: 'Giao dịch đang được xử lý.', type: 'System error' },
    '-20': { message: 'Mã đơn hàng không hợp lệ.', type: 'Merchant error' },
    '-21': { message: 'Merchant không tồn tại.', type: 'Merchant error' },
    '-22': { message: 'Merchant không hoạt động.', type: 'Merchant error' },
    '-23': { message: 'Merchant không được phép thực hiện giao dịch này.', type: 'Merchant error' },
    '-24': { message: 'Giao dịch bị từ chối bởi ngân hàng.', type: 'Bank error' },
    '-25': { message: 'Ngân hàng đang bảo trì.', type: 'Bank error' },
    '-26': { message: 'Thẻ/Tài khoản không được phép thực hiện giao dịch.', type: 'Bank error' },
    '-27': { message: 'Thẻ hết hạn sử dụng.', type: 'Bank error' },
    '-28': { message: 'Thẻ bị khóa.', type: 'Bank error' },
    '-29': { message: 'Sai thông tin thẻ.', type: 'User error' },
    '-30': { message: 'Người dùng hủy giao dịch.', type: 'User error' },
    '-31': { message: 'Giao dịch không thành công.', type: 'Unknown' },
    '-32': { message: 'Số tiền không đúng.', type: 'Merchant error' },
    '-33': { message: 'Đơn hàng đã được thanh toán.', type: 'Merchant error' },
    '-34': { message: 'Đơn hàng đã bị hủy.', type: 'Merchant error' },
    '-35': { message: 'Đơn hàng chưa được thanh toán.', type: 'Merchant error' },
    '-36': { message: 'Đơn hàng đã hết hạn thanh toán.', type: 'Merchant error' },
    '-40': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'System error' },
    '-41': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'System error' },
    '-42': { message: 'Hệ thống đang có lỗi, vui lòng quay lại sau.', type: 'System error' },
    '-49': { message: 'Giao dịch chưa được thực hiện. Vui lòng thực hiện lại.', type: 'User error' },
    '-54': { message: 'Giao dịch hết hạn thanh toán, quý khách vui lòng thử lại.', type: 'Merchant error' },
  };

  const errorInfo = codeMap[code];
  if (!errorInfo) {
    return 'Hệ thống đang có lỗi, vui lòng quay lại sau.';
  }

  if (errorInfo.type === 'System error') {
    return errorTypes['System error'];
  }

  return errorInfo.message;
};

// Example usage:
// getZaloPayMessage('-6') // Returns "Hệ thống đang có lỗi, vui lòng quay lại sau."
// getZaloPayMessage('-5') // Returns "Số tiền không hợp lệ."