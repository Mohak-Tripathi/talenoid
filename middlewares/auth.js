const User = require('../models/authModel');
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies
    console.log(req.cookies)

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    }

    // console.log(process.env.JWT_SECRET, process.env.JWT_EXPIRES_TIME, "TT")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id);
    // console.log(req.user)
    // console.log(req.user.id)
    // console.log(req.user._id)


    next()
})



// Handling users roles
exports.authorizeRoles = (...roles) => {   //spreading roles as there can be more than 1 role are authorized to access resource.
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {   //req.user attched in authentication
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        //403 forbidden request
 
        next()
    }
}

