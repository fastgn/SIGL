import env from "./services/env.service";
try {
  env.init();
} catch (error) {
  console.error(error);
  process.exit(1);
}

import express from "express";
import router from "./routes/router";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { initDB } from "./providers/db";

const app = express();
const port = env.get.PORT;

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
app.use(cookieParser());

// Endpoints
app.use((req, _, next) => {
  console.log(`[*] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(router);

app.listen(port, async () => {
  console.log(`[*] Server is running at http://localhost:${port}`);
  initDB().then(async (db) => {
    try {
      await db.$connect();
      console.log("[*] Connected to database");
      await db.user.findMany().then((users) => {
        console.log("[*] Users in database:", users);
      });
    } catch (error) {
      console.error("[!] Error connecting to database:", error);
      process.exit(1);
    }
  });
});
