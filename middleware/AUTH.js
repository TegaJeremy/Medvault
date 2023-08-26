const jwt = require( 'jsonwebtoken' );
const registerModel = require('../model/registrationmodel')
const staffModel = require('../model/staffModel')

// auth middleware
const userAuth = async  ( req, res, next ) => {
    const hasAuthorization = req.headers.authorization;
    if(!hasAuthorization) {
        res.status(403).json({
            message: 'No Authorization Found, Please Login in.'
        });
    } else {
        const token = hasAuthorization.split(' ')[1]

         try{
      const decodedToken = jwt.verify(token, process.env.secretKey)
      const adminuser = await registerModel.findOne({ email: decodedToken.email, islogin: true });
      if (!adminuser) {
        return res.status(401).json({ message: 'user has been loged out, please login to continue performing acion.' });
        req.adminuser = adminuser;
    }
        //console.log(decodedToken)
        // req.user = JSON.stringify(decodedToken)
        // console.log(decodedToken)
        // req.email = decodedToken.email
        // req.islogin = decodedToken.isLogin 
        // console.log(req.islogin, "this is login")


        // if(req.islogin === false){
        //     return res.status(401).json({message:'you are not logged in you need to be logged in'})
        // }
           
    //   
       
        next();
    } catch (error) {
        res.status(500).json({ message: error.message})

    }
}
}




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



module.exports = {
    userAuth,
    authenticateUser
  
};



