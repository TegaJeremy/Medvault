const mongoose = require('mongoose');
//const { use } = require('../app');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "username required"]
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
       // required: [true, "password is required"],
       // unique: true
    },
    staffID:{
        type:String,
        unique: true,
    },
    age: {
        type: String,
    },
    photo: {
            public_id: { type: String},
             url:{ type: String, }
    },
    // token: {
    //     type: String,
    // },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
    },
    hospitalcode:{
        type:String
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    islogin: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true})

const adminModel = mongoose.model('Staff', staffSchema)


module.exports = adminModel