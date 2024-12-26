"use server";

import ContactFormSubmission from "@/emails/contact-form-submission";
import { env } from "@/env";
import { resend } from "@/lib/resend";

export async function sendContactUsEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return await resend.emails.create({
    from: `Contact <${env.FROM_EMAIL}>`,
    to: "johnnie@codealo.dev",
    subject: "New Contact Us Submission",
    react: (
      <ContactFormSubmission name={name} email={email} message={message} />
    ),
  });
}
