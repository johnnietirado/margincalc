import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = await currentUser();

  if (!session || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = clerkClient();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  try {
    if (file) {
      await client.users.updateUserProfileImage(user.id, {
        file,
      });

      return NextResponse.json(
        {
          message: "Profile picture updated successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json(
      {
        message: "Error updating profile picture",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
