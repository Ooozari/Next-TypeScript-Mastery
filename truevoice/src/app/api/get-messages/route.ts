import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

// Request to GET the Messages
export async function GET(request: Request) {

    await dbConnect();
    // STEP 1:
    // Grabbing User from Session
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User // User (from the sesssion)
    if (!user || !session) {
        return Response.json({
            success: false,
            message: "Not Authenticated",
        }, {
            status: 401
        })
    }

    // to make sure the user string is handled properly in aggregation
    const userId = new mongoose.Types.ObjectId(user._id)

    try {

        const foundUser = await UserModel.aggregate([
            // here comes the stages of pipelines ($match, $unwind, $sort,$group, $push)

            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { '$messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])


        if (!foundUser || foundUser.length == 0) {
            return Response.json({ success: true, messages: [] }, { status: 200 })
        }


        return Response.json({
            success: true,
            messages: foundUser[0].messages
        }, {
            status: 200
        })

    }
    catch (error) {
        console.error("Failed to get user messages", error);
        return Response.json({
            success: false,
            message: "Failed to get user messages",
        }, {
            status: 500,
        })
    }
}