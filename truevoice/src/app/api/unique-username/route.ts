import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import * as z from "zod";
import { UsernameValidation } from "@/schemas/signUpSchema";


const usernameVerficationSchema = z.object({
    username: UsernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        // getting the whole url (localhost:3000/api/username?=ooozari)
        const { searchParams } = new URL(request.url)
        // filtering username out of it searchParams 
        const queryParams = {
            username: searchParams.get('username')
        }

        // Zod validation on username
        const result = usernameVerficationSchema.safeParse(queryParams)
        //TODO: Console the result
        console.log("Result :: ", result)

        // Checking for errors 
        // result contain alot of this like success, errors, data
        if (!result.success) {
            // error.format() hold all the errors in array but we only require of username
            const UsernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: UsernameErrors.length > 0 ? UsernameErrors.join(', ') :
                    "Invalid username query parameter"
            }, { status: 400 })
        }

        // If username is safe pass the validation
        const { username } = result.data

        // if username is already taken in database
        const existingverfiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingverfiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 409 })
        }

        return Response.json({
                success: true,
                message: "Username is unique"
            }, { status: 200 })


    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}