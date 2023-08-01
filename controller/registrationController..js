const registerModel = require ('../model/registrationmodel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:"Gmail",
    port: 2525,
  auth: {
    user: process.env.user,
    pass: process.env.password
  }
  });



// creating a registration code
const register = async (req, res)=>{
   try {
    const  {facilityname, facilityaddress, email, password, facilityphone, state, city , LGA,} = req.body
     // check if the entry email exist
     const isEmail = await registerModel.findOne( { email } );
     if ( isEmail ) {
         res.status( 400 ).json( {
             message: `user with this email: ${email} already exist.`
         })
        }else{

    //salt the password using bcrypt
    const salt = bcrypt.genSaltSync(10)
    //hash the password using bcrypt
    const hashedPassword  = bcrypt.hashSync(password, salt)
      // create a token
      const token = await jwt.sign( { email }, process.env.secretKey, { expiresIn: "30m" } );
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
    const user = new registerModel( {
        facilityname, 
        facilityaddress,
        email,
        password:hashedPassword,
        facilityphone,
        state,
        city,
        LGA,
        hospitalID:ID
    })
      // send verification email
      const baseUrl = process.env.BASE_URL
      const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: "Verify your account",
          html: `Please click on the link to verify your email: <a href="${baseUrl}/users/verify-email/${ token }">Verify Email</a>`,
      };
      await transporter.sendMail( mailOptions );
            // save the user
            user.isAdmin=true
            const savedUser = await user.save();

            // return a response
            res.status( 201 ).json( {
            message: `Check your email: ${savedUser.email} to verify your account.`,
            data: savedUser,
            token })
            
  }
    
   } catch (error) {
    res.status(500).json(error.message)
   }


}

// verify email
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
        const updatedUser = await registerModel.findOneAndUpdate( {email}, user );

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
        const user = await registerModel.findOne( { email } );
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

const logout = async (req, res) => {
    try {
      const {userId} = req.user;
  
      // Update the user's token to null
      const user = await registerModel.findByIdAndUpdate(userId, { token: null }, { new: true });
  
      if (!user) {
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
  }
  const createstaff = async()=>{
    try {
      const {email}= req.body
      const token = await jwt.sign({ email }, process.env.secretKey, { expiresIn: "30m" })
      const baseurl = process.env.BASE_URL
      const mailOptions2 = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Email Verification",
        html: `Please click on this link to register: <a href="http://localhost:7000/api/users/verify-email/${ token }">register</a>`,
    };
    await transporter.sendMail( mailOptions2 );

    res.status( 200 ).json( {
        message: `email sent successfully to your email: ${user.email}`,
        data:token
        
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
    logout

}