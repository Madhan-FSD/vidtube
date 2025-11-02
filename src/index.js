import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import https from "https";
import morgan from "morgan";
import logger from "./utils/logger.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8001;
const HEALTHCHECK_URL = process.env.HEALTH_CHECK_PING_URL;

if (!HEALTHCHECK_URL) {
  logger.error("Missing HEALTH_CHECK_PING_URL in environment!");
  process.exit(1);
}

function pingHealthcheck() {
  const url = HEALTHCHECK_URL;
  const req = https.get(url, { timeout: 5000 }, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      if (res.statusCode === 200) {
        logger.info(
          `Healthcheck ping success at ${new Date().toISOString()} body: ${body}`
        );
      } else {
        logger.error(
          `Healthcheck ping failed – status: ${res.statusCode} body: ${body}`
        );
      }
    });
  });

  req.on("error", (err) => {
    logger.error(`Healthcheck ping failed: ${err.message}`);
  });

  req.on("timeout", () => {
    logger.error("Healthcheck ping timed out");
    req.abort();
  });
}

// Morgan + Winston structured logging setup
app.use(
  morgan(
    (tokens, req, res) =>
      JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: parseInt(tokens.status(req, res), 10),
        responseTime: `${tokens["response-time"](req, res)} ms`,
        userAgent: tokens["user-agent"](req, res),
      }),
    {
      stream: {
        write: (message) => {
          // Remove newline at end
          const trimmed = message.trim();
          try {
            const obj = JSON.parse(trimmed);
            const level =
              obj.status >= 500 ? "error" : obj.status >= 400 ? "warn" : "info";
            logger.log({ level, message: "", meta: obj });
          } catch (err) {
            // fallback if JSON parse fails
            logger.info(trimmed);
          }
        },
      },
    }
  )
);

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);

      // initial ping
      pingHealthcheck();
      // schedule pings every 10 minutes
      setInterval(pingHealthcheck, 10 * 60 * 1000);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error", { error: err });
    process.exit(1);
  });
