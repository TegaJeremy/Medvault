const passwordModel = require('../model/registrationmodel')
const staffModel = require('../model/staffModel')
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
      const admin= await passwordModel.findOne({ email });
      const staff = await staffModel.findOne({email})
      const user = admin || staff
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
  
      // Generate a reset token
      const token =  jwt.sign({ userId: user._id }, process.env.secretKey, { expiresIn: "20m" });
      const link =`https://medvault-xixt.onrender.com/#/newPassword/${token}`
        
      // Send reset password email
      // const mailOptions = {
      //   from: process.env.SENDER_EMAIL,
      //   to: user.email,
      //   subject: "Password Reset",
      //   html: `Please click on the link  to reset your password:${link} link expires in 15 minutes`, 
      // };
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #000000;
                    color: #E0F7F6;
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #2aafafaf;
                    border-radius: 10px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .link {
                    color: #E0F7F6;
                    text-decoration: none;
                    border-bottom: 1px solid #fcfcfc;
                    transition: border-bottom 0.3s ease;
                }
                .link:hover {
                    border-bottom: 2px solid #e71717;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                }
                .image {
                    max-width: 80%;
                    display: block;
                    margin: 0 auto 10px;
                }
                
                /* Mobile responsiveness */
                @media (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    .header {
                        margin-bottom: 10px;
                    }
                    .footer {
                        margin-top: 10px;
                    }
                    .image {
                        max-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://raw.githubusercontent.com/TegaJeremy/Medvault/main/Medvault.png" alt="MED-VAULT" class="image">
                    <h1>Password Reset</h1>
                </div>
                <p>Please click on the link below to reset your password:</p>
                <p><a class="link" href="${link}">Reset Password</a></p>
                <p>This link expires in 15 minutes.</p>
                <div class="footer">
                    <p>If you didn't request a password reset, you can ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        
        
        `,
    };
    
    // Use nodemailer to send the email...
    
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
      const admin = await passwordModel.findById(userId);
      const staff = await staffModel.findById(userId)
      const user = admin || staff 
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
      const admin = await passwordModel.findById(userId);
      const staff = await staffModel.findById(userId);
      const user = admin || staff
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

  //creating staff

  

  

  module.exports = {
    forgotPassword,
    resetPassword,
    changePassword
  }


 
    