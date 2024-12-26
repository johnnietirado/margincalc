"use server";

import { signIn } from "@/server/auth";

export async function sendMagicLink(email: string, callbackUrl: string) {
  try {
    const result = await signIn("resend", {
      email,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
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
