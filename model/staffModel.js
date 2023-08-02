const mongoose = require('mongoose');
//const { use } = require('../app');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "username required"]
    },
    email: {
        type: String,
       // required: [true, "email required"],
       // unique: true
    },
    password: {
        type: String,
       // required: [true, "password is required"],
       // unique: true
    },
    staffID:{
        type:String
    },
    age: {
        type: String,
    },
    // photo: {
    //         public_id: { type: String},
    //          url:{ type: String, }
    // },
    token: {
        type: String,
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
    },
    hospitalID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HOSPITAL',
        require:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isLogin: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true})

const adminModel = mongoose.model('staff', staffSchema)

module.exports = adminModel