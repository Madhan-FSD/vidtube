import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/healthcheck:
 *   get:
 *     summary: Check API health
 *     description: Returns OK if the API is running.
 *     responses:
 *       200:
 *         description: Server is healthy
 */

router.route("/").get(healthcheck);

export default router;
