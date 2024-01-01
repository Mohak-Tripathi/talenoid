"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByAdmin = exports.updateUserByAdmin = exports.getUserDetails = exports.allUsers = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const authModel_1 = __importDefault(require("../models/authModel"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const validator_1 = __importDefault(require("validator"));
// Register a user   => /api/v1/register
exports.registerUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Validate email using the validator package
    if (!validator_1.default.isEmail(email)) {
        return next(new errorHandler_1.default("Invalid email address", 400));
        // return res.status(400).json({ success: false, error: 'Invalid email address' });
    }
    // Validate password length
    if (password.length < 6) {
        return next(new errorHandler_1.default("Password must be at least 6 characters long", 400));
    }
    let user = yield authModel_1.default.create({
        name,
        email,
        password,
    });
    (0, jwtToken_1.default)(user, 201, res); // SENDING WHOLE "res" object too in jwtToken.js
}));
// Login User  =>  /api/v1/login
exports.loginUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new errorHandler_1.default("Please enter email & password", 400));
    }
    // Finding user in database
    const user = yield authModel_1.default.findOne({ email }).select("+password"); //becz in model it is false.
    if (!user) {
        return next(new errorHandler_1.default("Invalid Email or Password", 401)); //401=> bad request
    }
    // Checks if password is correct or not
    const isPasswordMatched = yield user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new errorHandler_1.default("Invalid Email or Password", 401));
    }
    // const token= user.getJwtToken()
    // res.status(201).json({   // before sendToken function
    //     success: true,
    //     token
    // })
    (0, jwtToken_1.default)(user, 200, res); // SENDING WHOLE "res" object too in jwtToken.js
}));
// Logout user   =>   /api/v1/logout
exports.logoutUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: false,
    });
    res.status(200).json({
        success: true,
        message: "Logged out",
    });
}));
// Admin Routes
// Get all users   =>   /api/v1/admin/users
exports.allUsers = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield authModel_1.default.find();
    res.status(200).json({
        success: true,
        length: users.length,
        users,
    });
}));
// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authModel_1.default.findById(req.params.id); //params and not req.user. Keep that in mind
    if (!user) {
        return next(new errorHandler_1.default(`User does not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
}));
// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUserByAdmin = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield authModel_1.default.findById(req.params.id); //params and not req.user. Keep that in mind
    if (!userData) {
        return next(new errorHandler_1.default(`User does not found with id: ${req.params.id}`, 404));
    }
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role, //admin can change the user role as well.
    };
    const user = yield authModel_1.default.findByIdAndUpdate(req.params.id, newUserData, {
        //req.params.id "remember"
        new: true,
    });
    res.status(200).json({
        success: true,
        user,
    });
}));
// Delete user by Admin  =>   /api/v1/admin/user/:id
exports.deleteUserByAdmin = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield authModel_1.default.findById(id);
    if (!user) {
        return next(new errorHandler_1.default(`User does not found with id: ${req.params.id}`, 404));
    }
    yield authModel_1.default.findOneAndDelete({ _id: req.params.id });
    // await user.remove();
    res.status(200).json({
        success: true,
    });
}));
//# sourceMappingURL=authController.js.map