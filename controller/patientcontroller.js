const patientModel = require('../model/patientModel')
const cloudinary = require('../middleware/cloudinary')
const hospitalModel = require('../model/registrationmodel')
const fs = require('fs')
const { error } = require('console')
const validator = require('../middleware/validation')


//creating a patient, with the hospital code 
const createpatient = async (req, res)=>{
    try{
        const {patientName,dateOfBirth,gender,homeAddress,email,phoneNumber,bloodGroup,fathersName,fathersPhonenumber,mothersName,
            MothersPhonenumber,relationshipStatus,spouseName,spousePhonenumber,otherContacts,hospitalcode,diagnosis} = req.body
             // Check if the email is already taken
    const existingPatient = await patientModel.findOne({ email });
    if (existingPatient) {
      return res.status(409).json({ message: 'Email already exists' });}
       // Check if the phoneNumber is provided and not null
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone Number is required' });
      }
  
      // Check if the phoneNumber is unique
      const existingPatient2 = await patientModel.findOne({ phoneNumber });
      if (existingPatient2) {
        return res.status(409).json({ message: 'Phone Number already exists' });
      }
     // look for the hospital
     const gethospital = await hospitalModel.findOne({hospitalcode})
     if (!gethospital) {
         return res.status(404).json({ message: "Error getting hospital. Please check ID." })
     }
    
     //validate the impute
    const validation = validator(email, phoneNumber, patientName);
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message
      });
    }
      //get a random id for the patient
             const ID = Math.floor(Math.random()*10000)
            
          //upload photo function
          const patientphoto = await cloudinary.uploader.upload(req.files.patientImage.tempFilePath, (error, patientImage) => {
            try{return patientImage}
            catch (error) {
                error.message
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
            patientImage: {public_id:patientphoto.public_id,
                url:patientphoto.url}
          
          
            })
          const patientInfo = await patientProfile.save();
             if(patientInfo){
             res.status(201).json({
                 message: 'Patient information has been created succesfully',
                 data: patientInfo,
                
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
     
     //getting all patient in the database
     const getallpatient = async (req, res) => {
        const AllPatients = await patientModel.find();
        if (AllPatients) {
            res.status(200).json({
                message: "All patients in the database",
                data: AllPatients
            })
        } else {
            res.status(404).json({
                message: "Can't find all patients in the database"
            })
        }
    
    }

    //getting all patient associated to one hospital
    const getAllpatientByHospital = async (req, res) => {
        try {
          const { hospitalcode } = req.params;
          
           // Look for the hospital with the specified hospitalcode
           const hospital = await hospitalModel.findOne({hospitalcode });
          
      
          if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
          }
      
          // Find all staff members with the same hospitalcode
          const patient = await patientModel.find({ hospitalcode });
        
          if(patient === 0){
            res.status(404).json({message:"there are no patient registered "})
    
          }else(
            res.status(200).json({ message: 'all patient under this hospital are', data: patient })
          )
         
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      };

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

    // const updatePatient = async (req, res) => {
    //     try {
    //         const {patientID} = req.params;
    //         const patient = await patientModel.findOne({patientID})
    //         if(!patient){
    //             res.status(404).json({message:'error getting staff please chech id'})
    //         }
                    
    //         const {patientName,dateOfBirth,gender,homeAddress,email,PhoneNumber,bloodGroup,fathersName,fathersPhonenumber,mothersName,
    //             MothersPhonenumber,relationshipStatus,spouseName,spousePhonenumber,otherContacts,} = req.body;
    
    //             const updated = {
    //             patientName:patientName || patient.patientName,
    //             dateOfBirth:dateOfBirth || patient.dateOfBirth,
    //             gender:gender|| patient.gender,
    //             homeAddress:homeAddress || patient.homeAddress,
    //             emai:email || patient.email,
    //             PhoneNumber:PhoneNumber || patient.PhoneNumber,
    //             bloodGroup:bloodGroup || patient.bloodGroup,
    //             fathersName:fathersName  || patient.fathersName,
    //             fathersPhonenumber:fathersPhonenumber || patient.fathersPhonenumber,
    //             mothesName:mothersName || patient.fathersPhonenumber,
    //             MothersPhonenumber:MothersPhonenumber || patient.MothersPhonenumber,
    //             relationshipStatus:relationshipStatus || patient.relationshipStatus,
    //             spouseName:spouseName || patient.spouseName,
    //             spousePhonenumber:spousePhonenumber|| patient.spousePhonenumber,
    //             otherContacts:otherContacts || patient.otherContacts
    //           }

    //    // Perform the update and set { new: true } option to get the updated document
    //   const updatedStaff = await patientModel.findOneAndUpdate({ patientID }, updated, { new: true });
  
    //   if (!updatedStaff) {
    //     return res.status(400).json({ message: 'Failed to Update User' });
    //   } else {
    //     return res.status(200).json({ message: 'User updated successfully', data: updatedStaff });
    //   }
    //     } catch (error) {
    //         const err = error.message;
    //         res.status(500).json({
    //             message: `error ${err}`
    //         })
    //     }
    // }
 
const updatePatient = async (req, res) => {
  try {
    const { patientID } = req.params;
    const patient = await patientModel.findOne({ patientID });

    if (!patient) {
      return res.status(404).json({ message: 'Error getting patient, please check the ID' });
    }

    const {
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
      mothersPhonenumber,
      relationshipStatus,
      spouseName,
      spousePhonenumber,
      otherContacts
    } = req.body;

    // const validation = validator(email, phoneNumber, patientName);
    // if (!validation.isValid) {
    //   return res.status(400).json({
    //     message: validation.message
    //   });
    //}
    const updated = {
      patientName: patientName || patient.patientName,
      dateOfBirth: dateOfBirth || patient.dateOfBirth,
      gender: gender || patient.gender,
      homeAddress: homeAddress || patient.homeAddress,
      email: email || patient.email,
      phoneNumber: phoneNumber || patient.phoneNumber,
      bloodGroup: bloodGroup || patient.bloodGroup,
      fathersName: fathersName || patient.fathersName,
      fathersPhonenumber: fathersPhonenumber || patient.fathersPhonenumber,
      mothersName: mothersName || patient.mothersName,
      mothersPhonenumber: mothersPhonenumber || patient.mothersPhonenumber,
      relationshipStatus: relationshipStatus || patient.relationshipStatus,
      spouseName: spouseName || patient.spouseName,
      spousePhonenumber: spousePhonenumber || patient.spousePhonenumber,
      otherContacts: otherContacts || patient.otherContacts
    };

    // Check if a new image was uploaded
    if (req.files && req.files.patientImage) {
      // Delete the old image from Cloudinary if it exists
      if (patient.public_id) {
        await cloudinary.uploader.destroy(patient.public_id);
      }
      // // Upload the new image to Cloudinary
      const file = await cloudinary.uploader.upload(req.files.patientImage.tempFilePath);
      updated.patientImage = file.secure_url;
      updated.public_id = file.public_id;
    }
       // Perform the update and set { new: true } option to get the updated document
    const updatedPatient = await patientModel.findOneAndUpdate({ patientID }, updated, { new: true });

    if (!updatedPatient) {
      return res.status(400).json({ message: 'Failed to update patient' });
    } else {
      return res.status(200).json({ message: 'Patient updated successfully', data: updatedPatient });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error.message}`
    });
  }
};




//  temporarly deleting a patient from the database
//incase of mistakes
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
        res.status(200).json({message:"patient has been temporarly deleted and will be deleted permanetly deleted in 10 days"})
        }
    

        
    } catch (error) {
        res.status(500).json(error.message)
    }
}



//if a patient data is mistakenly deleted it can be recovered
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



// this function allosw a user or admin add more infomation
//or diagnosis to a patient
const addDiagnosis = async (req, res) => {
  try {
    const { patientID, diagnosisText } = req.body;

    // Find the patient by ID
    const patient = await patientModel.findOne({patientID});

    if (!patient) {
      // If patient with the given ID is not found, handle the error accordingly
      res.status(404).json({message:"error finding patient"})
    }
         
     // Create an object representing the new diagnosis entry
     const newDiagnosisEntry = {
        text: diagnosisText,
        date: new Date() // Current date and time
      };
    // Push the new diagnosis text into the diagnosis array
    patient.diagnosis.push(newDiagnosisEntry);

    // Save the updated patient with the new diagnosis
    const updatedPatient = await patient.save();

    if(updatedPatient){
         res.status(200).json({messsage:"added to patient successfully"})
        }else(
        res.status(400).json({message:"error adding text"})
    )
}catch (error) {
        return res.status(500).json(error.message);
      }
    }

 

// const getAllDiagnosis = async (patientId) => {
//   try {
//     // Find the patient by ID
//     const patient = await patientModel.findById(patientId);

//     if (!patient) {
//       // If patient with the given ID is not found, handle the error accordingly
//       return { success: false, message: 'Patient not found' };
//     }

//     // Extract the diagnosis array from the patient's data
//     const diagnosisArray = patient.diagnosis;

//     return { success: true, data: diagnosisArray };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

// // Usage example
// const patientId = '123456789012345678901234'; // Replace with the actual patient ID

// getAllDiagnosis(patientId)
//   .then((result) => {
//     if (result.success) {
//       console.log('Diagnosis entries:', result.data);
//     } else {
//       console.error('Error retrieving diagnosis:', result.message);
//     }
//   })
//   .catch((error) => {
//     console.error('An error occurred:', error.message);
//   });


// // Usage example
// // Assuming you are using Express, you can call the function inside a route handler
// app.post('/addDiagnosis', async (req, res) => {
//   const result = await addDiagnosis(req);

//   if (result.success) {
//     res.status(200).json({ message: 'Diagnosis added successfully', data: result.data });
//   } else {
//     res.status(400).json({ message: 'Error adding diagnosis', error: result.message });
//   }
// });




module.exports={
    createpatient,
    deletePatient,
    recoverpatient,
    getallpatient,
    getonepatient,
    updatePatient,
    getAllpatientByHospital,
    addDiagnosis
}