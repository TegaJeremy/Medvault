const express = require('express')

const { createStaffprofile, getAllStaffByHospital }= require("../controller/staffController")
const router = express.Router()

router.route('/createprofile').post(createStaffprofile)
router.route("/hospitals/staff/:hospitalID").get(getAllStaffByHospital)




module.exports = router
