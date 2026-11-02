import express from "express";
import { connectDb, disconnectDb } from "@/application/database.js";
import env from "@/application/env.js";
import { logger } from "@/application/logging.js";
import { closeRedis, initRedis } from "@/application/redis.js";
import { registerModules } from "@/application/route.js";
import { setupScalarDocs } from "@/application/scalar.js";
import { httpLogger } from "@/middleware/http-logger.js";
import notFound from "@/middleware/not-found.js";
import onError from "@/middleware/on-error.js";
import serveEmojiFavicon from "@/middleware/serve-emoji-favicon.js";

async function startServer() {
	try {
		await connectDb();
		await initRedis();

		const app = express();

		app.use(httpLogger);
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use(serveEmojiFavicon("🚀"));

		await registerModules(app, true);
		setupScalarDocs(app);

		app.use(notFound);
		app.use(onError);

		app.listen(env.PORT, () => {
			logger.info(
				`Health check available at http://localhost:${env.PORT}/health`,
			);
			logger.info(
				`Documentation available at http://localhost:${env.PORT}/docs`,
			);
			logger.info(`Server is running at http://localhost:${env.PORT}`);
		});
	} catch (error) {
		logger.error("Failed to start server:", error);
		process.exit(1);
	}
}

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
