const jwt = require ('jsonwebtoken')
const staffModel = require('../model/staffModel');


// To authenticate a user token in the database
const authentication = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.adminId);

        if(!user) {
            return res.status(400).json({
                message: 'Admin Authentication Failed: Admin not found'
            })
        }

        const userToken = user.token

        if(!userToken) {
            return res.status(400).json({
                message: 'Admin Authentication Failed: Please sign in.'
            })
        }

        await jwt.verify(userToken, process.env.JWT_SECRET, (err, payLoad) => {

            if (err) {
                return res.json(err.message)
            } else {
                req.user = payLoad
                next()
            }
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// To authenticate if a user is signed in

const authenticate = async (req, res, next) => {
    try {
        const user = await  staffModel.findById(req.params.userId)

        if(!user) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found'
            })
        }
        const userToken = user.token

        if(!userToken) {
            return res.status(400).json({
                message: 'Authentication Failed: Please sign in.'
            })
        }

        await jwt.verify(userToken, process.env.JWT_SECRET, (err, payLoad) => {

            if (err) {
                return res.json(err.message)
            } else {
                req.user = payLoad
                next()
            }
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}

// Admin authorization
const checkUser = (req, res, next) => {
    authentication(req, res, async () => {
        if(req.user.isAdmin || req.user.isSuperAdmin) {
            next()
        } else {
            res.status(400).json({
                message: 'You are not authorized to perform this action'
            })
        }
    })
}



// Super admin authorization
const superAuth = (req, res, next) => {
    authentication(req, res, async () => {
        if(req.user.isSuperAdmin) {
            next()
        } else {
            res.status(400).json({
                message: 'You are not authorized to perform this action'
            })
        }
    })
}




module.exports = {
    checkUser,
    superAuth,
    authenticate
}
