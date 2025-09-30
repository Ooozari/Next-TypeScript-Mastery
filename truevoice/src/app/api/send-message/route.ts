import dbConnect from "@/lib/dbConnect";
import MessageLimit from "@/models/MessageLimit";
import UserModel, { Imessage } from "@/models/User";
import { getClientIp } from "@/helpers/getClientIP";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const DAILY_LIMIT = 15;
const IP_LIMIT = 200;

// Create fingerprint (UA + language)
function createFingerprint(req: Request): string {
  const ua = req.headers.get("user-agent") || "";
  const lang = req.headers.get("accept-language") || "";
  return crypto.createHash("sha256").update(`${ua}-${lang}`).digest("hex");
}

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  const ip = getClientIp(request);
  const fingerprint = createFingerprint(request);

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

    // 1. Get or set clientId cookie
    const cookieStore = await cookies();
    let clientId = cookieStore.get("clientId")?.value;
    let newCookieHeader: string | undefined;

    if (!clientId) {
      clientId = uuidv4();
      newCookieHeader = `clientId=${clientId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${
        60 * 60 * 24 * 30
      }`;
    }

    const today = new Date().toISOString().split("T")[0];

    // 2. Check client record
    let clientRecord = await MessageLimit.findOne({ clientId, date: today });
    if (!clientRecord) {
      clientRecord = await MessageLimit.create({
        clientId,
        fingerprint,
        senderIp: ip,
        date: today,
        count: 0,
      });
    }

    // 3. Enforce per-client limit
    if (clientRecord.count >= DAILY_LIMIT) {
      return Response.json(
        {
          success: false,
          message: `Daily limit reached (${DAILY_LIMIT} messages).`,
        },
        { status: 429 }
      );
    }

    // 4. Enforce per-IP guardrail
    const ipUsage = await MessageLimit.aggregate([
      { $match: { senderIp: ip, date: today } },
      { $group: { _id: "$senderIp", total: { $sum: "$count" } } },
    ]);
    const totalForIp = ipUsage[0]?.total || 0;

    if (totalForIp >= IP_LIMIT) {
      return Response.json(
        {
          success: false,
          message: "Too many messages from this network today.",
        },
        { status: 429 }
      );
    }

    // 5. Increment and save
    clientRecord.count += 1;
    await clientRecord.save();

    // 6. Add new message
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Imessage);
    await user.save();

    // 7. Build response
    const responseBody = {
      success: true,
      message: "Message sent successfully",
      remaining: DAILY_LIMIT - clientRecord.count,
    };

    if (newCookieHeader) {
      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": newCookieHeader,
        },
      });
    }

    return Response.json(responseBody, { status: 200 });
  } catch (error) {
    console.error("Failed to send message", error);
    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
