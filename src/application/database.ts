import { PrismaPg } from "@prisma/adapter-pg";
import { logger } from "@/application/logging";
import { PrismaClient } from "@/generated/prisma/client";
import env from "./env";

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
	adapter,
	log: [
		{
			emit: "stdout",
			level: "query",
		},
		{
			emit: "stdout",
			level: "error",
		},
		{
			emit: "stdout",
			level: "info",
		},
		{
			emit: "stdout",
			level: "warn",
		},
	],
});

prisma.$on("error", (e) => {
	logger.error(e);
});

prisma.$on("warn", (e) => {
	logger.warn(e);
});

prisma.$on("info", (e) => {
	logger.info(e);
});

prisma.$on("query", (e) => {
	logger.info(e);
});

const connectDb = async () => {
	try {
		logger.info({ tag: "DB", message: "Connecting to database..." });
		await prisma.$connect();
		logger.info({ tag: "DB", message: "Database connected successfully" });
	} catch (error) {
		logger.error(
			"Database connection failed:",
			error instanceof Error ? error.message : String(error),
		);
		process.exit(1);
	}
};

const disconnectDb = async () => {
	await prisma.$disconnect();
};

export { prisma, connectDb, disconnectDb };
