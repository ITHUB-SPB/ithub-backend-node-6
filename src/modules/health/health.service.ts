/**
 * Health Service Module
 */

import type { HealthData } from "@/modules/health/health.validation";

/**
 * Health Index
 * @returns {Promise<HealthData>}
 */
export const healthIndex = async (): Promise<HealthData> => {
	const health: HealthData = {
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: Math.floor(process.uptime()),
	};

	return health;
};
