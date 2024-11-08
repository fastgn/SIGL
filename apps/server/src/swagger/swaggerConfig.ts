import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import express from "express";
const router = express.Router();

import env from "../services/env.service";

import tags from "./tags.json";
import schemas from "./schemas.json";
import paths from "./paths.json";

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API SIGL",
      version: "1.0.0",
      description: "API pour la gestion de SIGL",
    },
    servers: [
      {
        url: `https://sigl-web-app.francecentral.cloudapp.azure.com/api`,
        description: "Serveur distant",
      },
      { url: `http://localhost:${env.get.PORT}`, description: "Serveur local de développement" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: schemas,
    },
    security: [{ bearerAuth: [] }],
    tags: tags,
  },
  apis: [],
});

// @ts-expect-error: TypeScript does not recognize the paths property
swaggerSpec.paths = { ...swaggerSpec.paths, ...paths };

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
