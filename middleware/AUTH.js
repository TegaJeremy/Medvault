const jwt = require( 'jsonwebtoken' );
const registerModel = require('../model/registrationmodel')
const staffModel = require('../model/staffModel')

// auth middleware
const userAuth = ( req, res, next ) => {
    const hasAuthorization = req.headers.authorization;
    if(!hasAuthorization) {
        res.status(403).json({
            message: 'No Authorization Found, Please Login in.'
        });
    } else {
        const token = hasAuthorization.split(' ')[1]

         // Check if the token is in the blacklist
    // const isBlacklisted = blacklistedTokens.includes(token);
    // if (isBlacklisted) {
    //     return res.status(401).json({
    //       message: 'Token is no longer valid'
    //     });
    //   }
    //    // console.log(token, "this is token")
        try{
      const decodedToken = jwt.verify(token, process.env.secretKey)
        //console.log(decodedToken)
        req.user = JSON.stringify(decodedToken)
        console.log(decodedToken)
        req.email = decodedToken.email
        req.islogin = decodedToken.isLogin 
        console.log(req.islogin, "this is login")


        if(req.islogin === false){
            return res.status(401).json({message:'you are not logged in you need to be logged in'})
        }
           
    //     // JSON.stringify(decodedToken)
    //    // req.user = decodedToken
    //    // console.log(req.user)
    //    // console.log(req.user ,"my token")
    //    // console.log( decodedToken, " this decoded token")
    //      req.userEmail = decodedToken.email;
    //   //console.log(req.userEmail, "is email ")
    //    req.username = decodedToken.username;
    //   // console.log(req.username )
    //    req.isVerified = decodedToken.isVerified
    //   //console.log(req.isVerified)
       
        next();
    } catch (error) {
        res.status(500).json({ message: error.message})

    }
}
}

// const authenticator = async (req, res,next)=>{
//     const { hospitalId } = req.params;
//     const newUser = await userModel.findById(hospitalId);
//     const token = newUser.token;
//     await jwt.verify(token, process.env.secretKey, (err, payLoad)=>{
//         if(err){
//             return res.status(403).json({
//                 message: 'token is not valid'
//             })
//         } else {
//             req.newUser = payLoad;
//             next();
//         }
//     })
// }


// const loginAuth = (req, res, next)=>{
//     authenticator(req, res, async ()=>{
//         const { hospitalId } = req.params;
//         const existingUser = await userModel.findById(hospitalId);
//         if (existingUser.islogin == false) {
//             res.status(403).json({
//                 message: 'you are not logged in'
//             })
//         } else {
//             next()
//         }
//     })
// };

const findUserAndCheckLogin = async (req, res) => {
    try {
        const { userId } = req.params;
       // const { staffId } = req.params;

        // Find the user by their ID
        const user = await userModel.findById(userId);
        //const staff = await staffModel.findById(staffId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Check if the user is logged in
        if (user.islogin) {
            return res.status(200).json({
                message: 'User is logged in',
                
            });
        } else {
            return res.status(200).json({
                message: 'User is not logged in, please login',
               
            });
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message,
        });
    }
};


// const authenticateUser = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         if (!token) {
//             return res.status(401).json({ message: 'Authorization token is missing' });
//         }

//         const decodedToken = jwt.verify(token, process.env.secretKey);
//         const adminuser = await registerModel.findOne({ email: decodedToken.email });
//         const staffuser = await staffModel.findOne({email: decodedToken.email  })

//         if (!adminuser || staffuser) {
//             return res.status(401).json({ message: 'User not found' });
//         }
//          // Check if the user has logged in
//          if (!adminuser.islogin || !staffuser.islogin) {
//             return res.status(401).json({ message: 'User has not logged in yet. Please log in.' });
//         }

//         // Attach user information to the request object
//         req.adminuser = adminuser;
//         req.staffuser = staffuser

//         // Continue with the next middleware or route handler
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const decodedToken = jwt.verify(token, process.env.secretKey);
        
        const adminuser = await registerModel.findOne({ email: decodedToken.email, islogin: true });
        const staffuser = await staffModel.findOne({ email: decodedToken.email, islogin: true });

        if (!adminuser && !staffuser) {
            return res.status(401).json({ message: 'user has been loged out, please login to continue performing acion.' });
        }

        // Attach user information to the request object
        req.adminuser = adminuser;
        req.staffuser = staffuser;

        // Continue with the next middleware or route handler
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateUser;

module.exports = authenticateUser;



module.exports = {
    userAuth,
    findUserAndCheckLogin,
    authenticateUser
   // loginAuth
};



