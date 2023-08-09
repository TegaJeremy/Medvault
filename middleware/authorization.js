const jwt = require ('jsonwebtoken')
const staffModel = require('../model/staffModel');
const adminmodel = require('../model/registrationmodel')


// To authenticate a user token in the database
const authentication = async (req, res, next) => {
    try {
        const staff = await staffModel.findById(req.params.id);

        if(!staff) {
            return res.status(400).json({
                message: 'Admin Authentication Failed: Admin not found'
            })
        }

        const staffToken = staff.token

        if(!staffToken) {
            return res.status(400).json({
                message: 'Authentication Failed: Please sign in.'
            })
        }

        await jwt.verify(staffToken, process.env.secretKey, (err, payLoad) => {

            if (err) {
                return res.json(err.message)
            } else {
                req.staff = payLoad
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
        const staff = await  staffModel.findById(req.params.id)

        if(!staff) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found'
            })
        }
        const staffToken = staff.token

        if(!staffToken) {
            return res.status(400).json({
                message: 'Authentication Failed: Please sign in.'
            })
        }

        await jwt.verify(staffToken, process.env.secretKey, (err, payLoad) => {

            if (err) {
                return res.json(err.message)
            } else {
                req.staff = payLoad
                //console.log(req.staff)
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
    authenticate(req, res, async () => {
       // console.log(req.staff.isStaff)
       const { id } = req.params;
    //    const id = req.staff.userid.userId
       const user = await staffModel.findById(id)
       console.log(user)
       // console.log(req.staff.userid)
        if(user.isStaff === true) {
            next()
        } else {
            res.status(400).json({
                message: 'You are not authorized to perform this action'
            })
        }
    })
}



// Super admin authorization
// const superAuth = (req, res, next) => {
//     authentication(req, res, async () => {
//         if(req.user.isSuperAdmin) {
//             next()
//         } else {
//             res.status(400).json({
//                 message: 'You are not authorized to perform this action'
//             })
//         }
//     })
// }




module.exports = {
    checkUser,
    //superAuth,
    authenticate
}
