const User = require('../models/authModel');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

const validator = require('validator');



// Register a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;


       // Validate email using the validator package
       if (!validator.isEmail(email)) {
        return next(new ErrorHandler('Invalid email address', 400))
        // return res.status(400).json({ success: false, error: 'Invalid email address' });
    }


      // Validate password length
      if (password.length < 6) {
        return next(new ErrorHandler('Password must be at least 6 characters long', 400));
    }

       let user = await User.create({
            name,
            email,
            password
        })


    sendToken(user, 201, res)  // SENDING WHOLE "res" object too in jwtToken.js

})


// Login User  =>  /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password') //becz in model it is false. 

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401)); //401=> bad request
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }


    // const token= user.getJwtToken()

    // res.status(201).json({   // before sendToken function
    //     success: true,
    //     token
    // })

    sendToken(user, 200, res) // SENDING WHOLE "res" object too in jwtToken.js
})




// Logout user   =>   /api/v1/logout

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: false
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})


// Admin Routes

// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        length: users.length,
        users
    })
})



// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);  //params and not req.user. Keep that in mind

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        user
    })
})


// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const userData = await User.findById(req.params.id);  //params and not req.user. Keep that in mind

  if (!userData) {
      return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404))
  }

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role //admin can change the user role as well.
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {   //req.params.id "remember"
        new: true
    })

    res.status(200).json({
        success: true
    })
})

// Delete user by Admin  =>   /api/v1/admin/user/:id
exports.deleteUserByAdmin = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    await User.findOneAndDelete({ _id: req.params.id });
    // await user.remove();

    res.status(200).json({
        success: true,
    })
})
