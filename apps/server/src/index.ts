import env from "./services/env-service";
env.init();
import express from "express";
import router from "./routes/router";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

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

app.listen(port, () => {
  console.log(`[*] Server is running at http://localhost:${port}`);
});
