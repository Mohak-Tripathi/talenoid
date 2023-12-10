// Error Handler Class
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
        // console.log(Error.captureStack, "A")
   
    }
}

module.exports = ErrorHandler;