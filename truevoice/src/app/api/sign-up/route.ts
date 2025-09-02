// Connecting to database is compulsory in every api (next.js) because it runs on edge

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
// Helper function to send verification email
import { sendverificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";



export async function POST(request: Request) {

    //first it is compulsory to connect to database
    await dbConnect()

    try {
        // value from frontend
        const body = await request.json();
        console.log("Raw Body:", body);  // Debugging line

        const { username, email, password } = body;
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);

        // Case 1: By Username in signUp
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (existingUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Verified username already exist"
                },
                {
                    status: 400,
                })
        }


        // Case 2: By Email

        const existingUserByEmail = await UserModel.findOne({
            email,
        })

        // generating the OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User with this email already exist"
                    },
                    {
                        status: 400,
                    })
                // User has some how forget his password and want to create a new passord for it
            } else {

                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = OTP,
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)

            // creating a FRESH User
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: OTP,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMsg: true,
                message: [],
            })

            // saving the new user in modal
            await newUser.save()
        }

        // sending verification email is user can be created 
        const emailResponse = await sendverificationEmail(
            email,
            username,
            OTP,
        )

        // If email is not sent 
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            },
                {
                    status: 500,
                })
        }

        // If email is sent successfully 
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your account.",
        },
            {
                status: 201,
            })

    } catch (error) {
        console.error("Error registring user", error)
        // returning API Response using our interface
        return Response.json({
            success: false,
            message: "Error registring user",
        },
            {
                status: 500,
            })
    }




}




