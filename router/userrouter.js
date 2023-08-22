const express = require('express')

const { register, verifyEmail, resendVerificationEmail, login,logout, updatehospitalinfo, deleteAccount, createstaff, getHospitalWithStaffAndPatients }= require('../controller/registrationController.')
const { forgotPassword, changePassword, resetPassword }= require('../controller/passwordController')
const { getallHospital, getHospitalByID }= require('../controller/admincontroller')
const {userAuth, authenticateUser}= require('../middleware/AUTH')
const router = express.Router()

// route for Registration and email verification
router.route("/registration").post(register)
router.route("/verifyemail/:token").post(verifyEmail)
router.route("/resendverificationemail").post(resendVerificationEmail)

// Your logout route


// login and logout route
router.route("/login").post(login)
router.route("/logouthospital/:userId").post(logout)

// password reset and change and forgot
router.route("/forgotpassword").post(authenticateUser,forgotPassword)
router.route("/changepassword/:token").post(authenticateUser,changePassword)
router.route("/resetpassword/:token").post(authenticateUser,resetPassword)

// admin 
router.route("/getallhospitals").get(authenticateUser,getallHospital)
router.route("/getbyid/:hospitalcode").get(authenticateUser,getHospitalByID)
router.route("/updatehospitalinfo/:hospitalcode").putauthenticateUser,(updatehospitalinfo)
router.route("/deleteaccount/:hospitalcode").post(authenticateUser,deleteAccount)

//creating a staff(sending staff a link)
router.route('/creatingastaff').post(authenticateUser, createstaff)

//geting hospital
router.route("/gethospital/:hospitalId").get(authenticateUser, getHospitalWithStaffAndPatients)




module.exports = router
