"use client";

import { env } from "@/env";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

const UserIdentifier = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  useEffect(() => {
    if (
      userId &&
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost"
    ) {
      posthog.identify(userId);
    }
  }, [userId]);

  return <>{children}</>;
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <ClerkProvider signUpUrl="/sign-up" signInUrl="/sign-in">
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserIdentifier>{children}</UserIdentifier>
          </ThemeProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </PostHogProvider>
  );
}
