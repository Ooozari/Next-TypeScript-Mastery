import dbConnect from "@/lib/dbConnect";
import UserModel, { Imessage } from "@/models/User";
import { log } from "console";



export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json()


    try {
        const user = await UserModel.findOne({username})

        //CASE 1: There is no user with this username
        if (!user) {
            return Response.json({
                success: false,
                message: "No user found with this username"
            }, {
                status: 404
            })
        }

        //CASE 2: user is not accepting messages
        if (!user.isAcceptingMsg) {
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            }, {
                status: 403 // forbidden
            })
        }

        // CASE 3: Add new message to user model
        // creating a message
        const newMessage = {
            content, createdAt: new Date()
        }

        // setting this new message into user messages model
        user.messages.push(newMessage as Imessage);
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
        }, {
            status: 200
        })


    } catch (error) {
        console.error("Failed to send mesage to user", error
        );

        return Response.json({
            success: false,
            message: "Failed to sent message to user",
        }, {
            status: 500
        })
    }

}