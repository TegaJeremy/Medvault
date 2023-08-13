const registerModel = require ('../model/registrationmodel')
const staffModel = require('../model/staffModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const cloudinary = require('../middleware/cloudinary')
// const validator = require('../middleware/validation')
//const Validator = require('fastest-validator');


const transporter = nodemailer.createTransport({

   host:"smtp.gmail.com",
  service:"Gmail",
    port:587,
    // port: 2525,
  auth: {
    user: process.env.user,
    pass: process.env.password
  },
  tls:{
      rejectUnauthorized: false,
     },
  });
  // host:"smtp.gmail.com",
  // service:"Gmail",
  //   port:587,
  //   secure:false,
  // auth: {
  //   user: process.env.user,
  //   pass: process.env.password, 
  // },
  // tls:{
  //   rejectUnauthorized: false,
  // },
  // });



// this function is the function that registers the hopital to the platform
const register = async (req, res)=>{
   try {
    //getting the details fromthe request body
    const  {facilityname, facilityaddress, email, password, facilityphone, state, city , LGA,} = req.body

    //check and validate the impute of the user
       let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       let regexPattern = /^[a-zA-Z ]+$/
       let phonePattern = /^[+\d]+$/
        if(!facilityname || facilityname?.trim().length === 0){
          return res.status(404).json({message:"facility name field cannot be empty"})
        }
        if(!regexPattern?.test( facilityname)){
          return res.status(404).json({message:"facility name can only contain letters"})
        }        
        if(!facilityaddress || facilityaddress?.trim().length === 0){
          return res.status(404).json({message:"facility address cannot be empty"})
        } 
        if(!email || !emailPattern?.test(email)){
          return res.status(404).json({message:"email pattern not valid"})
        }
        if(!password || password?.trim().length === 0 || password?.trim().length > 10){
          return res.status(404).json({message:" password should not be empty or more than 10 characters"})
        } 
        if(!facilityphone ||facilityphone?.trim().length === 0 ||facilityphone?.trim().length >15 ){
          return res.status(404).json({message:" facilityphone phone should not be empty or more than 15 character"})
        }
        if(!phonePattern?.test(facilityphone) ){
          return res.status(404).json({message:" facilityphone phone can only contain numbers"})
        }
        if(!city || city?.trim().length === 0){
          return res.status(404).json({message:" city field should not be empty"})
        }
        if(!state || state?.trim().length === 0){
          return res.status(404).json({message:" state field should be empty"})
        }
        if(!LGA || LGA?.trim().length === 0){
          return res.status(404).json({message:" LGA should be empty"})
        }
     // check if the email is been registered has already been registered
     const isEmail = await registerModel.findOne( { email } );
     if ( isEmail ) {
         res.status( 400 ).json( {
             message: `user with this email: ${email} already exist.`
         })
    
    
        }else{
          const hospitalphoto = await cloudinary.uploader.upload(req.files.hospitalLogo.tempFilePath, (error, hospitalLogo) => {
            try{return hospitalLogo}
            catch (error) {
                error.message
            }
          })

    //salt the password using bcrypt
    const salt = bcrypt.genSaltSync(10)
    //hash the password using bcrypt
    const hashedPassword  = bcrypt.hashSync(password, salt)
      // create a token
     
      //creating a function that will generate random id for the hospitals
      
    //   function generateID(){
    //     const digits = "123456789";
    //     let ID = " ";
    //     for (let i = 0; i < 4; i++ )
    //     ID += digits[Math.floor(Math.random()* 10)]
    //     return ID
    //   }
    let ID = Math.floor(Math.random()* 10000)

      
      //creating a new data
    const user =  new registerModel( {
        facilityname, 
        facilityaddress,
        email,
        password:hashedPassword,
        facilityphone,
        state,
        city,
        LGA,
        hospitalcode:ID,
        hospitalLogo:{ public_id: hospitalphoto.public_id, url: hospitalphoto.url }
    })
    const token = jwt.sign( { email:user.email,islogin: user.islogin }, process.env.secretKey, { expiresIn: "15m" } );
    
      // return res.status(400).json({message:"erroe trying to validate user",
      //    error:validate[0].message
      // })
      // const baseUrl = process.env.BASE_URL
      // const link = `http://localhost:5173/verification?token=${token}`
      // const mailOptions = {
      //     from: process.env.SENDER_EMAIL,
      //     to: email,
      //     subject: "Verify your account",
          
      //    // html: `Please click on the link to verify your email: http://localhost:5173/verification/${ token }">Verify Email</a>`,
      //    // html: `Please click on the link to verify your email: <a href=">Verify Email</a>`,
      //    text: `plase click on the link to verify your account${link}`

      // };
      console.log(token)
      const baseUrl = process.env.BASE_URL;
 const link = `https://medvault-xixt.onrender.com/#/verification/${token}`;
 //"/verification/:token" (How frontend should write route)
 
//const link = `http://www.google.com`
const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Verify your account",
    html: `
        <html>
        <head>
            <style>
                /* Add your CSS styles here */
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .header {
                    background-color: #007BFF;
                    color: #fff;
                    padding: 10px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                .button {
                    background-color: #007BFF;
                    border: none;
                    color: #fff;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your Account</h1>
                </div>
                <div class="content">
                    <p>Please click on the link below to verify your account:</p>
                    <a class="button" href="${link}">Verify Email</a>
                </div>
            </div>
        </body>
        </html>
    `
};

// Use the 'mailOptions' object in your email sending code

      
      await transporter.sendMail( mailOptions );
            // save the user
            user.isAdmin=true
            const savedUser = await user.save();

            // return a response
            res.status( 201 ).json( {
            message: `hospital registered succssfully, please Check your email: ${savedUser.email} to verify your account.`,
            data: savedUser,
            token })
    }
      // send verification email
    
            
  }
    catch (error) {
    res.status(500).json(error.message)
   }


}


// verify the email of the hospital
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // verify the token
        const { email } = jwt.verify( token, process.env.secretKey );

        const user = await registerModel.findOne( { email } );

        // update the user verification
        user.isVerified = true;

        // save the changes
        await user.save();

        // update the user's verification status
        // const updatedUser = await registerModel.findOneAndUpdate( {email}, user );

        res.status( 200 ).json( {
            message: "User verified successfully",
            // data: updatedUser,
        })
        // res.status( 200 ).redirect( `${ process.env.BASE_URL }/login` );

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}


// resend verification
const resendVerificationEmail = async (req, res) => {
    try {
        // get user email from request body
        const { email } = req.body;

        // find user
        const user = await registerModel.findOne( { email } );
        if ( !user ) {
            return res.status( 404 ).json( {
                error: "User not found"
            } );
        }

        // create a token
            const token = await jwt.sign({ email:user.email, hospitalcode:user.hospitalcode, isVerified:user.isVerified }, process.env.secretKey, { expiresIn: "10m" } );
            
             // send verification email
            const baseUrl = process.env.BASE_URL
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Email Verification",
                html: `Please click on the link to verify your email: <a href="http://localhost:7000/api/users/verify-email/${ token }">Verify Email</a>`,
            };

            await transporter.sendMail( mailOptions );

        res.status( 200 ).json( {
            message: `Verification email sent successfully to your email: ${user.email}`,
            data:token
            
        } );
    

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    
    }
}


 // User login
 const login = async (req, res) => {
    try {
    // Extract the user's username, email and password
        const {email, password } = req.body;

    // find user by their registered email or username
        const checkUser = await registerModel.findOne({email})
        // const checkUser = await registerModel.findOne({ $or: [{ username }, { email }] })

        // check if the user exists
        if (!checkUser) {
            return res.status(404).json({
                Failed: 'User not found'
            })
        }

      // Compare user's password with the saved password.
        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        checkUser.islogin = true
      // Check for password error
        if (!checkPassword) {
            return res.status(404).json({
                Message: 'Login Unsuccessful',
                Failed: 'Invalid password'
            })
        }

        // Check if the user if verified
        if (!checkUser.isVerified) {
            return res.status(404).json({
              message: `User with this email: ${email} is not verified.`
            })
          }

        const token = jwt.sign({
           email:checkUser.email, 
           hospitalcode:checkUser.hospitalcode, 
           isVerified:checkUser.isVerified,
           isLogin: checkUser.islogin,
          userId: checkUser._id,
            password: checkUser.password,
            // isAdmin: checkUser.isAdmin,
            // isSuperAdmin: checkUser.isSuperAdmin

        },
            process.env.secretKey, { expiresIn: "50 mins" })

        checkUser.token = token

        checkUser.save()

        res.status(200).json({
            message: 'Login successful',
            data: {

                id: checkUser._id,  
                token: checkUser.token

            }
            
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


//creating a function to logout the user
// const logout = async (req, res) => {
//     try {
//       const {hospitalcode} = req.user;
//       console.log(req.user)
  
//       // Update the user's token to null
//       const user = await registerModel.findByIdAndUpdate(hospitalcode, { token: null }, { new: true });
  
//       if (!user) {
//         return res.status(404).json({
//           message: 'User not found',
//         });
//       }
//       res.status(200).json({
//         message: 'User logged out successfully',
//       });
//     } catch (error) {
//       res.status(500).json({
//         Error: error.message,
//       });
//     }
//   }
// const logout = async (req, res) => {
  // try {
  //   // Assuming req.user contains the user ID and token information
  //   const { token } = req.user;

  //   // Update the user's token to null in the database
  //   // Replace 'UserModel' with the actual model representing your user collection
  //   const updatedUser = await registerModel.findByIdAndUpdate(
  //     token,
  //     { token: null },
  //     { new: true }
  //   );

  //   if (!updatedUser) {
  //     return res.status(404).json({
  //       message: 'User not found',
  //     });
  //   }

  //   res.status(200).json({
  //     message: 'User logged out successfully',
  //   });
  // } catch (error) {
  //   res.status(500).json({
  //     Error: error.message,
  //   });
  // }
//};

// const logout = async (req, res) => {
//   try {
//     // Assuming req.user contains the authenticated user's information
//     const { hospitalcode } = req.params.hospitalcode;
//     console.log(req.user)
//     // Update the user's token to null in the database
//     const updatedUser = await registerModel.findByIdAndUpdate(
//       hospitalcode,
//       { token: null },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         message: 'User not found',
//       });
//     }

//     res.status(200).json({
//       message: 'User logged out successfully',
//     });
//   } catch (error) {
//     res.status(500).json({
//       Error: error.message,
//     });
//   }
// };
// Sign Out
// const logout = async (req, res)=>{
//   try {
//       const { hospitalId } = req.params;
//       const blacklist = [];
//       const hasAuthorization = req.headers.authorization;
//       const token = hasAuthorization.split(" ")[1];
//       blacklist.push(token);
//       const logout = await registerModel.findByIdAndUpdate(hospitalId, {islogin: false}); 
//       res.status(200).json({
//           message: 'Logged out successfully'
//       })
//       console.log()
//   } catch (error) {
//       res.status(500).json({
//           message: error.message
//       })
//   }
// };


const logout = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hasAuthorization = req.headers.authorization;

    if (!hasAuthorization) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const token = hasAuthorization.split(' ')[1];
    const decodedToken = jwt.decode(token, { complete: true }); // Decode the token

    // Invalidate the token by adding it to a blacklist (you might want to store this list in a database)
    const blacklistedTokens = []; // Store blacklisted tokens
    blacklistedTokens.push(token);

    // Update the login status for the hospital
    const updatedHospital = await registerModel.findByIdAndUpdate(hospitalId, { islogin: false });

    res.status(200).json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getHospitalWithStaffAndPatients = async (req, res) => {
  const { hospitalId } = req.params;
  
  try {
      const hospital = await registerModel.findById(hospitalId)
          .populate('staff')
          .populate('patients');
      
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found.' });
      }

      return res.status(200).json({
          message: 'Hospital with staff and patients:',
          data: hospital
      });

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


//updating hospital info  
const updatehospitalinfo = async (req, res) => {
  try {

    
    const { hospitalcode } = req.params;
    const hospital = await registerModel.findOne({ hospitalcode });
    //check for errors if the hospital is not registered
    if (!hospital) {
      return res.status(404).json({ message: 'hospital not found, please check the hospital code passed' });
    }

    const  {facilityname, facilityaddress, email, facilityphone, state, city , LGA,} = req.body
      //check and validate the impute of the user
      let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let regexPattern = /^[a-zA-Z ]+$/
      let phonePattern = /^[+\d]+$/
      if( facilityname?.trim().length === 0){
        return res.status(404).json({message:"facility name cannot be empty"})
      }
      if(!regexPattern?.test( facilityname)){
        return res.status(404).json({message:"facility name can only contain letters"})
      }    
      if(facilityaddress?.trim().length === 0){
        return res.status(404).json({message:"facility address cannot be empty"})
      } 
      if(emailPattern?.test(email)){
        return res.status(404).json({message:"email pattern not valid"})
      }
      if(facilityphone?.trim().length === 0 ||facilityphone?.trim().length >15 ){
        return res.status(404).json({message:" facilityphone phone should not be empty or more than 15 character"})
      }
      if(!phonePattern?.test(facilityphone) ){
        return res.status(404).json({message:" facilityphone phone can only contain numbers"})
      }
      if(city?.trim().length === 0){
        return res.status(404).json({message:" city field should not be empty"})
      }
      if(state?.trim().length === 0){
        return res.status(404).json({message:" state field should be empty"})
      }
      if(LGA?.trim().length === 0){
        return res.status(404).json({message:" LGA should be empty"})
      }
   // validates the data passed
    // const validation = validator(email, facilityphone, facilityname);
    // if (!validation.isValid) {
    //   return res.status(400).json({
    //     message: validation.message
    //   });
    //  }

    // Prepare the fields to be updated
    const updateData = {
      facilityname: facilityname || hospital.facilityname,
      facilityaddress: facilityaddress || hospital.facilityaddress,
      email: email || hospital.email,
      //password: password ? await bcryptjs.hash(password, await bcryptjs.genSalt(10)) : hospital.password,
      facilityphone: facilityphone || hospital.facilityphone,
      state: state || hospital.state,
      city: city || hospital.city,
      LGA: LGA || hospital.LGA,
    };

    if (req.files) {
      //  console.log(profile[0].photo)

      const publicId = hospital.hospitalLogo.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId)
    // // Upload the new image to Cloudinary
    const file = await cloudinary.uploader.upload(req.files.hospitalLogo.tempFilePath);
    updateData.hospitalLogo = file.secure_url;
    updateData.public_id = file.public_id;
  }
       // Perform the update and set { new: true } option to get the updated document
    const updatedhospital = await registerModel.findOneAndUpdate({ hospitalcode }, updateData, { new: true });

    if (!updatedhospital) {
      return res.status(400).json({ message: 'Failed to Update hospital details' });
    } else {
      return res.status(200).json({ message: 'hospital details updated successfully', data: updatedhospital });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//deleting a hospital account, note that for hospital when they want to delete their account 
//they will send us the owmer of the application a mail, we review and revert
const deleteAccount = async(req,res)=>{
try {
  //get the hospital code room header
  const {hospitalcode}= req.params
  //find the hospital
  const deletehospital = await registerModel.findOne({hospitalcode})
  //collect the mail from the hospital model
  const getmail = deletehospital.email
  //get th hospital code 
  const ID = deletehospital.hospitalcode
  //sending a mail
  // const baseUrl = process.env.BASE_URL
      const mailOptions = {
          from: getmail,
          to:  process.env.SENDER_EMAIL,
          subject: "requesting to delete my Account",
          text:`requsting to delete my account, my hospital code is:${ID}, this is my mail:${getmail}`
      };
      await transporter.sendMail( mailOptions );
      res.status(200).json({message:"email successfully sent, you will be contated in the next 5 days"})
  
} catch (error) {
  res.status(500).json(error.message)
}

//the funstion allows the hospital the hospital to send the registration link to 
//a staff in its hospital to register with its code
//because staff will register with the hoospital code its under           
}
  const createstaff = async(req,res)=>{
    try {
      // console.log("Request Body:", req.body); // Log the entire req.body to check the data received

      const { email, hospitalcode } = req.body;
      let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(emailPattern?.test(email)){
        return res.status(404).json({message:"email pattern not valid"})
      }
      if(!hospitalcode || hospitalcode?.trim().length === 0){
        return res.status(404).json({message:" hospitalcode  field should not be empty"})
      }
     
      //send the link of the staff registration page along sid the hospital code
      const registrationlink =`http://myplatform.com/register/${hospitalcode}`
             
    
      //send the mail
      const baseurl = process.env.BASE_URL
      const mailOptions2 = {
        from: process.env.SENDER_EMAIL,
        to:email,
        subject: "Registration",
        text:`click on the link to to register, use the last digits in this link  as the hospitalcode on the registration page${registrationlink}`
        
      }
    await transporter.sendMail( mailOptions2 );
    

    res.status( 200 ).json( {
        message: `email sent successfully sent to staff: `
        
    } );
       
      
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
   
module.exports = {
    register,
    verifyEmail,
    resendVerificationEmail,
    login,
    logout,
    updatehospitalinfo,
    deleteAccount,
    createstaff,
    getHospitalWithStaffAndPatients

}