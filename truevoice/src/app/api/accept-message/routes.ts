import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


// Request to Update the Message acceptance status
export async function POST(request: Request) {

    await dbConnect();
    // STEP 1:
    // Grabbing User from Session
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User // User (from the sesssion)
    if (!user && !session) {
        return Response.json({
            success: false,
            message: "Not Authenticated",
        }, {
            status: 401
        })
    }

    //STEP 2: FLAG & ID
    const userId = user._id;
    // Getting from user while hitting this api 
    const { acceptMessage } = await request.json()

    //STEP 3: TRY/CATCH
    try {
        const updated = await UserModel.findByIdAndUpdate(
            // Update by
            userId,
            //update to
            {
                isAcceptingMsg: acceptMessage
            },
            // Retuning the updated doc after the update
            { new: true }
        )

        // Unable to find the user
        if (!updated) {
            return Response.json({
                success: false,
                message: "Failed to find the user",
            }, {
                status: 404
            })
        }

        //Message acceptance status has been updated
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updated,
        }, {
            status: 200
        })


    } catch (error) {
        console.error("Failed to update the accepting status", error);
        return Response.json({
            success: false,
            message: "Failed to update the accepting status",
        }, {
            status: 500,
        })
    }

}



// Request to see the Message acceptance status
export async function GET(request: Request) {

    await dbConnect();
    // STEP 1:
    // Grabbing User from Session
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User // User (from the sesssion)
    if (!user && !session) {
        return Response.json({
            success: false,
            message: "Not Authenticated",
        }, {
            status: 401
        })
    }

    try {

        //STEP 2: Getting user
        const foundUser = await UserModel.findById(user._id)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to find the user",
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            isAcceptingMsg: foundUser.isAcceptingMsg
        }, {
            status: 200
        })

    }
    catch (error) {
        console.error("Failed to update the accepting status", error);
        return Response.json({
            success: false,
            message: "Failed to update the accepting status",
        }, {
            status: 500,
        })
    }
}

