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
// [POST] /users/login
module.exports.login = async (req, res) => {
  try {
    // Kiểm tra email 
    const account = await User.findOne({ email: req.body.email, deleted: false });
    if(!account){
      return sendErrorHelper.sendError(res, 400, "Lỗi server", "email không đúng !");
    }
    // Có email thì kiểm tra password tương ứng
    if(account.password !== md5(req.body.password)){
      return sendErrorHelper.sendError(res, 400, "Lỗi server", "password không đúng !");
    }
    // Thành công thì trả về token
    res.cookie("tokenUser", account.tokenUser);
    res.json({
      success: true,
      status: 200,
      message: "Đăng nhập thành công !",
      tokenUser: account.tokenUser
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}
