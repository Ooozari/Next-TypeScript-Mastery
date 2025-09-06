import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, 
  context: { params: Promise<{ messageid: string }> }

) {
    const { messageid } = await context.params;


    await dbConnect()
    // Grabbing User from Session 
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User  // User (from the session) 

    if (!session || !user) {
        return Response.json(
            { success: false, message: "Not Authenticated", },
            { status: 401 })
    }
    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } },
        )

        if (updatedResult.modifiedCount == 0) {
            return Response.json(
                { success: false, message: "Message not found or already deleted", },
                { status: 404 })
        }
        return Response.json(
            { success: true, message: "Message deleted successfully", },
            { status: 200 })
    } catch (error) {
        console.error("Failed to delete the message", error);
        return Response.json(
            { success: false, message: "Failed to delete the message", },
            { status: 500 })
    }
}


