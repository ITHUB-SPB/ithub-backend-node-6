import { disconnectDb } from "@/application/database.js";
import { logger } from "@/application/logging.js";
import { closeRedis } from "@/application/redis.js";

import { startServer } from "./bootstrap";

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

startServer();
