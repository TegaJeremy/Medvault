const express = require('express')

const { register, verifyEmail, resendVerificationEmail, login,logout, updatehospitalinfo, deleteAccount, createstaff, getHospitalWithStaffAndPatients }= require('../controller/registrationController.')
const { forgotPassword, changePassword, resetPassword }= require('../controller/passwordController')
const { getallHospital, getHospitalByID }= require('../controller/admincontroller')
const {userAuth}= require('../middleware/AUTH')
const router = express.Router()

// route for Registration and email verification
router.route("/registration").post(register)
router.route("/verifyemail/:token").post(verifyEmail)
router.route("/resendverificationemail").post(resendVerificationEmail)

// Your logout route


// login and logout route
router.route("/login").post(login)
router.route("/logouthospital/:hospitalId").post(userAuth,logout)

// password reset and change and forgot
router.route("/forgotpassword").post(forgotPassword)
router.route("/changepassword/:token").post(changePassword)
router.route("/resetpassword/:token").post(resetPassword)

// admin 
router.route("/getallhospitals").get(getallHospital)
router.route("/getbyid/:hospitalcode").get(getHospitalByID)
router.route("/updatehospitalinfo/:hospitalcode").put(updatehospitalinfo)
router.route("/deleteaccount/:hospitalcode").post(deleteAccount)

//creating a staff(sending staff a link)
router.route('/creatingastaff').post(createstaff)

//geting hospital
router.route("/gethospital/:hospitalId").get(getHospitalWithStaffAndPatients)




module.exports = router
