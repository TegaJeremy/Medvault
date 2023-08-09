const jwt = require( 'jsonwebtoken' );

// auth middleware
const userAuth = ( req, res, next ) => {
    const hasAuthorization = req.headers.authorization;
    if ( !hasAuthorization ) {
        res.status( 404 ).json( {
            message: 'No authorization found.'
        })
    } 
    const token = hasAuthorization.split(' ')[1];
   // console.log(token, " my token")
    try {
        const decodedToken = jwt.verify( token, process.env.secretKey )
        req.user = JSON.stringify(decodedToken);
       // console.log( decodedToken, " this decoded token")
    //    // console.log(req.user,  " this is user")
    //     req.userId = decodedToken.userId;
    //    // console.log(req.user,  " this is userId")
    //     req.userEmail = decodedToken.email;
       // req.username = decodedToken.username;
       req.isVerified = decodedToken.isVerified
       if(req.isVerified === false){
        res.status(401).json({ message: 'user is not  verified, please verify your acc'})
       }


        next();
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

module.exports = {
    userAuth,
};



