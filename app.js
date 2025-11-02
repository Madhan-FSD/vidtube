import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// 🧠 Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vidtube API",
      version: "1.0.0",
      description: "Auto-generated Swagger docs using swagger-jsdoc",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  apis: ["./src/docs/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import usersRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", usersRouter);

app.use(errorHandler);

export { app };
