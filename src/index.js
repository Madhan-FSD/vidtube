import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import https from "https";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8001;
const HEALTHCHECK_URL = process.env.HEALTH_CHECK_PING_URL;

function pingHealthcheck() {
  https
    .get(HEALTHCHECK_URL)
    .on("error", (err) =>
      console.error("Healthcheck ping failed:", err.message)
    );
  console.log("Healthcheck ping sent at", new Date().toISOString());
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);

      pingHealthcheck();

      setInterval(pingHealthcheck, 10 * 60 * 1000);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error", err);
  });
