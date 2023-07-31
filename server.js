const express = require('express');

const mongoose = require('mongoose')
const  PORT = 6666;
const db = require('./config/Db')
 const router = require("./router/userrouter")
 const prouter = require("./router/patientrouter")
const app = express();
app.use (express.json());
app.use("/api" , router)
app.use("/api", prouter)






app.listen(PORT, ()=>{
    console.log(`app has listed to ${PORT}`)
});



