const sendErrorHelper = require("../../../helpers/sendError.helper");
const User = require("../models/user.modal");

module.exports.requireAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    // Token ở index 1
    const tokenUser = req.headers.authorization.split(" ")[1];
    // Kiểm tra token hợp lệ hay không
    const user = await User.findOne({ tokenUser: tokenUser, deleted: false, status: "active" }).select("-password");
    if (!user) {
      return sendErrorHelper.sendError(res, 400, "Lỗi server", "Token không hợp lệ !");
    } else {
      // req cũng chỉ là 1 object được truyền lần lượt qua các middleware => tận dụng nó để truyền vào các middleware bằng cách gán thêm dữ liệu vào bình thường
      // => lưu thông tin vào req
      req.user = user
    }

  } else {
    return sendErrorHelper.sendError(res, 400, "Lỗi server", "Chưa có token !");
  }
  next();
}