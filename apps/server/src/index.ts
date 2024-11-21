import env from "./services/env.service";
import logger from "./utils/logger";
import express, { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ReqContext } from "./providers/req-context";

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

// Routes
import authRoutes from "./routes/authRoutes";
import diaryRoutes from "./routes/diaryRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import noteRoutes from "./routes/noteRoutes";

app.use("/auth", authRoutes);
app.use("/diary", diaryRoutes);
app.use("/user", userRoutes);
app.use("/groups", groupRoutes);
app.use("/events", eventRoutes);
app.use("/note", noteRoutes);

// Swagger
import swaggerConfig from "./swagger/swaggerConfig";
import { ReqContext } from "./providers/req-context";
import groupRoutes from "./routes/groupRoutes";
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
  // initDB().then(async (db) => {
  //   try {
  //     await db.$connect();
  //     console.log("[*] Connected to database");
  //   } catch (error) {
  //     console.error("[!] Error connecting to database:", error);
  //     process.exit(1);
  //   }
  // });
});
