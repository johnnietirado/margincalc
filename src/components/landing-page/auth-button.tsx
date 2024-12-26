"use client";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import Link from "next/link";

export default function AuthButton() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <Button asChild variant={isAuthenticated ? "default" : "link"}>
      <Link href={isAuthenticated ? "/dashboard" : "/sign-in"}>
        {isAuthenticated ? "Dashboard" : "Sign In"}{" "}
        <span aria-hidden="true" className="ml-2">
          &rarr;
        </span>
      </Link>
    </Button>
  );
}
