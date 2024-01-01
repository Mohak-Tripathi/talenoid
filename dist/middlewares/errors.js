"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // err.message = err.message || "Internal Server Error";
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        console.log(err);
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }
    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = Object.assign({}, err);
        error.message = err.message;
        // Wrong Mongoose Object ID Error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new errorHandler_1.default(message, 400);
        }
        // Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            // const message = Object.values(err.errors).map(value => value.message);
            const message = "Validation Error";
            error = new errorHandler_1.default(message, 400);
        }
        // Handling Mongoose duplicate key errors
        if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
            const message = `Duplicate ${Object.keys(err === null || err === void 0 ? void 0 : err.keyValue)} entered`;
            error = new errorHandler_1.default(message, 400);
        }
        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try Again!!!';
            error = new errorHandler_1.default(message, 400);
        }
        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token is expired. Try Again!!!';
            error = new errorHandler_1.default(message, 400);
        }
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
//# sourceMappingURL=errors.js.map