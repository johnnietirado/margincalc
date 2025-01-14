"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxFileSize?: number;
}

export function ImageUpload({
  onFileChange,
  accept = "image/*",
  maxFileSize = MAX_FILE_SIZE,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxFileSize) {
        toast.error(
          `File too large. Please select an image under ${
            maxFileSize / (1024 * 1024)
          }MB.`
        );
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please select an image file.");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="max-w-full"
      />
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 h-24 w-24 rounded-md object-cover shadow-sm"
        />
      )}
    </div>
  );
}
