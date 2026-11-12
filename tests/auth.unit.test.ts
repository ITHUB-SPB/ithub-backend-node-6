import { afterEach, describe, expect, it, vi } from "vitest";
import z from "zod";

import env from "../src/application/env";
import * as jwtUtils from "../src/lib/jwt";

const tokenPairSchema = z.object({
	access_token: z.string().min(1),
	refresh_token: z.string().min(1),
	token_type: z.literal("Bearer"),
	expires_in: z.string().min(1),
});

const payload = { userId: "13", email: "user13@example.com" };

describe("generateTokenPair", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns a token pair with the documented shape", () => {
		const pair = jwtUtils.generateTokenPair(payload);

		expect(tokenPairSchema.safeParse(pair).success).toBe(true);
	});

	it("uses JWT expiration from the environment", () => {
		const pair = jwtUtils.generateTokenPair(payload);

		expect(pair.expires_in).toBe(env.JWT_EXPIRES_IN);
	});

	it("calls generateAccessToken with the original payload", () => {
		const accessTokenSpy = vi
			.spyOn(jwtUtils.tokenGenerators, "generateAccessToken")
			.mockReturnValue("access-token");
		vi.spyOn(jwtUtils.tokenGenerators, "generateRefreshToken").mockReturnValue(
			"refresh-token",
		);

		const pair = jwtUtils.generateTokenPair(payload);

		expect(accessTokenSpy).toHaveBeenCalledOnce();
		expect(accessTokenSpy).toHaveBeenCalledWith(payload);
		expect(pair.access_token).toBe("access-token");
	});

	it("calls generateRefreshToken with the original payload", () => {
		vi.spyOn(jwtUtils.tokenGenerators, "generateAccessToken").mockReturnValue(
			"access-token",
		);
		const refreshTokenSpy = vi
			.spyOn(jwtUtils.tokenGenerators, "generateRefreshToken")
			.mockReturnValue("refresh-token");

		const pair = jwtUtils.generateTokenPair(payload);

		expect(refreshTokenSpy).toHaveBeenCalledOnce();
		expect(refreshTokenSpy).toHaveBeenCalledWith(payload);
		expect(pair.refresh_token).toBe("refresh-token");
	});
});
