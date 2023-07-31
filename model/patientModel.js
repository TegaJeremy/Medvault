const mongoose = require('mongoose')

const   patientschema = new mongoose.Schema({
    name:{
        type:String,
        required:true["name is required"]
    },
    address:{
        type:String,
        required:true["address is required"]
    },
    deleted:{
      type:Boolean,
      default:false
    },
    patientID:{
        type:String
    }
    // deletedAt:{
    //     type:Date, expires:600
    //   },

},{timestamps:true}
)

const patientModel = mongoose.model("tegatest2", patientschema)
module.exports = patientModel
