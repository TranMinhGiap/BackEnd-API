const sendErrorHelper = require('../../../helpers/sendError.helper');
const User = require('../models/user.modal');
const ForgotPassword = require('../models/forgot-password.model');
const md5 = require("md5");

const generateHelper = require('../../../helpers/generate.helper');
const sendMailHelper = require('../../../helpers/send-mail.helper');

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
// [POST] /users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Kiểm tra tài khoản dựa trên email
    const account = await User.findOne({ email: email, deleted: false });
    if(!account){
      return sendErrorHelper.sendError(res, 400, "Lỗi server", "Email không hợp lệ !");
    }
    if(account.status === "inactive"){
      return sendErrorHelper.sendError(res, 400, "Lỗi server", "Tài khoản đã bị khóa !");
    }
    // lưu email vào db trong 3p và gửi otp về client để xác nhận
    const otp = generateHelper.generateRandomNumber(4);
    const timeExpire = 3;

    const objectForgotPassword = new ForgotPassword({
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + timeExpire * 60 * 1000)
    });

    // Lưu email
    await objectForgotPassword.save();

    // Gửi opt về email
    const subject = "Mã OTP lấy lại mật khẩu";
    const html = `<p>Mã OTP của bạn là: <b>${otp}</b>. Mã có hiệu lực trong ${timeExpire} phút !</p>`;
    sendMailHelper.sendMail(email, subject, html);
    
    res.json({
      success: true,
      status: 200,
      message: "Gửi mã OTP để xác nhận thành công !",
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}
// [POST] /users/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Kiểm tra otp còn hiệu lực không
    const exitOtp = await ForgotPassword.findOne({ email: email });

    if(!exitOtp){
      return sendErrorHelper.sendError(res, 500, "Lỗi server", "Mã OTP đã hết hiệu lực !");
    }
    if(exitOtp.otp !== otp){
      return sendErrorHelper.sendError(res, 500, "Lỗi server", "Mã OTP không đúng !");
    }
    
    // Khi xác thực opt thành công phải xóa otp đi tránh sử dụng nhiều lần
    await ForgotPassword.deleteOne({ _id: exitOtp.id });

    // Trả về token
    const infoUser = await User.findOne({ email: email, status: "active", deleted: false });
    if(infoUser){
      res.cookie("tokenUser", infoUser.tokenUser);
    }

    res.json({
      success: true,
      status: 200,
      message: "Xác nhận OTP thành công !",
      tokenUser: infoUser.tokenUser
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}
// [POST] /users/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
    const { tokenUser, password } = req.body;

    // Kiểm tra token có hợp lệ hay không
    const exitToken = await User.findOne({ tokenUser: tokenUser, deleted: false, status: "active" });
    if(!exitToken){
      return sendErrorHelper.sendError(res, 400, "Lỗi server", "Yêu cầu không hợp lệ !");
    }
    
    // Khi hợp lệ tiến hành lưu password mới
    await User.updateOne({ _id: exitToken.id }, { password: md5(password) });

    res.json({
      success: true,
      status: 200,
      message: "Đổi mật khẩu thành công !"
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}
// [GET] /users/info
module.exports.info = async (req, res) => {
  try {
    const { tokenUser } = req.cookies;

    // Kiểm tra token có hợp lệ hay không
    const exitUser = await User.findOne({ tokenUser: tokenUser, deleted: false, status: "active" }).select("-password -tokenUser");
    if(!exitUser){
      return sendErrorHelper.sendError(res, 400, "Lỗi server", "Yêu cầu không hợp lệ !");
    }

    res.json({
      success: true,
      status: 200,
      message: "Lấy thông tin thành công !",
      data: exitUser
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}
