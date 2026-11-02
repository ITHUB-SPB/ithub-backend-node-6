/**
 * Health Route Module
 */

import { router } from "@/application/route.js";
import { INTERNAL_SERVER_ERROR_SCHEMA } from "@/lib/constants.js";
import { INTERNAL_SERVER_ERROR, OK } from "@/lib/http-status-codes.js";
import * as controller from "@/modules/health/health.controller.js";
import { healthResponseSchema } from "@/modules/health/health.validation.js";

const route = router();

const basePath = "/health";

/**
 * GET /health - Health check endpoint
 */
route.get("/", controller.index, {
	name: "health.check",
	basePath,
	description: "Health check endpoint to verify service status",
	authenticated: false,
	responses: {
		[OK]: healthResponseSchema,
		[INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
	},
});

export default route.init();
