import ProfileMessageEmail from "@/emails/profile-message";
import { resend } from "../resend";

export async function sendProfileMessage(email: string, message: string) {
  return await resend.emails.send({
    to: email,
    from: "hello@codealo.dev",
    react: <ProfileMessageEmail message={message} />,
    subject: "New Message from Codealo",
  });
}
