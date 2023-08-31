const express = require('express')

const { createStaffprofile, getAllStaffByHospital, logIn, signOut, verifyEmail, resendVerificationEmail, updateStaff, getOne, deleteStaff }= require("../controller/staffController")
const { forgotPassword, changePassword, resetPassword }= require('../controller/staffPasswordController')
const {authenticateUser}= require("../middleware/AUTH")
const router = express.Router()

router.route('/createprofile/').post(createStaffprofile)
router.route("/hospitals/staff/:hospitalcode").get(authenticateUser, getAllStaffByHospital)
router.route('/staffverifyemail/:token').post(verifyEmail)
router.route('/staff-resend-verification').post(resendVerificationEmail)
router.route('/stafflogin').post(logIn)
router.route('/staffsignout/:staffId').post(signOut)
router.route('/staffupdate/:staffID').put(authenticateUser,updateStaff)
router.route('/getonestaff/:staffID').get(authenticateUser, getOne)
router.route('/deletestaff/:hospitalcode/:staffID').delete(authenticateUser, deleteStaff)

// password reset and change and forgot
router.route("/staff-forgotpassword").post(forgotPassword)
router.route("/staff-changepassword/:token").post(changePassword)
router.route("/staff-resetpassword/:token").post(resetPassword)



module.exports = router

