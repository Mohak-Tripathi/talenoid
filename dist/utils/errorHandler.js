"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Error Handler Class
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
        // console.log(Error.captureStack, "A")
    }
}
exports.default = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map