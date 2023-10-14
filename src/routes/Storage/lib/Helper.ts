import * as Minio from "minio";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../../../../.env" });
export const storage = multer.memoryStorage();
export const upload = multer({ storage });

if (
  !process.env.MINIO_PORT ||
  isNaN(Number(process.env.MINIO_PORT)) ||
  !process.env.MINIO_END_POINT ||
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY ||
  !process.env.MINIO_USE_SSL
) {
  throw new Error("MiniO Config is not propperly set up, please check .env");
}

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_END_POINT, // Replace with your MinIO server URL
  port: parseInt(process.env.MINIO_PORT), // Replace with your MinIO server port
  useSSL: JSON.parse(process.env.MINIO_USE_SSL || "false"), // Convert string to boolean
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

type MinioObjectType = {
  name: string;
  lastModified: Date;
  etag: string;
  size: number;
};

export const getObjectsInBucket = (bucketName: string) => {
  const data: MinioObjectType[] = [];
  let stream = minioClient.listObjects(bucketName, "", true);
  stream.on("data", function (obj: MinioObjectType) {
    data.push(obj);
  });
  stream.on("end", function (obj: any) {
    return data;
  });
  stream.on("error", function (err) {
    return err;
  });
  return data;
};

const objectsInBucket = getObjectsInBucket("mediapartners");
console.log(objectsInBucket);
