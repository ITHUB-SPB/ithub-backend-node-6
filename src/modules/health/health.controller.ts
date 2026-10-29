/**
 * Health Controller Module
 */

import type { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR, OK } from "@/lib/http-status-codes";
import { INTERNAL_SERVER_ERROR as INTERNAL_SERVER_ERROR_PHRASE } from "@/lib/http-status-phrases";
import * as service from "@/modules/health/health.service";

/**
 * Health Check Controller
 *
 * @param {Request} _req Express request object
 * @param {Response} res Express response object
 *
 * @returns {Promise<void>}
 */
export const index = async (_req: Request, res: Response): Promise<void> => {
	try {
		const data = await service.healthIndex();
		res.status(OK).json({
			status: "success",
			data,
		});
	} catch (error) {
		res.status(INTERNAL_SERVER_ERROR).json({
			message: INTERNAL_SERVER_ERROR_PHRASE,
			error: error instanceof Error ? error.message : String(error),
		});
	}
};
