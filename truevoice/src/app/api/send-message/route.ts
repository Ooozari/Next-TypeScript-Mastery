import dbConnect from "@/lib/dbConnect";
import MessageLimit from "@/models/MessageLimit";
import UserModel, { Imessage } from "@/models/User";
import { getClientIp } from "@/helpers/getClientIP";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  const ip = getClientIp(request);

  try {
    if (!ip) {
      return Response.json(
        { success: false, message: "Oops! Something went wrong." },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "No user found with this username" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMsg) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    let sender = await MessageLimit.findOne({ senderIp: ip, date: today });

    // daily limit reached
    if (sender && sender.count >= 5) {
      return Response.json(
        {
          success: false,
          message:
            "You have reached your daily message limit (5 messages per day).",
        },
        { status: 429 }
      );
    }

    // Increment or create sender record (if no sender already)
    if (!sender) {
      // First time ever
      sender = await MessageLimit.create({
        senderIp: ip,
        date: today,
        count: 1,
      });
    } else if (sender.date !== today) {
      // New day → reset count
      sender.date = today;
      sender.count = 1;
      await sender.save();
    } else {
      // Same day → increment count
      sender.count += 1;
      await sender.save();
    }

    // Add new message
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Imessage);
    await user.save();
    const remaining = 5 - sender.count;
    return Response.json(
      { success: true, message: "Message sent successfully", remaining },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send message to user", error);
    return Response.json(
      { success: false, message: "Failed to send message to user" },
      { status: 500 }
    );
  }
}
