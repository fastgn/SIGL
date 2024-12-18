import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

type MulterRequest = Request & { file?: Express.Multer.File };
const upload = multer({ storage: multer.memoryStorage() });

export const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING ||
  "DefaultEndpointsProtocol=https;AccountName=sigl;AccountKey=K9s5w+zruljBKw5PkVrt8EzerVLnrvxCinERVsPUkWOl/7uJ07eJYwGS/E/vj3Rr37eOTZrYta9l+AStMKfZ2g==;EndpointSuffix=core.windows.net";
export const CONTAINER_NAME = "livrable-sigl";

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("Azure Storage connection string is not defined in environment variables.");
}

// Middleware to upload a file to Azure Blob Storage
export const fileMiddleware = [
  upload.single("file"),
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING,
      );
      const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

      const blobName = `${uuidv4()}-${req.file.originalname}`;
      const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

      console.log(`Uploading to Azure Blob Storage as blob: ${blobName}`);

      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });

      const name = blockBlobClient.name;
      console.log(`File uploaded successfully. Name: ${name}`);

      req.body.blobName = name;

      next();
    } catch (error: any) {
      console.error("Error uploading file to Azure Blob Storage:", error);
      res.status(500).json({ message: "File upload failed.", error: error.message });
    }
  },
];
