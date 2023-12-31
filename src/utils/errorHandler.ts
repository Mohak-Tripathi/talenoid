// Error Handler Class
class ErrorHandler extends Error {

    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
        // console.log(Error.captureStack, "A")
   
    }
}

export default ErrorHandler;