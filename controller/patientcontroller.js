const patientModel = require('../model/patientModel')
//creating a patient

const createpatient = async (req,res)=>{
    try {
        const {name,address,patientID}= req.body
        let ID = Math.floor(Math.random()* 10000)

        const data = new patientModel({
            name,
            address,
            patientID:ID
        })
          await data.save()
        res.status(200).json({message:"patient created successfully", data:data})
        
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

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
const getallpatient = async (req,res)=>{
    try {
        const getall = await patientModel.find()
        if(getall){
        res.status(200).json({data:getall})
        }else{
            res.status(400).json()
        }
        
    } catch (error) {
        res.status(500).json(error.message) 
    }
 
}
//get one patient bt patientid
const getonepatient = async (req,res)=>{
    try {
        const {patientID} = req.params
        const patient = await patientModel.findOne({patientID})
        if(!patient){
            res.status(400).json({message:"patient not found"})
      
        }else{
            res.status(200).json({data:patient})
        }
        
    } catch (error) {
        res.status(500).json(error.message) 
    }
}

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

module.exports={
    createpatient,
    deletePatient,
    recoverpatient,
    getallpatient,
    getonepatient
}