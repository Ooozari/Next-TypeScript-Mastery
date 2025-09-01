import mongoose, { Schema, Document } from "mongoose";

// Message Interface 
export interface Imessage extends Document {
    content: string,
    createdAt: Date,
}

const messageSchema: Schema<Imessage> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})



// User Interface
export interface IUser extends Document {

    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    // If User have verify its email through OTP code
    isVerified: boolean,
    isAcceptingMsg: boolean,
    message: Imessage[]
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        unique: true, 
        required: [true, "Username is required"],
        trim: true,
     },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMsg: {
        type: Boolean,
        default: true,
    },
    message: [messageSchema],
})


// Export 
// Handling Edge Cases 
// Case 1: Already Scheme is Created 
// Case 2: Schema not yet created
const UserModel = (mongoose.models.IUser as mongoose.Model<IUser>) ||  mongoose.model<IUser>("IUser",UserSchema )


export default UserModel