const express = require('express')

const { createpatient, deletePatient, recoverpatient, getallpatient, getonepatient, updatePatient, getAllpatientByHospital, addDiagnosis }= require("../controller/patientcontroller")
const {userAuth} = require('../middleware/AUTH')
const router = express.Router()
//const {checkUser}= require('../middleware/authorization')

router.route("/createpatient").post(userAuth,createpatient)
router.route("/delete/:patientID").delete(deletePatient)
router.route("/recover/:patientID").patch(recoverpatient)
router.route("/getallpatient").get(getallpatient)
router.route("/getonepatient/:patientID").get(getonepatient)
router.route("/updatepatient/:patientID").patch(updatePatient)
router.route("/hospitals/patient/:hospitalcode").get(getAllpatientByHospital)
router.route("/addDiagnosis/").post(addDiagnosis)

//geting authomatic count
// const { getTotalDataCount }= require("../middleware/middleware")
// router.route("/getallcount").get(getTotalDataCount)




module.exports = router
