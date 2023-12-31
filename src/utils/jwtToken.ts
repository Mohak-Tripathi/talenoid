// Create and send token and save in the cookie.

import {Response} from "express"
import { UserDocument } from "../models/authModel";

const sendToken = (user:UserDocument, statusCode:number, res: Response):void => {

    // Create Jwt token
    const token = user.getJwtToken();

    // Options for cookie
    const options : {
        expires: Date;
        httpOnly: boolean;
    } = {
        expires: new Date(
            Date.now() +  7  * 24 * 60 * 60 * 1000  //changing in milliseconds
        ),
        httpOnly: false //now can't be accessed through javascript code in frontend.
    }


    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })

}

export default sendToken;

// module.exports = sendToken;
