import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

export const s3Client = new S3Client(s3ClientConfig);

// const s3ClientConfig: S3ClientConfig = {
//   region: "eu-north-1",
//   credentials: {
//     accessKeyId:
//     secretAccessKey:
//   },
// };
