const staffModel = require("../model/staffModel")
const registerModel = require('../model/registrationmodel')
const cloudinary = require('../middleware/cloudinary')
// const mailSender = require('./email')
const fs = require('fs')
const jwt = require ("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const nodemailer= require('nodemailer')


const transporter = nodemailer.createTransport({
    service:"Gmail",
    port: 2525,
  auth: {
    user: process.env.user,
    pass: process.env.password
  }
  });

const createStaffprofile = async (req, res) => {
    try {
        // get the request body
        const { name, age, email, password, role, hospitalcode } = req.body
        console.log("recieved hospitalcodde:", hospitalcode)
        
    // console.log('Received request body:', req.body);

    // if (!hospitalcode) {
    //   return res.status(400).json({ message: 'hospitalcode is missing in the request body' });
    // }
        // look for the hospital
        const gethospital = await registerModel.findOne({hospitalcode})
        // console.log("recieved hospitalcode:", gethospital)
        if (!gethospital) {
            return res.status(404).json({ message: "Error getting hospital. Please check ID." })
        }
        // check if email exists
        const isEmail = await staffModel.findOne({ email })
        if (isEmail) {
            return res.status(400).json({ message: `User with email ${email} already exists` })
        } else {
            
         //upload photo function
        const staffPhoto = await cloudinary.uploader.upload(req.files.photo.tempFilePath, (error, photo) => {
            try{return photo}
            catch (error) {
                error.message
            }
        })
            // hash password
            const salt = bcryptjs.genSaltSync(10)
            const hashPass = bcryptjs.hashSync(password, salt)
            const ID = Math.floor(Math.random() * 10000)
            const data = {
                name,
                email,
                staffID: ID,
                age,
                role,
                password: hashPass,
               photo: { public_id: staffPhoto.public_id, url: staffPhoto.url }
            }

            const createStaff = new staffModel(data)
            // generate token
            const newToken = jwt.sign({ name, email }, process.env.secretKey, { expiresIn: "1d" })

            createStaff.hospitalcode = hospitalcode

            createStaff.token = newToken
            await createStaff.save()
            // send verification link
            const baseUrl = process.env.BASE_URL
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to:email,
                subject: "Verify your account",
                html: `Please click on the link to verify your email: <a href="${baseUrl}/users/verify-email/${ newToken }">Verify Email</a>`,
            };
            await transporter.sendMail( mailOptions );
            res.status(200).json({ message: "Create successful", data: createStaff })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

const getAllStaffByHospital = async (req, res) => {
    try {
      const { hospitalcode } = req.params;
      
       // Look for the hospital with the specified hospitalcode
       const hospital = await registerModel.findOne({hospitalcode });
      
  
      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }
  
      // Find all staff members with the same hospitalcode
      const staffMembers = await staffModel.find({ hospitalcode });
    
      if(staffMembers === 0){
        res.status(404).json({message:"error getting staffs"})

      }else(
        res.status(200).json({ message: 'all ataff under this hospital are', data: staffMembers })
      )
     
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // verify the token
        const { email } = jwt.verify( token, process.env.secretKey );

        const user = await staffModel.findOne( { email } );

        // update the user verification
        user.isVerified = true;

        // save the changes
        await user.save();

        // update the user's verification status
        const updatedUser = await staffModel.findOneAndUpdate( {email}, user );

        res.status( 200 ).json( {
            message: "User verified successfully",
            data: updatedUser,
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
        const user = await staffModel.findOne( { email } );
        if ( !user ) {
            return res.status( 404 ).json( {
                error: "User not found"
            } );
        }

        // create a token
            const token = await jwt.sign( { email }, process.env.secretKey, { expiresIn: "10m" } );
            
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



//   

// verify email
// exports.staffVerify = async(req,res)=>{
//     try {
//         const registeredStaff = await staffModel.findById(req.params.id)
//         const registeredToken = registeredStaff.token
//         // check if the token attached to the user is valid
//         await jwt.verify(registeredToken,process.env.JWT_TOKEN,(err,data)=>{
//             if(err){res.json("This link has expired")}
//             else {
//                 return data
//             }
//         })
//         // Update if the registered user has been verified 
//         const verified = await staffModel.findByIdAndUpdate(req.params.id,{isVerify:true},)
//         if(!verified){
//             res.status(400).json({
//                 message:"unable to verify user"
//             })
//         } else {
//             res.status(200).json({
//                 message:"user has been verified",
//                 data: verified
//             })
//         }
//     } catch (error) {
//         res.status(400).json({
//             message:error.message
//         })
//     }
// }

// // resend verification email.

// exports.resendEmailVerification = async(req, res)=>{
//     try {
//         const { email } = req.body;
//         const user = await staffModel.findOne({email});
//         if (!user) {
//             res.status(404).json({
//                 message: 'User not found'
//             })
//         }else {
//             const verified = await staffModel.findByIdAndUpdate(user._id, {verify: new true})
//             const token = await jwt.sign({email}, process.env.JWT_TOKEN, {expiresIn: '1d'});
//             await jwt.verify(token, process.env.JWT_TOKEN, (err)=>{
//                 if(err) {
//                     res.json('This Link is Expired. Please try again')
//                 } else {   
//                     if (!verified) {
//                         res.status(404).json({
//                             message: 'User is not verified yet'
//                         })
//                     } else {
//                         const subject = 'Kindly RE-VERIFY'
//                         const link = `${req.protocol}://${req.get('host')}/api/verify/${user._id}/${token}`
//                         const message = `Welcome onBoard, kindly use this link ${link} to re-verify your account. Kindly note that this link will expire after 5(five) Minutes.`
//                         mailSender({
//                             email: user.email,
//                             subject,
//                             message
//                         });
//                         res.status(200).json({
//                             message: `Verification email sent successfully to your email: ${user.email}`
//                         })
//                     }
//                 }
//             })
//         }
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }

// staff signin
// exports.signIn = async (req,res)=>{
//     try {
//         const {name,email,password} = req.body
//         // validate username
//         const isEmail = await staffModel.findOne({email})
//         if(!isEmail){res.status(400).json({
//             message:"Email is incorrect"
//            }) } else {
//         // attach the boolean value of a verified account to a variable
//         const checkIfVerify = isEmail.verify
//         // validate password
//         const isPassword = await bcryptjs.compare(password, isEmail.password)
//         if(!isPassword){res.status(400).json({
//             message:"Incorrect Password"
//         })} 
//         //check if the account has been verified previously 
//         else if (checkIfVerify==false){
        
//         // generate a token for the link to expire after 5 minutes
//         const newToken = await genToken( isEmail, {expiresIn: "5m"} )

//         isEmail.token = newToken
//         // Re send link to re-verify an account that has signed up previously
//         const subject = "Kindly Re-Verify"
//         const link = `${req.protocol}://${req.get("host")}/api/userverify/${isEmail._id}/${newToken}`
//         const message = `Click on the link ${link} to verify, kindly note that this link will expire after 5 minutes`
//         sendEmail({email:isEmail.email,
//             subject,
//             message})

//             return res.json("you havent verified your acct,check your email to reverify your account")
//         }
//         // update the user to logged in
//         const userLoggedin = await userModel.findByIdAndUpdate(isEmail._id, {islogin: true});
//        // save the generated token to "token" variable
//        const token = await genToken( isEmail, {expiresIn: "1d"} );
//        // return a response
//        res.status( 200 ).json( {
//            message: "Sign In successful",
//            token: token,
//            data :userLoggedin
//        })   }
        

           
//     } catch (error) {
//        res.status(500).json({
//         message:error.message
//        }) 
//     }
// }


const logIn = async (req, res) => {
    try {
    // Extract the user's username, email and password
        const {email, password } = req.body;

    // find user by their registered email or username
        const checkUser = await staffModel.findOne({email})
        // const checkUser = await registerModel.findOne({ $or: [{ username }, { email }] })

        // check if the user exists
        if (!checkUser) {
            return res.status(404).json({
                Failed: 'User not found'
            })
        }

      // Compare user's password with the saved password.
        const checkPassword = bcryptjs.compareSync(password, checkUser.password)
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
          userId: checkUser._id,
            password: checkUser.password,
            // isAdmin: checkUser.isAdmin,
            // isSuperAdmin: checkUser.isSuperAdmin

        },
            process.env.secretKey, { expiresIn: "1d" })

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

// to logout a staff
const signOut = async(req, res)=>{
    try {
        const { staffID } = req.body;
        token = ' ';
        const userLogout = await staffModel.findOne(staffID, {token: token}, {islogin: true});
        //const logout = await staffModel.findByIdAndUpdate(staffId, {islogin: false});
        // userLogout.token = ' ';
        // user.islogin = false;
        if(!userLogout) {
            res.status(400).json({
                message: 'User not logged out'
            })
        } else {
            res.status(200).json({
                message: 'User Successfully logged out',
                data: userLogout
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// get all staff
 const allRegStaff = async (req, res)=>{
    try {
        const loginStaff = await staffModel.find()
        if (!loginStaff) {
            res.status(404).json({
                message: 'no sfatt found'
            })
        } else {
            res.status(200).json({
                message: 'All staff Users',
                data: loginStaff
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// update a staffs record 
//  const updateStaff = async (req, res)=>{
//     try {
//         const { staffID } = req.params;
//         const staff = await staffModel.find({staffID});
//         const { name, email, password, role, age } = req.body;
//         const salt = await bcryptjs.genSalt(10);
//         const hashPassword = await bcryptjs.hash( password, salt );
//         // const { adminId } = req.params;
//         // const adminUser = await userModel.findById(adminId);
//         // if (adminUser.isAdmin == false) {
//         //     res.status(400).json({
//         //         message: 'You are not an Admin, Therefore you are not allowed to access this'
//         //     })
//         // } else {
//             const data = {
//                 name: name || staff.name,
//                 email: email || staff.email,
//                 age: age || staff.age,
//                 role: role || staff.role,
//                 password: hashPassword || staff.password,
//                 photo: staff.photo
//             };

//         // while updating.
//         if (req.file && req.file.filename) {
//             const oldPhoto = `uploads/${staff.photo}`;
//             await fs.unlinkSync(oldPhoto)
//             data.photo = req.file.filename
//         }
//             const updateStaff = await staffModel.findOneAndUpdate(staffID, data, {new: true});
//             if (!updateStaff) {
//                 res.status(400).json({
//                     message: 'Failed to Update User'
//                 })
//             } else {
//                 res.status(200).json({
//                     message: 'User updated successfully',
//                     data: updateStaff
//                 })
//             }
//         } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }

const updateStaff = async (req, res) => {
    try {
      const { staffID } = req.params;
      const staff = await staffModel.findOne({ staffID });
  
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
  
      const { name, email, password, role, age } = req.body;
  
      // Prepare the fields to be updated
      const updateData = {
        name: name || staff.name,
        email: email || staff.email,
        age: age || staff.age,
        role: role || staff.role,
        password: password ? await bcryptjs.hash(password, await bcryptjs.genSalt(10)) : staff.password,
        photo: staff.photo,
      };
  
      // Check if a new photo is provided in the request and update accordingly
      if (req.file && req.file.filename) {
        const oldPhoto = `uploads/${staff.photo}`;
        await fs.unlinkSync(oldPhoto);
        updateData.photo = req.file.filename;
      }
  
      // Perform the update and set { new: true } option to get the updated document
      const updatedStaff = await staffModel.findOneAndUpdate({ staffID }, updateData, { new: true });
  
      if (!updatedStaff) {
        return res.status(400).json({ message: 'Failed to Update User' });
      } else {
        return res.status(200).json({ message: 'User updated successfully', data: updatedStaff });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

//delete a staff
const deleteStaff = async (req, res) => {
    try {
        const { hospitalcode } = req.params;
        const Admin = await registerModel.findOne({ hospitalcode });
        const isAdmin = Admin.hospitalcode; 
        console.log(isAdmin)
  
      if (!isAdmin) {
       return  res.status(404).json({ message: 'you are not allowed to perform this function' });
      }

      const {staffID}= req.params
      const staff = await staffModel.findOne({staffID})
      
      if(!staff)(
          res.status(404).json({message:"the staff with this id is not found"})
      )
  
      // Delete the staff member
      await staffModel.findOneAndDelete({ staffID });
      // Remove the staff's photo from Cloudinary if it exists
      if (staff.photo && typeof staff.photo === 'string') {
        const publicID = staff.photo.split('.').slice(0, -1).join('.');
  
        // Use Cloudinary's API to delete the image
        await cloudinary.uploader.destroy(publicID);
      }
  
      // Remove the staff's photo if it exists
    //   if (staff.photo) {
    //     const photoPath = `uploads/${staff.photo}`;
    //     await fs.unlinkSync(photoPath);
      //}
  
      return res.status(200).json({ message: 'Staff member deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// get one staff
 const getOne = async (req, res)=>{
    try {
        const {staffID} = req.params;
        const getUser = await staffModel.findOne({staffID})
        if(!getUser) {
            res.status(404).json({
                message: "couldnt get one"
            })
        }else {
            res.status(200).json({
                message: "all users",
                data: getUser
            })
        }
       
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const genToken = async(user)=>{
    const token = await jwt.sign({
        userId: user._id,
        username: user.name,
        email: user.email
    }, process.env.JWT_TOKEN, {expiresIn: '5m'})
    return token
};


module.exports={
    createStaffprofile,
    logIn,
    signOut,
    allRegStaff,
    updateStaff,
    getOne,
    getAllStaffByHospital,
    verifyEmail,
    resendVerificationEmail,
    deleteStaff

}

