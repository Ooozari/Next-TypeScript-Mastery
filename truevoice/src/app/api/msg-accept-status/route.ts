import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


// Request to see the Message acceptance status 
export async function GET(request: Request) {
    await dbConnect();


   const { username } = await request.json()
    try {

     
       const user = await UserModel.findOne({username });

        if (!user) {
            return Response.json({
                success: false,
                message: "Failed to find the user",
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            isAcceptingMsg: user.isAcceptingMsg
        }, {
            status: 200
        })
    }
    catch (error) {
        console.error("Failed to check accept message status", error);
        return Response.json({
            success: false,
            message: "Failed to check accept message status",
        }, {
            status: 500,
        })
    }
}