import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export const authOptions: NextAuthOptions = {
    providers: [
        // credentials
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                identifier: { label: 'Email/Usernmae', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials: any): Promise<any> {
                // Step 1: first connext to database
                await dbConnect()

                // Step 2:
                try {
                    const user = await UserModel.findOne({
                        // Use $or for future-proof queries by username or email
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    // If user not found then return
                    if (!user) {
                        throw new Error("No user found with this email")
                    }
                    // If user is not verified then return
                    if (!user.isVerified) {
                        throw new Error("Please verfiy your account first")
                    }

                    // If user is found then compare password
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    // If isPasswordCorrect the return the user
                    if (isPasswordCorrect) {
                        //this user will the return to the credential provder and we can access it in the callback
                        return user;
                    }
                    else {
                        throw new Error("Incorrect password");
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            },
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        // here the user is coming from the credentials
        async jwt({ token, user }) {
            // we have to customize the token here according to our requirement
            // for that we have to define types in next-auth.d.ts


            // if user is exsiting we only need it then
            if (user) {
                // add new properties to tokens
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMsg = user.isAcceptingMsg
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                // add new properties to tokens
                session.user = {
                    ...session.user, // keep email, name, image
                    _id: token._id?.toString(),
                    username: token.username,
                    isVerified: token.isVerified,
                    isAcceptingMsg: token.isAcceptingMsg,
                };
            }
            return session
        },

    },
    secret: process.env.NEXTAUTH_SECRET

}


