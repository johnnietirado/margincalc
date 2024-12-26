"use server"; // Indicate this is a server component

import { WelcomeEmail } from "@/emails/welcome-email";
import { resend } from "../resend"; // Import resend instance

export async function sendWelcomeEmail(userEmail: string, username: string) {
  return await resend.emails.create({
    from: "welcome@codealo.dev", // Set the sender's email
    to: userEmail,
    subject: "Welcome to Our SaaS Platform!",
    react: <WelcomeEmail username={username} />, // Use the React component for the email
  });
}
