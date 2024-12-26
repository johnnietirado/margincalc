// Uncomment this when you want to use rate limiting

// import { Ratelimit } from "@upstash/ratelimit";
// import { kv } from "@vercel/kv";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// const geminiRatelimit = new Ratelimit({
//   redis: kv,
//   limiter: Ratelimit.slidingWindow(60, "1 m"),
//   analytics: true,
//   prefix: "gemini_ratelimit",
// });

// function getIP() {
//   return headers().get("x-real-ip") ?? "unknown";
// }

// export async function rateLimit() {
//   const limit = await geminiRatelimit.limit(getIP());
//   if (!limit.success) {
//     redirect("/waiting-room");
//   }
// }

export default function rateLimit() {
  return true;
}
