"use strict";
// Create and send token and save in the cookie.
Object.defineProperty(exports, "__esModule", { value: true });
const sendToken = (user, statusCode, res) => {
    // Create Jwt token
    const token = user.getJwtToken();
    // Options for cookie
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 //changing in milliseconds
        ),
        httpOnly: false //now can't be accessed through javascript code in frontend.
    };
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    });
};
exports.default = sendToken;
// module.exports = sendToken;
//# sourceMappingURL=jwtToken.js.map