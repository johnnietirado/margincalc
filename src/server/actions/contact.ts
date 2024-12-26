"use server";

import { resend } from "@/lib/resend";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const emailContent = `
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `;

  await resend.emails.create({
    from: "contact@yourdomain.com",
    to: "johnnie@codealo.dev",
    subject: "New Contact Form Submission",
    text: emailContent,
  });
}
