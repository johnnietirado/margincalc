import MagicLinkEmail from "@/emails/magic-link";
import { type EmailConfig } from "next-auth/providers";
import { resend } from "../resend";

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
  request: Request;
}) {
  const { identifier: to, provider, url } = params;
  const originalUrl = new URL(url);
  const host = originalUrl.host;
  const callbackUrl = originalUrl.searchParams.get("callbackUrl") ?? "/";

  // Check if callbackUrl has a query parameter called callbackUrl
  const callbackUrlWithParams = new URL(callbackUrl, `https://${host}`);
  const nestedCallbackUrl =
    callbackUrlWithParams.searchParams.get("callbackUrl");

  if (nestedCallbackUrl) {
    // Replace the original callbackUrl with the nested one
    originalUrl.searchParams.set("callbackUrl", nestedCallbackUrl);
  }

  const updatedUrl = originalUrl.toString();

  const res = await resend.emails.send({
    from: provider.from ?? "",
    to,
    subject: `Sign in to ${host}`,
    react: <MagicLinkEmail loginLink={updatedUrl} />,
  });

  if (res.error) {
    throw new Error(`Resend error: ${JSON.stringify(res.error)}`);
  }
}
