import { env } from "@/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Initialize Cloudflare R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadFileToR2(
  file: File,
  folder: string
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const objectKey = `${folder}/${Date.now()}-${file.name}`;

  const uploadParams = {
    Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: objectKey,
    Body: buffer,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(uploadParams);
  await r2Client.send(command);

  return `${env.CLOUDFLARE_R2_PUBLIC_URL}/${objectKey}`;
}
