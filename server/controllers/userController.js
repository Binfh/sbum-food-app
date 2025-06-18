import User from "../models/User.js"; 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import nodemailer from 'nodemailer';

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // hoặc dịch vụ email khác
  auth: {
    user: process.env.EMAIL_USER, // email của bạn
    pass: process.env.EMAIL_PASSWORD // mật khẩu ứng dụng
  }
});

// Register User : /api/user/register
export const register = async (req,res) =>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.json({success:false,message:'Vui lòng điền đầy đủ thông tin'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser)
        {
          return res.json({success:false,message:'Email đã tồn tại'})
        }

        if (name.length > 20 ) {
          return res.json({
            success: false,
            message: 'Tên đăng nhập không được dài quá 20 ký tự'
          });
        }

        if (name.length < 2) {
          return res.json({
            success: false,
            message: 'Tên đăng nhập phải có ít nhất 2 ký tự'
          });
        }

        if (password.length < 6) {
          return res.json({
            success: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự'
          });
        }

        if (password.length > 20) {
          return res.json({
            success: false,
            message: 'Mật khẩu không được dài quá 20 ký tự'
          });
        }

        const specialCharRegex = /[^a-zA-Z0-9]/;
        if (specialCharRegex.test(password)) {
          return res.json({
            success: false,
            message: 'Mật khẩu chỉ được chứa chữ cái và số, không được có ký tự đặc biệt hoặc dấu cách'
          });
        }

        if (!email.endsWith('@gmail.com')) {
            return res.json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({name,email,password: hashedPassword})

        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'30d'})

        res.cookie('token',token,{
            httpOnly : true,
            secure: process.env.NODE_ENV || 'production',
            sameSite :process.env.NODE_ENV || 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true,user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          cartItems: user.cartItems
        }})
    }catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}

// Login User : /api/user/login 
export const login = async(req,res) =>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.json({success:false,message:'Vui lòng nhập email và mật khẩu'})
        }
        const user = await User.findOne({email})

        if(!user){
            return res.json({success:false,message:'Thông tin đăng nhập không chính xác'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.json({success:false,message:'Thông tin đăng nhập không chính xác'})

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'30d'})

        res.cookie('token',token,{
            httpOnly : true,
            secure: process.env.NODE_ENV || 'production',
            sameSite :process.env.NODE_ENV || 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        // FIXED: Thêm _id vào response
        return res.json({success:true,user: {
            _id: user._id,  // ← THÊM DÒNG NÀY
            email: user.email,
            name: user.name,
            cartItems: user.cartItems
        }})
    }catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}


export const isAuth = async(req,res) =>{
    try{
        const userId = req.user.userId; 
        const user = await User.findById(userId).select("-password")
        
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'Người dùng không tồn tại' 
            });
        }
        
        // Đảm bảo trả về đầy đủ thông tin bao gồm _id
        return res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                cartItems: user.cartItems || {}
            }
        })
    }catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}

// Logout User 
export const logout = async(req,res) =>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV || 'production',
            sameSite :process.env.NODE_ENV || 'production' ? 'none' : 'strict',
        });
        return res.json({success:true,message:'Đã đăng xuất'})
    }catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}

export const changePassword  = async (req, res) => {
  // Only allow PUT requests for password change
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Basic validation
    if (!currentPassword || !newPassword) {
      return res.json({ 
        success: false, 
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    // Password length validation
    if (newPassword.length < 6) {
      return res.json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    if (password.length > 20) {
      return res.json({
        success: false,
        message: 'Mật khẩu không được dài quá 20 ký tự'
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ 
        success: false, 
        message: 'Người dùng không tồn tại' 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ 
        success: false, 
        message: 'Mật khẩu hiện tại không chính xác' 
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    return res.json({ 
      success: true, 
      message: 'Đổi mật khẩu thành công' 
    });
  } catch (error) {
    console.error('Password change error:', error.message);
    return res.json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi đổi mật khẩu' 
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: 'Vui lòng nhập email'
      });
    }

    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      });
    }

    // Tạo mã OTP 6 chữ số
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // Lưu mã OTP vào database
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = resetCodeExpires;
    await user.save();

    // Gửi email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã xác nhận đặt lại mật khẩu',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Đặt lại mật khẩu</h2>
          <p>Xin chào <strong>${user.name}</strong>,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã xác nhận của bạn là:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 3px;">${resetCode}</h1>
          </div>
          <p><strong>Lưu ý:</strong> Mã này sẽ hết hạn sau 10 phút.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Email này được gửi tự động, vui lòng không phả hồi.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: 'Mã xác nhận đã được gửi đến email của bạn'
    });

  } catch (error) {
    console.error('Forgot password error:', error.message);
    return res.json({
      success: false,
      message: 'Đã xảy ra lỗi khi gửi mã xác nhận'
    });
  }
};

// NEW: Xác nhận mã OTP và đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // Validation
    if (!email || !resetCode || !newPassword) {
      return res.json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    if (newPassword.length < 6) {
      return res.json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    if (password.length > 20) {
      return res.json({
        success: false,
        message: 'Mật khẩu không được dài quá 20 ký tự'
      });
    }

    // Tìm user với mã reset code
    const user = await User.findOne({
      email,
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn'
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu và xóa mã reset
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });

  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.json({
      success: false,
      message: 'Đã xảy ra lỗi khi đặt lại mật khẩu'
    });
  }
};

// NEW: Đổi tên tài khoản
export const changeName = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newName } = req.body;

    // Validation
    if (!newName || newName.trim().length === 0) {
      return res.json({
        success: false,
        message: 'Vui lòng nhập tên mới'
      });
    }

    if (newName.trim().length < 2) {
      return res.json({
        success: false,
        message: 'Tên phải có ít nhất 2 ký tự'
      });
    }

    if (newName.trim().length > 20) {
      return res.json({
        success: false,
        message: 'Tên không được vượt quá 20 ký tự'
      });
    }

    // Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Cập nhật tên
    user.name = newName.trim();
    await user.save();

    return res.json({
      success: true,
      message: 'Đổi tên thành công',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cartItems: user.cartItems
      }
    });

  } catch (error) {
    console.error('Change name error:', error.message);
    return res.json({
      success: false,
      message: 'Đã xảy ra lỗi khi đổi tên'
    });
  }
};
