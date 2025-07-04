import env from "./services/env.service";
import logger from "./utils/logger";
import express, { NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ReqContext } from "./providers/req-context";
// Routes
import authRoutes from "./routes/authRoutes";
import diaryRoutes from "./routes/diaryRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import deliverableRoutes from "./routes/deliverableRoutes";
import noteRoutes from "./routes/noteRoutes";
import compagnyAccountRoute from "./routes/compagnyAccountRoute";
import companyRoutes from "./routes/companyRoutes";
import meetingRoutes from "./routes/meetingRoutes";
import tutorRoutes from "./routes/tutorRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import mentorRoutes from "./routes/mentorRoutes";
// Stream /files to Azure Blob Storage
import { AZURE_STORAGE_CONNECTION_STRING, CONTAINER_NAME } from "./middleware/fileMiddleware";
// Swagger
import swaggerConfig from "./swagger/swaggerConfig";
import groupRoutes from "./routes/groupRoutes";
import { BlobServiceClient } from "@azure/storage-blob";
import biannualEvaluationRoutes from "./routes/biannualEvaluationRoutes";

const app = express();
const port = env.get.PORT;

// Middleware
const corsOptions: CorsOptions = {
  origin: env.get.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(
  bodyParser.json({
    limit: "50mb",
  }),
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use(cookieParser());
app.use(helmet());

app.use((req, _, next) => {
  req.context = new ReqContext();
  next();
});

// Logger middleware
app.use((req, _res, next) => {
  logger.info(`Requête reçue sur ${req.method} ${req.path}`);
  next();
});

// Ajout du contexte de requête (ex: mémorisation de l'utilisateur connecté)
app.use((req, _, next) => {
  req.context = new ReqContext();
  next();
});

app.use("/auth", authRoutes);
app.use("/diary", diaryRoutes);
app.use("/user", userRoutes);
app.use("/groups", groupRoutes);
app.use("/events", eventRoutes);
app.use("/note", noteRoutes);
app.use("/compagnyAccount", compagnyAccountRoute);
app.use("/deliverables", deliverableRoutes);
app.use("/company", companyRoutes);
app.use("/meeting", meetingRoutes);
app.use("/biannualEvaluations", biannualEvaluationRoutes);
app.use("/tutor", tutorRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/mentor", mentorRoutes);

app.get("/file/:blobName", async (req: Request, res: Response) => {
  const containerName = CONTAINER_NAME;
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

  const blobName = req.params.blobName;

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download(0);

    res.setHeader(
      "Content-Type",
      downloadBlockBlobResponse.contentType || "application/octet-stream",
    );
    res.setHeader("Content-Disposition", `attachment; filename=${blobName}`);

    downloadBlockBlobResponse.readableStreamBody?.pipe(res);
  } catch (error: any) {
    logger.error(`Erreur lors du téléchargement du fichier : ${error.message}`);
    res.status(500).send("Erreur lors du téléchargement du fichier");
  }
});

app.use("/api-docs", swaggerConfig);

app.get("/", (_req: Request, res: Response) => {
  logger.info("Accès à la route principale");
  res.send("Bienvenue sur l'API FASTGN !");
});

app.use((_req: Request, res: Response) => {
  logger.warn("404 - Route non trouvée");
  res.status(404).send("Désolé, cette route n'existe pas !");
});

app.use((err: Error, _req: Request, res: Response) => {
  logger.error(`Erreur serveur : ${err.message}`);
  res.status(500).send("Erreur interne du serveur");
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`[*] ${req.method} ${req.originalUrl}`);
  next();
});

app.listen(port, async () => {
  console.log(`[*] Server is running at http://localhost:${port}`);
  logger.info(`[*] Server is running on port ${port}`);
});

export default app;
