import User, { UserDocument } from "../models/authModel";
import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "./catchAsyncErrors";


interface AuthenticatedRequest extends Request {
    user?: UserDocument | null;
}

// Checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req: AuthenticatedRequest, res:Response, next:NextFunction): Promise<void> => {
    const { token } = req.cookies
    console.log(req.cookies)

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    }


    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = await User.findById(decoded.id) as UserDocument | null;
      } catch (error) {
        return next(new ErrorHandler('Invalid token, please log in again.', 401));
      }


    next()
})



// Handling users roles
export const authorizeRoles = (...roles: string[]) => {   //spreading roles as there can be more than 1 role are authorized to access resource.
    return (req: AuthenticatedRequest, res:Response, next:NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {   //req.user attched in authentication
            return next(
                new ErrorHandler(`Role (${req?.user?.role}) is not allowed to acccess this resource`, 403))
        }
        //403 forbidden request
 
        next()
    }
}

