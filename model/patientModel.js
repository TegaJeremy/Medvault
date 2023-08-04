const mongoose = require('mongoose')

const   patientschema = new mongoose.Schema({
        patientName: {
            type: String,
            required: [true, 'patient name is Required']
        },
        dateOfBirth: {
            type: String,
            required: [true, 'Date Of Birth is Required']
        },
        gender: {
            type: String,
            required: [true, 'Gender is required']
        },
        homeAddress: {
            type: String,
            required: [true, 'HomeAddress is Required']
        },
        email: {
            type: String,
            required: [true, 'Email is Required'],
            //unique: true
        },
        phoneNumber: {
            type: String,
            required: [true, 'Mobile Phone Number is Required'],
            unique: true,
            sparse: true,
           
        },
        bloodGroup:{
            type:String
        },
       
        fathersName: {
            type: String,
        },
        fathersPhonenumber: {
            type: String,
        },
        mothersName: {
            type: String,
        },
        MothersPhonenumber: {
            type: String,
        },
        relationshipStatus: {
            type: String,
        },
       spouseName: {
            type: String,
        },
        spousePhonenumber: {
            type: String,
        },
        otherContacts: {
            type: String,
        },
        diagnosis: {
            type: Array, 
        },
        patientID:{
            type:String,
            unique:true
        },
        hospitalcode: {
        type:String,
            },
        patientImage: {
            public_id: { type: String},
             url:{ type: String, }
                       },
        
    deleted:{
      type:Boolean,
      default:false
    }
    // deletedAt:{
    //     type:Date, expires:600
    //   },

},{timestamps:true}
)

const patientModel = mongoose.model("patien5t", patientschema)
module.exports = patientModel
