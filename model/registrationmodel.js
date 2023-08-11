const mongoose = require('mongoose')

const registerschema = new mongoose.Schema({
        facilityname:{
    type:String,
    required:true["username is required"]
},
facilityaddress:{
    type:String,
    required:true["address is required"]
},
        email:{
    type:String,
    required:true["email is required"], unique: true
},
        password:{
    type:String,
    required:true["password is required"],
},
hospitalLogo: {
    public_id: { type: String},
     url:{ type: String, }
},
      facilityphone:{
    type:String,
    required:true["username is required"]
},
    state:{
    type:String,
    required:true["state is required"]
},
    city:{
    type:String,
    required:true["city is required"]
},
  
staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    LGA:{
    type:String,
    required:true["LGA is required"]
},
    //     token:{
    // type: String

//},
 hospitalcode:{
   type:String,
    unique: true
   
},
isVerified:{
    type:Boolean,
    default:false
},
islogin:{
    type:Boolean,
    default:false
},
isAdmin:{
    type:Boolean,
    default:false
},
isSuperAdmin:{
    type:Boolean,
    default:false
},
// staffs: [
//     {
//         type: Schema.Types.ObjectId, ref:[ "staffs", "patients"]
//     }
// ]

},{timestamps:true}
)

const registerModel = mongoose.model("hospital", registerschema)
module.exports = registerModel