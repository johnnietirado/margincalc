"use server";

import { signIn } from "@/server/auth";

export async function authProviderSignIn(providerId: string) {
  await signIn(providerId);
}
