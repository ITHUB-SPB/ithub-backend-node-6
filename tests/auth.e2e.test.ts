import { randomUUID } from "node:crypto";

import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { setupServer } from "../src/bootstrap";
import {
	loginResponseSchema,
	profileResponseSchema,
	refreshTokenResponseSchema,
	registerResponseSchema,
} from "../src/modules/auth/auth.validation";

const credentials = {
	name: "Supertest User",
	email: `supertest-${randomUUID()}@example.com`,
	password: "Supertest1",
};

let app!: NonNullable<Awaited<ReturnType<typeof setupServer>>>;
let accessToken = "";
let refreshToken = "";

const expectValidationError = (response: request.Response) => {
	expect(response.status).toBe(422);
	expect(response.body.success).toBe(false);
	expect(response.body.status).toBe("error");
	expect(response.body.errors).toEqual(expect.any(Array));
};

beforeAll(async () => {
	app = await setupServer();
	const response = await request(app)
		.post("/auth/register")
		.send(credentials)
		.set("Accept", "application/json");

	expect(response.status).toBe(201);
	const parsed = registerResponseSchema.parse(response.body);
	accessToken = parsed.data.access_token;
	refreshToken = parsed.data.refresh_token;
});

describe("POST /auth/register", () => {
	it("registers a new account and returns a valid response", async () => {
		const response = await request(app)
			.post("/auth/register")
			.send({
				...credentials,
				email: `new-${randomUUID()}@example.com`,
			})
			.set("Accept", "application/json");

		expect(response.status).toBe(201);
		registerResponseSchema.parse(response.body);
		expect(response.body.success).toBe(true);
	});

	it("returns 409 for an already registered email", async () => {
		const response = await request(app)
			.post("/auth/register")
			.send(credentials);

		expect(response.status).toBe(409);
		expect(response.body.success).toBe(false);
		expect(response.body.data).toBeNull();
	});

	it("returns 422 for invalid registration data", async () => {
		const response = await request(app)
			.post("/auth/register")
			.send({ ...credentials, password: "weak" });

		expectValidationError(response);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([expect.objectContaining({ path: "password" })]),
		);
	});
});

describe("POST /auth/login", () => {
	it("logs in with valid credentials", async () => {
		const response = await request(app).post("/auth/login").send(credentials);

		expect(response.status).toBe(200);
		loginResponseSchema.parse(response.body);
		expect(response.body.data.access_token).toEqual(expect.any(String));
	});

	it("returns 401 for an unknown user", async () => {
		const response = await request(app)
			.post("/auth/login")
			.send({
				email: `missing-${randomUUID()}@example.com`,
				password: credentials.password,
			});

		expect(response.status).toBe(401);
		expect(response.body.success).toBe(false);
	});

	it("returns 422 for invalid login data", async () => {
		const response = await request(app)
			.post("/auth/login")
			.send({ email: credentials.email, password: "" });

		expectValidationError(response);
	});
});

describe("POST /auth/refresh", () => {
	it("refreshes the access token", async () => {
		const response = await request(app)
			.post("/auth/refresh")
			.send({ refresh_token: refreshToken });

		expect(response.status).toBe(200);
		refreshTokenResponseSchema.parse(response.body);
		expect(response.body.data.access_token).toEqual(expect.any(String));
	});

	it("returns 401 for an invalid refresh token", async () => {
		const response = await request(app)
			.post("/auth/refresh")
			.send({ refresh_token: "invalid-refresh-token" });

		expect(response.status).toBe(401);
		expect(response.body.success).toBe(false);
	});

	it("returns 422 when refresh token is empty", async () => {
		const response = await request(app)
			.post("/auth/refresh")
			.send({ refresh_token: "" });

		expectValidationError(response);
	});
});

describe("GET /auth/profile", () => {
	it("returns the authenticated user's profile", async () => {
		const response = await request(app)
			.get("/auth/profile")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		profileResponseSchema.parse(response.body);
		expect(response.body.data.email).toBe(credentials.email);
	});

	it("returns 401 when Authorization is missing", async () => {
		const response = await request(app).get("/auth/profile");

		expect(response.status).toBe(401);
		expect(response.body.success).toBe(false);
	});

	it("returns 401 for an invalid access token", async () => {
		const response = await request(app)
			.get("/auth/profile")
			.set("Authorization", "Bearer invalid-access-token");

		expect(response.status).toBe(401);
		expect(response.body.success).toBe(false);
	});
});
