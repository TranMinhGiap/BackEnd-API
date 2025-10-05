const sendErrorHelper = require('../../../helpers/sendError.helper');
const User = require('../models/user.modal');
const md5 = require("md5");

// [POST] /users/register
module.exports.register = async (req, res) => {
  try {
    // Kiểm tra email đã tồn tại hay chưa
    const exitEmail = await User.findOne({ deleted: false, email: req.body.email });
    if(exitEmail){
      return sendErrorHelper.sendError(res, 400, "Email đã tồn tại", "Email đã tồn tại");
      // return để tránh gửi nhiều phản hồi trong 1 request
    }
    // Nếu không tồn taj thì mã hóa mật khẩu và lưu vào database
    req.body.password = md5(req.body.password);
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password
    });
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.json({
      success: true,
      status: 200,
      message: "Đăng ký thành công !",
      tokenUser: user.tokenUser
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}
