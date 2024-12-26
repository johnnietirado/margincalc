import { EmailDialog } from "@/components/dashboard/email-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/database";
import { users } from "@/database/schema";
import { USER_ROLES } from "@/lib/constants/user-roles";
import { getInitials } from "@/lib/user-utils";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

async function getUser(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="col-span-3">
      <h1 className="mb-4 text-2xl font-bold">User Profile</h1>
      <div className="grid items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-4">
              <Avatar className="h-20 w-20 border">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
                <AvatarFallback>{getInitials(user.name ?? "")}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.name ?? "No name provided"}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="default" className="bg-gray-500">
                    {USER_ROLES.USER}
                  </Badge>
                  {user.role === USER_ROLES.ADMIN && (
                    <Badge variant="default" className="bg-blue-500">
                      {USER_ROLES.ADMIN}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email Verified:</strong>{" "}
                {user.emailVerified
                  ? user.emailVerified.toLocaleDateString()
                  : "Not verified"}
              </p>
              <p>
                <strong>Stripe Customer ID:</strong>{" "}
                {user.stripeCustomerId ?? "Not available"}
              </p>
            </div>
            <div className="mt-4">
              <EmailDialog userEmail={user.email} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
