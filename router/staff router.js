const express = require('express')

const { createStaffprofile, getAllStaffByHospital, logIn, signOut, verifyEmail, resendVerificationEmail, updateStaff, getOne, deleteStaff }= require("../controller/staffController")
const { forgotPassword, changePassword, resetPassword }= require('../controller/staffPasswordController')
const router = express.Router()

router.route('/createprofile/').post(createStaffprofile)
router.route("/hospitals/staff/:hospitalcode").get(getAllStaffByHospital)
router.route('/staffverifyemail/:token').post(verifyEmail)
router.route('/staff-resend-verification').post(resendVerificationEmail)
router.route('/stafflogin').post(logIn)
router.route('/staffsignout/:staffid').post(signOut)
router.route('/staffupdate/:staffID').put(updateStaff)
router.route('/getonestaff').get(getOne)
router.route('/deletestaff/:hospitalcode/:staffID').delete(deleteStaff)

// password reset and change and forgot
router.route("/staff-forgotpassword").post(forgotPassword)
router.route("/staff-changepassword/:token").post(changePassword)
router.route("/staff-resetpassword/:token").post(resetPassword)




module.exports = router
