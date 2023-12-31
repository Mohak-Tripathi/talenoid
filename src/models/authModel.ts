import validator from 'validator'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose, { Document, Model } from 'mongoose';


// export type UserDocument = Document & {
//     name: string;
//     email: string;
//     password: string;
//     role: string;
//     createdAt: Date;
//     comparePassword(enteredPassword: string): Promise<boolean>;
//     getJwtToken(): string;

// }

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
    getJwtToken(): string;
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],   //minlength not "minLength"
        select: false   //when displaying user- I don't want to show password of user.
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

// Encrypting password before saving user
userSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword: string) : Promise <boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Return JWT token

userSchema.methods.getJwtToken = function ():string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}


// module.exports = mongoose.model('User', userSchema);

const User: Model<UserDocument> = mongoose.model('User', userSchema);

export default User; 