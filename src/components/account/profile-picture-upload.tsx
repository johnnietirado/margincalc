"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUser } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProfilePictureUpload() {
  const { user } = useUser();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.imageUrl ?? null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File too large. Please select an image under 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please select an image file.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    startTransition(() => {
      (async () => {
        try {
          const formData = new FormData();
          formData.append("file", selectedFile);

          const response = await fetch("/api/update-profile-picture", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to update profile picture");
          }

          toast.success("Profile picture updated successfully.");
        } catch (error) {
          console.error("Error updating profile picture:", error);
          toast.error("Failed to update profile picture. Please try again.");
        }
      })();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center space-x-4">
          <Avatar className="h-20 w-20 border">
            <AvatarImage src={previewUrl ?? undefined} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="max-w-full"
            />
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Upload a square image, max 5MB.
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <SubmitButton isPending={isPending} onClick={handleSave}>
          Save
        </SubmitButton>
      </CardFooter>
    </Card>
  );
}
