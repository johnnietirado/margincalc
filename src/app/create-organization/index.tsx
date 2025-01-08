import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateOrganization() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <div>Create Organization</div>;
}
