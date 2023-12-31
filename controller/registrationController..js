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
    const  {facilityname, facilityaddress, email, password, facilityphone, state, city , LGA, confirmPassword} = req.body

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
      
      // function generateID(){
      //   const digits = "123456789";
      //   let ID = " ";
      //   for (let i = 0; i < 4; i++ )
      //   ID += digits[Math.floor(Math.random()* 10)]
      //   return ID
      // }

      // let randomId =generateID()
    let ID = Math.floor(Math.random()* 10000)


    const emailLowerCase = email.toLowerCase();
    const name = facilityname.toUpperCase();
      //creating a new data
    const user =  new registerModel( {
        facilityname:name, 
        facilityaddress,
        email:emailLowerCase,
        password:hashedPassword,
        confirmPassword,
        facilityphone,
        state,
        city,
        LGA,
        hospitalcode:ID,
        hospitalLogo:{ public_id: hospitalphoto.public_id, url: hospitalphoto.url }
    })
     if (password !==confirmPassword ){
      return res.status(404).json({message:"password does not match"})
     }
    const token = jwt.sign( { email:user.email,islogin: user.islogin }, process.env.secretKey, { expiresIn: "15m" } );
    
     
            const baseUrl = process.env.BASE_URL;
 const link = `https://medvault-xixt.onrender.com/#/verification/${token}`;
 //"/verification/:token" (How frontend should write route)

//const link = `http://www.google.com`
const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Verify your account",
    html:`
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            /* Add your CSS styles here */
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #e8e8e8;
            }
    
            .container {
                background-color: #ffffff;
                padding: 20px;
                margin: 10vh auto; /* Center the container vertically and horizontally */
                max-width: 80%; /* Limit container width for better readability on larger screens */
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                border-radius: 10px;
            }
    
            .header {
                background-color: rgba(2, 2, 2, 0.993);
                color: #fff;
                padding: 4px; /* Reduced padding */
                text-align: center;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                font-size: 20px; /* Reduced font size */
                max-width: 60%; /* Reduced width for the header */
                margin: 0 auto; /* Center the header horizontally */
            }
    
            .header img {
                max-width: 50%; /* Reduced image size */
                display: block; /* Remove any residual space below the image */
                margin: 0 auto 10px; /* Center the image horizontally and add margin below it */
            }
    
            .content {
                padding: 10px;
                text-align: center; /* Center-align content within the div */
                color: #000000;
            }
    
            .button {
                background-color: #50F2F0;
                border: none;
                color: #000000;
                padding: 15px 30px; /* Increase button padding for larger size */
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 18px; /* Increase font size for the button */
                border-radius: 5px;
                cursor: pointer; /* Add cursor pointer on hover */
                transition: background-color 0.3s, color 0.3s; /* Add transitions for button hover effects */
            }
    
            .button:hover {
                background-color: #0ab43a;
            }
    
            /* Animation for h1 tags */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
    
            .content h1 {
                animation: fadeIn 1s ease-in-out; /* Apply the animation to h1 elements */
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://raw.githubusercontent.com/TegaJeremy/Medvault/main/curent-medvault%20image.png" alt="MED-VAULT">
                
            </div>
            <div class="content">
                <h1>Hello ${user.facilityname}!</h1>
                <h2>Welcome to MedVault!</h2>
                <p>We're excited to have you get started.</p>
                <p>First, you need to confirm your account.</p>
                <a class="button" href="${link}">Verify Email</a>
            </div>
        </div>
    </body>
    </html>
    
    

     `,
//       attachments: [
//         {
//             filename: "Medvault.png",
//             path: "C:\\Users\\OWNER\\Desktop\\Medvault\\curent-medvault image.png"
// , // Path to your image file
//             cid: "unique-image-id" // Use a unique CID
//         }
//     ]
      
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

        const admin = await registerModel.findOne( { email } );
        const staff = await staffModel.findOne({ email });

        const user = admin || staff;

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
// const resendVerificationEmail = async (req, res) => {
//     try {
//         // get user email from request body
//         const { email } = req.body;

//         // find user
//         const user = await registerModel.findOne( { email } );
//         if ( !user ) {
//             return res.status( 404 ).json( {
//                 error: "User not found"
//             } );
//         }
//         if(user.isVerified === true){
//           return res.status(200).json({message:"user already verified"})
//         }

//         // create a token
//             const token = jwt.sign({ email:user.email, hospitalcode:user.hospitalcode, isVerified:user.isVerified }, process.env.secretKey, { expiresIn: "10m" } );
            
//              // send verification email
//             const baseUrl = process.env.BASE_URL
//             const link = `https://medvault-xixt.onrender.com/#/verification/${token}`;
//             const mailOptions = {
//               from: process.env.SENDER_EMAIL,
//               to: user.email,
//               subject: "Email Verification",
//               html: `
//                   <!DOCTYPE html>
//                   <html>
//                   <head>
//                       <meta name="viewport" content="width=device-width, initial-scale=1">
//                   </head>
//                   <body>
//                       <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #e8e8e8;">
//                           <div style="background-color: #ffffff; padding: 20px; margin: 10vh auto; max-width: 80%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); border-radius: 10px;">
//                               <div style="background-color: #020202; color: #fff; padding: 10px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
//                                   <img src="https://raw.githubusercontent.com/TegaJeremy/Medvault/main/Medvault.png" alt="MED-VAULT" style="max-width: 80%; display: block; margin: 0 auto 10px;">
//                               </div>
//                               <div style="padding: 20px; text-align: center;">
//                                   <h1>Hello ${user.facilityname}!</h1>
//                                   <h2>Welcome to MedVault!</h2>
//                                   <p>We're excited to have you get started.</p>
//                                   <p>First, you need to confirm your account. Please kindly click on the link below to verify your email:</p>
//                                   <a href="${link}" style="background-color: #1ebfc1; border: none; color: #fff; padding: 15px 30px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; border-radius: 5px; cursor: pointer; transition: background-color 0.3s, color 0.3s;">Verify Email</a>
//                               </div>
//                           </div>
//                       </div>
//                   </body>
//                   </html>
//               `,
//               // attachments: [
//               //     {
//               //         filename: "Medvault.png",
//               //         path: "https://raw.githubusercontent.com/TegaJeremy/Medvault/main/Medvault.png", // Replace with the correct path to your image file
//               //         cid: "unique-image-id" // Use the same unique id as in the <img> src attribute
//               //     }
//               // ]
//           };
          

//             await transporter.sendMail( mailOptions );

//         res.status( 200 ).json( {
//             message: `Verification email sent successfully to your email: ${user.email}`,
//             data:token
            
//         } );
    

//     } catch ( error ) {
//         res.status( 500 ).json( {
//             message: error.message
//         })
    
//     }
// }
const resendVerificationEmail = async (req, res) => {
  try {
      // get user email from request body
      const { email } = req.body;

      // Find user in the hospital collection
      const hospitalUser = await registerModel.findOne({ email });

      // Find user in the staff collection
      const staffUser = await staffModel.findOne({ email });

      // Determine if the user exists and is verified in either collection
      let user = hospitalUser || staffUser
      if(!user){
      return   res.status(200).json({message:"user not found"})
      }
      // let user;
      // if (hospitalUser && hospitalUser.isVerified) {
      //     user = hospitalUser;
      // } else if (staffUser && staffUser.isVerified) {
      //     user = staffUser;
      // } else {
      //     return res.status(404).json({
      //         error: "User not found or not verified"
      //     });
      // }
      if (user.isVerified){
        return res.status(200).json({message:'user email already verified or have been registerd befor'})
      }

      // create a token
      const token = jwt.sign({ email: user.email, hospitalcode: user.hospitalcode, isVerified: user.isVerified }, process.env.secretKey, { expiresIn: "10m" });

      // send verification email
      const baseUrl = process.env.BASE_URL;
      const link = `https://medvault-xixt.onrender.com/#/verification/${token}`;
      const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "Email Verification",
          html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                    <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #e8e8e8;">
                        <div style="background-color: #ffffff; padding: 20px; margin: 10vh auto; max-width: 80%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); border-radius: 10px;">
                            <div style="background-color: #020202; color: #fff; padding: 10px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                                <img src="https://raw.githubusercontent.com/TegaJeremy/Medvault/main/curent-medvault%20image.png" alt="MED-VAULT" style="max-width: 80%; display: block; margin: 0 auto 10px;">
                            </div>
                            <div style="padding: 20px; text-align: center;">
                                <h1>Hello ${user.facilityname || user.name}!</h1>
                                <h2>Welcome to MedVault!</h2>
                                <p>We're excited to have you get started.</p>
                                <p>First, you need to confirm your account. Please kindly click on the link below to verify your email:</p>
                                <a href="${link}" style="background-color: #1ebfc1; border: none; color: #fff; padding: 15px 30px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; border-radius: 5px; cursor: pointer; transition: background-color 0.3s, color 0.3s;">Verify Email</a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
          // attachments: [
          //     {
          //         filename: "Medvault.png",
          //         path: "https://raw.githubusercontent.com/TegaJeremy/Medvault/main/Medvault.png", // Replace with the correct path to your image file
          //         cid: "unique-image-id" // Use the same unique id as in the <img> src attribute
          //     }
          // ]
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
          message: `Verification email sent successfully to your email: ${user.email}`,
          data: token
      });

  } catch (error) {
      res.status(500).json({
          message: error.message
      });
  }
};



 // User login
//  const login = async (req, res) => {
//     try {
//     // Extract the user's username, email and password
//         const {email, password } = req.body;

//     // find user by their registered email or username
//         const checkUser = await registerModel.findOne({email})
//         // const checkUser = await registerModel.findOne({ $or: [{ username }, { email }] })

//         // check if the user exists
//         if (!checkUser) {
//             return res.status(404).json({
//                 Failed: 'User not found'
//             })
//         }

//       // Compare user's password with the saved password.
//         const checkPassword = bcrypt.compareSync(password, checkUser.password)
//         checkUser.islogin = true
//       // Check for password error
//         if (!checkPassword) {
//             return res.status(404).json({
//                 Message: 'Login Unsuccessful',
//                 Failed: 'Invalid password'
//             })
//         }

//         // Check if the user if verified
//         if (!checkUser.isVerified) {
//             return res.status(404).json({
//               message: `User with this email: ${email} is not verified.`
//             })
//           }

//         const token = jwt.sign({
//            email:checkUser.email, 
//            hospitalcode:checkUser.hospitalcode, 
//            isVerified:checkUser.isVerified,
//            isLogin: checkUser.islogin,
//           userId: checkUser._id,
//                        // isAdmin: checkUser.isAdmin,
//             // isSuperAdmin: checkUser.isSuperAdmin

//         },
//             process.env.secretKey, { expiresIn: "1d" })

//         checkUser.token = token

//         checkUser.save()

//         res.status(200).json({
//             message: 'Login successful',
//             data: {

//                 id: checkUser._id,  
//                 token: checkUser.token

//             }
            
//         })

//     } catch (error) {
//         res.status(500).json({
//             Error: error.message
//         })
//     }
// }
//this login is for both admin and staff
const login = async (req, res) => {
  try {
      // Extract the user's email and password from the request
      const { email, password } = req.body;

      // Try to find a user (either hospital or staff) with the provided email
      const hospital = await registerModel.findOne({ email });
      const staff = await staffModel.findOne({ email });

      // Check if either a hospital or staff with the email exists
      if (!hospital && !staff) {
          return res.status(404).json({
              message: 'User not found',
          });
      }

      // Determine the user type (hospital or staff) based on which one exists
      const user = hospital || staff;

      // Compare the provided password with the user's hashed password
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
          return res.status(401).json({
              message: 'Login failed',
              error: 'Invalid password',
          });
      }

      // Check if the user is verified (you can add more checks here)
      if (!user.isVerified) {
          return res.status(401).json({
              message: 'Login failed',
              error: 'User is not verified',
          });
      }

      // Determine the role of the user based on which model was used
      const LoginRole = hospital ? 'Admin' : 'staff';

      // Generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign(
          {
              email: user.email,
              userId: user._id,
              hospitalcode: user.hospitalcode,
              LoginRole,
              isStaff: user.isStaff,
              islogin: user.islogin,
              isAdmin: user.isAdmin
          },
          process.env.secretKey,
          { expiresIn: '1d' }
      );

      
      user.islogin = true

      user.token = token;
      await user.save();

      // Return a successful response with the JWT and role
      res.status(200).json({
          message: 'Login successful',
          data: {
              id: user._id,
              token: user.token,
              LoginRole,
              hospitalcode: user.hospitalcode,
              StaffId: user.staffID
          },
      });
  } catch (error) {
      res.status(500).json({
          message: 'Internal server error',
          error: error.message,
      });
  }
};



// const logout = async (req, res) => {
//   try {
//       // Assuming req.user contains the user ID and token information
//       const { hospitalId} = req.params;

//       // Update the user's islogin property to false and token to null in the database
//       const updatedUser = await registerModel.findByIdAndUpdate(
//         hospitalId,
//           { islogin: false, token: null },
//           { new: true }
//       );

//       if (!updatedUser) {
//           return res.status(404).json({
//               message: 'User not found',
//           });
//       }

//       res.status(200).json({
//           message: 'User logged out successfully',
//       });
//   } catch (error) {
//       res.status(500).json({
//           Error: error.message,
//       });
//   }
// };


//this logout is for both admin and staff
const logout = async (req, res) => {
  try {
      // Extract the user's ID from the request parameters
      const { userId } = req.params;

      // Check if it's a hospital or staff
      const isHospital = await registerModel.exists({ _id: userId });
      const isStaff = await staffModel.exists({ _id: userId });

      // Determine the user model to use (either hospital or staff)
      const UserModel = isHospital ? registerModel : staffModel;

      // Update the user's islogin property to false and token to null in the database
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
          { islogin: false, token: null },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({
              message: 'User not found',
          });
      }

      res.status(200).json({
          message: 'User logged out successfully',
      });
  } catch (error) {
      res.status(500).json({
          Error: error.message,
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
      // if(emailPattern?.test(email)){
      //   return res.status(404).json({message:"email pattern not valid"})
      // }
      if(facilityphone?.trim().length === 0 ||facilityphone?.trim().length >15 ){
        return res.status(404).json({message:" facilityphone phone should not be empty or more than 15 character"})
      }
      // if(!phonePattern?.test(facilityphone) ){
      //   return res.status(404).json({message:" facilityphone phone can only contain numbers"})
      // }
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
      if(!emailPattern?.test(email)){
        return res.status(404).json({message:"email pattern not valid"})
      }
      if(!hospitalcode || hospitalcode?.trim().length === 0){
        return res.status(404).json({message:" hospitalcode  field should not be empty"})
      }
     
      //send the link of the staff registration page along sid the hospital code
      const registrationlink = `https://medvault-xixt.onrender.com/#/staffRegistration`
             
    
      //send the mail
      const baseurl = process.env.BASE_URL
      const mailOptions2 = {
        from: process.env.SENDER_EMAIL,
        to:email,
        subject: "Registration",
      //   text:`click on the link to to register, use the code below as your hospital code: ${registrationlink}, hospitalcode:${hospitalcode} `
      //     }
      html:`     
            
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000000; color: #0c0c0c; font-family: Arial, sans-serif;">
      
      <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: rgba(0, 0, 0, 0.7); color: rgb(253, 250, 250);">
        <tr>
          <td style="text-align: center;">
            <img src="https://raw.githubusercontent.com/TegaJeremy/Medvault/main/curent-medvault%20image.png" alt="Med-Vault" style="max-width: 70%; height: auto;">
            <p style="text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome to Med-Vault</p>
            <p style="text-align: center; font-size: 18px; margin-bottom: 20px;">Please click on the link below to register:</p>
            <p style="text-align: center; font-size: 18px; margin-bottom: 20px;">Use the following code as your hospital code: <strong>${hospitalcode}</strong></p>
            <p style="text-align: center;"><a href="${registrationlink}" style="display: inline-block; padding: 14px 20px; background-color: #00FFFF; color: #000000; text-decoration: none; font-size: 18px; border-radius: 5px;">Register Now</a></p>
          </td>
        </tr>
      </table>
      
      </body>
      </html>
      
      

      `
      

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