const express = require('express')

const { createpatient, deletePatient, recoverpatient, getallpatient, getonepatient }= require("../controller/patientcontroller")
const router = express.Router()

router.route("/create").post(createpatient)
router.route("/delete/:patientID").delete(deletePatient)
router.route("/recover/:patientID").patch(recoverpatient)
router.route("/getallpatient").get(getallpatient)
router.route("/getonepatient/:patientID").get(getonepatient)

//geting authomatic count
const { getTotalDataCount }= require("../middleware/middleware")
router.route("/getallcount").get(getTotalDataCount)




module.exports = router
