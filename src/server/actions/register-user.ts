"use server";

import { signIn } from "@/server/auth";

export async function registerUser({
  email,
  name,
  callbackUrl,
}: {
  email: string;
  name: string;
  callbackUrl: string;
}) {
  try {
    const result = (await signIn("resend", {
      email,
      name,
      redirect: false,
      callbackUrl,
    })) as { error?: string }; // Specify the expected shape of result

    console.log("result", result);

    if (result.error) {
      // No need for optional chaining now
      return {
        success: false,
        message: "Failed to send magic link. Please try again.",
      };
    } else {
      return { success: true, message: "Magic link sent! Check your email." };
    }
  } catch (error) {
    console.error("Error sending magic link:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
