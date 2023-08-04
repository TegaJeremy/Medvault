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
  staff:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'staff',
    require:true
}],
    LGA:{
    type:String,
    required:true["LGA is required"]
},
        token:{
    type: String

},
 hospitalcode:{
   type:String,
    unique: true
   
},
isVerified:{
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

const registerModel = mongoose.model("HOSPITALs", registerschema)
module.exports = registerModel