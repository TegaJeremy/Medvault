const express = require('express')

const { createpatient, deletePatient, recoverpatient, getallpatient, getonepatient, updatePatient, getAllpatientByHospital, addDiagnosis }= require("../controller/patientcontroller")
const {userAuth, findUserAndCheckLogin, authenticateUser} = require('../middleware/AUTH')
const router = express.Router()
//const {checkUser}= require('../middleware/authorization')

router.route("/createpatient/").post(authenticateUser, createpatient)
router.route("/delete/:patientID").delete( authenticateUser, deletePatient)
router.route("/recover/:patientID").patch(authenticateUser,recoverpatient)
router.route("/getallpatient").get(authenticateUser,getallpatient)
router.route("/getonepatient/:patientID").get  (authenticateUser, getonepatient)
router.route("/updatepatient/:patientID").patch(authenticateUser,updatePatient)
router.route("/hospitals/patient/:hospitalcode").get(authenticateUser,getAllpatientByHospital)
router.route("/addDiagnosis/").post(addDiagnosis)

//geting authomatic count
// const { getTotalDataCount }= require("../middleware/middleware")
// router.route("/getallcount").get(getTotalDataCount)



module.exports = router
