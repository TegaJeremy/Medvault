const patientModel = require('../model/patientModel')
const cloudinary = require('../middleware/cloudinary')
const fs = require('fs')
const validator = require('../middleware/validation')


//creating a patient
const createpatient = async (req, res)=>{
    try{
        const {patientName,dateOfBirth,gender,homeAddress,email,phoneNumber,bloodGroup,fathersName,fathersPhonenumber,mothersName,
            MothersPhonenumber,relationshipStatus,spouseName,spousePhonenumber,otherContacts,diagnosis} = req.body
    //     const {error} = await validatePerson(req.body);
    //      if (error) {
    //     res.status(409).json({
    //         message: error.details[0].message
    //     })
    // } else {

    // const validation = validator(email, phoneNumber, patientName);
    // if (!validation.isValid) {
    //   return res.status(400).json({
    //     message: validation.message
    //   });
    // }

            const ID = Math.floor(Math.random()*10000)
    
        const patientnewImage = await cloudinary.uploader.upload(req.files.patientImage.tempFilePath, (error, patientImage) => {
            try{return patientImage}
            catch (error) {
               console.log(error.message)
            }
    
        })
        const patientProfile = new patientModel({
            patientName,
            dateOfBirth,
            gender,
            homeAddress,
            email,
            phoneNumber,
            bloodGroup,
            fathersName,
            fathersPhonenumber,
            mothersName,
            MothersPhonenumber,
            relationshipStatus,
            spouseName,
            spousePhonenumber,
            otherContacts,
            diagnosis,
            patientID:ID,
            patientImage: patientnewImage.secure_url,
            public_id:patientnewImage.public_id
            // {
            //         public_id:{public_id:patientnewImage.public_id,
            //             url:patientnewImage.url}
            //         }
                
            })

        

            const patientInfo = await patientProfile.save();
             if(patientInfo){
             res.status(201).json({
                 message: 'Patient information has been created succesfully',
                 data: patientInfo
             })
         }else{
             res.status(400).json({
                 message: 'Patient information could not be created',
                
             })
     
         }
        
     
         }catch(error){
             res.status(500).json({
                 message:error.message
             })
         }
     }
     

     const getallpatient = async (req, res) => {
        const getAllPatients = await patientModel.find();
        if (getAllPatients.length === 0) {
            res.status(200).json({
                totalPatients: getAllPatients.length,
                message: "All patients in the database",
                data: getAllPatients
            })
        } else {
            res.status(404).json({
                message: "Can't find all patients in the database"
            })
        }
    
    }

    const getonepatient = async (req, res) => {
        let {patientID}= req.params
        const patient = await patientModel.findOne({patientID})
        if (patient) {
            res.status(200).json({
                message:"patient:",
                data: patient
            })
        } else {
            res.status(404).json({
                message: "Unable to find patient with ID "+{patient}
            })
        }
        
    }

    const updatePatient = async (req, res) => {
        try {
            const {patientID} = req.params;
            const patient = await patientModel.findOne({patientID})
            
            const {patientName,dateOfBirth,gender,homeAddress,email,PhoneNumber,bloodGroup,fathersName,fathersPhonenumber,mothersName,
                MothersPhonenumber,relationshipStatus,spouseName,spousePhonenumber,otherContacts,diagnosis} = req.body;
    
            if(patient) {
                if(patient.patientImage) {
                    const public_id = patient.patientImage.split('/').pop().split('.')[0];
                    console.log(public_id);
                    await cloudinary.uploader.destroy(public_id);
                }
                const data = await cloudinary.uploader.upload(req.file.path);
                patient.patientName = patientName;
                patient.dateOfBirth = dateOfBirth;
                patient.gender = gender;
                patient.homeAddress = homeAddress;
                patient.email = email;
                patient.PhoneNumber = PhoneNumber;
                patient.bloodGroup=bloodGroup
                patient.fathersName=fathersName
                patient.fathersPhonenumber=fathersPhonenumber
                patient.MothersPhonenumber=MothersPhonenumber
                patient.relationshipStatus=relationshipStatus
                patient.spouseName=spouseName
                patient.spousePhonenumber=spousespousePhonenumber
                patient.otherContacts=otherContacts
                patient.diagnosis=diagnosis
                patient.patientImage = req.file.path;
    
                fs.unlinkSync(req.file.path);
                res.status(200).json({
                    message: 'Patient Updated Successfully',
                    data:data
                })
            } else {
                res.status(404).json({
                    message: 'Patient not found'
                })
            }
        } catch (error) {
            const err = error.message;
            res.status(500).json({
                message: `error ${err}`
            })
        }
    }


    // exports.deletePatient = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const patient = await patientModel.findById(id);
    //         if(person) {
    //             if(patient.patientImage) {
    //                 const public_id = patient.patientImage.split('/').pop().split('.')[0];
    //                 console.log(public_id);
    //                 await cloudinary.uploader.destroy(public_id);
    //             }
    //             res.status(200).json({
    //                 message: 'Patient Deleted Successfully'
    //             })
    //         }
    //     } catch (error) {
    //         const err = error.message;
    //         res.status(500).json({
    //             message: `error ${err}`
    //         })
    //     }
    // }

//deleting a patient
const deletePatient = async (req,res)=>{
    try {
        const {patientID} = req.params
        const patient = await patientModel.findOne({patientID})
        if(!patient){
            res.status(400).json({message:"patient not found"})
        }else{
              // instead of permerneting deleting just turn the delete to false
        patient.deleted = true
        await patient.save()
        res.status(200).json({message:"patient has been deleted"})
        }
    

        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//getting all patient


//function to rcover a deleted patient
 const recoverpatient = async (req,res)=>{
    try {
        const {patientID} = req.params
        const patient = await patientModel.findOne({patientID})
        if(!patient){
            res.status(400).json({message:"patient not found"})
        }
            // only recover if it was previously deleted
         if(patient.deleted){
            patient.deleted = false
            await patient.save()
        res.status(200).json({message:"patient recovered successfully"})
         }
        
        
        
    } catch (error) {
        res.status(500).json(error.message)
    }
 }

 

// // POST /patients/:id/diagnosis
// router.post('/patients/:id/diagnosis', async (req, res) => {
//   const { id } = req.params;
//   const { diagnosisData } = req.body;

//   try {
//     // Find the patient by ID
//     const patient = await Patient.findById(id);

//     if (!patient) {
//       return res.status(404).json({ error: 'Patient not found' });
//     }

//     // Add data to the diagnosis array
//     patient.diagnosis.push(diagnosisData);

//     // Save the updated patient
//     await patient.save();

//     return res.json({ message: 'Diagnosis data added successfully', patient });
//   } catch (err) {
//     return res.status(500).json({ error: 'Something went wrong' });
//   }
// });




module.exports={
    createpatient,
    deletePatient,
    recoverpatient,
    getallpatient,
    getonepatient,
    updatePatient
}