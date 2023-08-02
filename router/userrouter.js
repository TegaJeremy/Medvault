const express = require('express')

const { register, verifyEmail, resendVerificationEmail, login,logout }= require('../controller/registrationController.')
const { forgotPassword, changePassword, resetPassword }= require('../controller/passwordController')
const { getallHospital, getHospitalByID }= require('../controller/admincontroller')
const router = express.Router()

// route for Registration and email verification
router.route("/registration").post(register)
router.route("/verifyemail/:token").post(verifyEmail)
router.route("/resendverificationemail").post(resendVerificationEmail)

// login and logout route
router.route("/login").post(login)
router.route("/logout/:id").post(logout)

// password reset and change and forgot
router.route("/forgotpassword").post(forgotPassword)
router.route("/changepassword/:token").post(changePassword)
router.route("/resetpassword/:token").post(resetPassword)

// admin 
router.route("/getallhospitals").get(getallHospital)
router.route("/getbyid/:hospitalcode").get(getHospitalByID)



module.exports = router
