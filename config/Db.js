// Fpv30lW1HbnpJPqE
// mongodb+srv://oghenedemartin:Fpv30lW1HbnpJPqE>@cluster0.htfq2ca.mongodb.net/
require ('dotenv').config()
const mongoose = require ('mongoose')
const {handleAutomatinDelete} = require('../middleware/middleware')


mongoose.connect(process.env.url).then(()=>{
    console.log('connected to database successfully');
    //start authomatin every seconds the will be set here
    setInterval(handleAutomatinDelete, 120000)
}).catch((error)=>{
    console.log(error.message)
})