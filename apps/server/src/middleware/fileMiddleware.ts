import { BlobServiceClient, BlockBlobClient, logger } from "@azure/storage-blob";
import multer from "multer";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export type MulterRequest = Request & { file?: Express.Multer.File };
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
        logger.error("No file uploaded.");
        return res.status(400).json({ message: "No file uploaded." });
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING,
      );
      const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

      const blobName = `${uuidv4()}-${req.file.originalname}`;
      const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

      logger.info(`Uploading to Azure Blob Storage as blob: ${blobName}`);

      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });

      const name = blockBlobClient.name;
      logger.info(`File uploaded successfully. Name: ${name}`);

      req.body.blobName = name;

      next();
    } catch (error: any) {
      logger.error("Error uploading file to Azure Blob Storage:", error);
      res.status(500).json({ message: "File upload failed.", error: error.message });
    }
  },
];

export const deleteFileFromBlob = async (blobName: string) => {
  if (!blobName) {
    logger.error("No blob name provided.");
    return;
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.delete();
    logger.info(`File ${blobName} deleted successfully.`);
  } catch (error: any) {
    logger.error(`Error deleting file ${blobName}:`, error);
  }
};
