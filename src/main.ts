import { disconnectDb } from "@/application/database.js";
import { logger } from "@/application/logging.js";
import { closeRedis } from "@/application/redis.js";
import env from "@/application/env.js";

import { setupServer } from "./bootstrap.js";

const app = await setupServer()

app.listen(env.PORT, () => {
	logger.info(
		`Health check available at http://localhost:${env.PORT}/health`,
	);
	logger.info(
		`Documentation available at http://localhost:${env.PORT}/docs`,
	);
	logger.info(`Server is running at http://localhost:${env.PORT}`);
});

process.on("SIGINT", async () => {
	logger.info("Shutting down gracefully...");
	await disconnectDb();
	await closeRedis();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	logger.info("Shutting down gracefully...");
	await disconnectDb();
	await closeRedis();
	process.exit(0);
});