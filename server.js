const express = require('express');
const app = express();

const mongoose = require('mongoose')
const cors = require("cors")
const  PORT = 6666;
const db = require('./config/Db')
 const router = require("./router/userrouter")
 const prouter = require("./router/patientrouter")
 const staffrouter = require("./router/staff router")
 const fileUploader = require('express-fileupload')
 const morgan = require('morgan')
 app.use(morgan('combined'));
// const app = express();

app.use(fileUploader({
    useTempFiles: true,
}))
app.use(cors({origin:"*"}));
app.use (express.json());
app.use("/api" , router)
app.use("/api", prouter)
app.use("/api", staffrouter)
// app.use(cors({origin:"*"}));





app.listen(PORT, ()=>{
    console.log(`app has listed to ${PORT}`)
});



