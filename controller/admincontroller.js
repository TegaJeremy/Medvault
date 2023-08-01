const adminModel = require('../model/registrationmodel')


//to get all hospital that have registered
const getallHospital = async (req,res)=>{
    try {
        const all = await adminModel.find()
        if(all){
        res.status(200).json({message:"therse are all hospital that are registered", data:all})
    }else{
        res.status(400).json({message:"no hospital found"})
    }

    } catch (error) {
        res.status(500).json(error.message)
    }
}


// getting an hospital by its hospital id
 const getHospitalByID = async (req , res)=>{
    try{
    const {hospitalID} = req.params
    const gethospital = await adminModel.findOne({hospitalID})
    if(!gethospital){
        res.status(400).json({message:"error getting hospital please check the id "})

    } else{
        res.status(200).json({data:gethospital})
    }
    } catch(error){
      return  res.status(500).json(error.message)
    }
 }

module.exports={
    getallHospital,
    getHospitalByID
}