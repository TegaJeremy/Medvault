const passwordModel = require('../model/registrationmodel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')





//creating a transporter for sending mail
const transporter = nodemailer.createTransport({
  service:"Gmail",
  port: 2525,
auth: {
  user: process.env.user,
  pass: process.env.password
}
});

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if the email exists in the userModel
      const user = await passwordModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
  
      // Generate a reset token
      const resetToken = await jwt.sign({ userId: user._id }, process.env.secretKey, { expiresIn: "10m" });
  
      // Send reset password email
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset",
        html: `Please click on the link to reset your password: <a href="${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}">Reset Password</a> link expires in 10 minutes`, 
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        message: "Password reset email sent successfully"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  }

  // Reset Password
const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password  } = req.body;
  
      // Verify the user's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
      
      // Get the user's Id from the token
      const userId = decodedToken.userId;
  
      // Find the user by ID
      const user = await passwordModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltedRound);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({
        message: "Password reset successful"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  }

  // Change Password
const changePassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password, existingPassword } = req.body;
  
      // Verify the user's token
      const decodedToken = jwt.verify(token, process.env.secretKey);

      // Get the user's Id from the token
      const userId = decodedToken.userId;
  
      // Find the user by ID
      const user = await passwordModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
  
      // Confirm the previous password
      const isPasswordMatch = await bcrypt.compare(existingPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Existing password does not match"
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltedRound);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({
        message: "Password changed successful"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  }

  

  module.exports = {
    forgotPassword,
    resetPassword,
    changePassword
  }


 
    