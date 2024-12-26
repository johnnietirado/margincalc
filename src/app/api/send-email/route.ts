import { sendProfileMessage } from "@/lib/emails/send-profile-message";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, message } = (await request.json()) as {
    email: string;
    message: string;
  };

  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required" },
      { status: 400 }
    );
  }

  try {
    await sendProfileMessage(email, message);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
