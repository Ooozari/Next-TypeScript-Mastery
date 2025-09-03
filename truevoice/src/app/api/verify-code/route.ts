import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodeduser = decodeURIComponent(username)
        // it will return the while user object
        const user = await UserModel.findOne({ username: decodeduser })

        if (!user) {
            return Response.json({
                success: false,
                message: "No user found in verifying code"
            }, { status: 400 })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeExpiryValid = new Date(user.verifyCodeExpiry) > new Date()

        // if Code is not expired and code is correct 
        if (isCodeValid && isCodeExpiryValid) {
            // then make user verified
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 }) 
        }
        // code is expired
        else if (!isCodeExpiryValid) {
            return Response.json({
                success: false,
                message: "Code has expired"
            }, { status: 410 })
        }
        // code is invalid
        else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Verification code is invalid"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Something went wrong with the verification process"
            }, { status: 500 })
        }
    } catch (error) {
        console.error("Failed to verify the code", error)
        return Response.json({
            success: false,
            message: "Failed to verify the code"
        }, { status: 500 })
    }

}