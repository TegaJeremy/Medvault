const express = require('express')

const { createStaffprofile, getAllStaffByHospital, logIn, signOut, verifyEmail, resendVerificationEmail, updateStaff, getOne, deleteStaff }= require("../controller/staffController")
const router = express.Router()

router.route('/createprofile').post(createStaffprofile)
router.route("/hospitals/staff/:hospitalID").get(getAllStaffByHospital)
router.route('/staffverifyemail/:token').post(verifyEmail)
router.route('/resendverification').post(resendVerificationEmail)
router.route('/stafflogin').post(logIn)
router.route('/staffsignout').post(signOut)
router.route('/staffupdate/:staffID').put(updateStaff)
router.route('/getonestaff').get(getOne)
router.route('/deletestaff/:hospitalcode/:staffID').delete(deleteStaff)




module.exports = router
