import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username } = await request.json()


        // it will return the while user object
        const userExists = await UserModel.exists({ username, isVerified: true });

        //CASE 1:  No user if available with this username and is not verified
        if (!userExists) {
            return Response.json({ success: false, message: "No user found" }, { status: 404 });
        }
        //CASE 2:  user is available then we can give positive reponse
        return Response.json({
            success: true,
            message: "Redirecting... Please wait."
        }, { status: 200 })

    } catch (error) {
        console.error("Failed to find user profile", error)
        return Response.json({
            success: false,
            message: "Failed to find user profile"
        }, { status: 500 })
    }

}