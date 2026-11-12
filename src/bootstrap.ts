import express from "express";
import { connectDb } from "@/application/database.js";
import env from "@/application/env.js";
import { logger } from "@/application/logging.js";
import { initRedis } from "@/application/redis.js";
import { registerModules } from "@/application/route.js";
import { setupScalarDocs } from "@/application/scalar.js";
import { httpLogger } from "@/middleware/http-logger.js";
import notFound from "@/middleware/not-found.js";
import onError from "@/middleware/on-error.js";
import serveEmojiFavicon from "@/middleware/serve-emoji-favicon.js";

export async function setupServer() {
	try {
		await connectDb();
		await initRedis();

		const app = express();

		app.use(httpLogger);
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use(serveEmojiFavicon("🚀"));

		await registerModules(app, !env.VITEST);
		setupScalarDocs(app);

		app.use(notFound);
		app.use(onError);

		return app;
	} catch (error) {
		logger.error("Failed to start server:", error);
		process.exit(1);
	}
}
