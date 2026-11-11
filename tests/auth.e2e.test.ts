import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import request from "supertest";
import * as z from "zod";
import { setupServer } from "../src/bootstrap";
import {
  registerResponseSchema,
  loginResponseSchema,
  refreshTokenResponseSchema,
  profileResponseSchema,
} from "../src/modules/auth/auth.validation";
import { UNPROCESSABLE_ENTITY_SCHEMA } from "../src/lib/constants";
vi.setConfig({ testTimeout: 30_000 });

let accessToken: string | undefined;

const ErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  data: z.null(),
});

const populateAccessToken = async () => {
  const app = await setupServer();
  const credentials = {
    email: "Supertest1@example.com",
    password: "Supertest1",
  };

  try {
    await request(app)
      .post("/auth/login")
      .send(credentials)
      .set("Accept", "application/json")
      .then((response) => {
        accessToken = response.body.data.access_token;
      });
  } catch (error: unknown) {
    await request(app)
      .post("/auth/register")
      .send({ ...credentials, name: "Supertest1" })
      .set("Accept", "application/json")
      .then((response) => {
        accessToken = response.body.data.access_token;
      });
  }
};

describe("/POST /auth/register", () => {
  it("Успешная регистрация нового аккаунта", async () => {
    const app = await setupServer();
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "testuser",
        email: `${Date.now()}@mail.com`,
        password: "Password123",
      });

    expect(response.statusCode).toBe(201);
    expect(() => registerResponseSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 409 при попытке использования занятой почты", async () => {
    const app = await setupServer();
    const email = `${Date.now()}@mail.com`;
    const payload = { name: "testuser", email, password: "Password123" };

    const first = await request(app).post("/auth/register").send(payload);
    expect(first.statusCode).toBe(201);

    const response = await request(app).post("/auth/register").send(payload);

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(() => ErrorSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 422 при ошибке валидации (например, по паролю) ", async () => {
    const app = await setupServer();

    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "testuser",
        email: `${Date.now()}@mail.com`,
        password: "pswrd",
      });

    expect(response.statusCode).toBe(422);
    expect(response.body.status).toBe("error");
    expect(() =>
      UNPROCESSABLE_ENTITY_SCHEMA.parse(response.body),
    ).not.toThrow();
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ where: "body", path: "password" }),
      ]),
    );
  });
});

describe("/POST /auth/login", () => {
  const createUser = async (app: any) => {
    const email = `${Date.now()}@mail.com`;
    const password = "Password123";
    await request(app)
      .post("/auth/register")
      .send({ name: "testuser", email, password });
    return { email, password };
  };

  it("Успешный логин", async () => {
    const app = await setupServer();
    const { email, password } = await createUser(app);

    const response = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(response.statusCode).toBe(200);
    expect(() => loginResponseSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 401 при входе с данными несуществующего пользователя", async () => {
    const app = await setupServer();

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: `none-${Date.now()}@mail.com`,
        password: "SecurePass123",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(() => ErrorSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 422 при ошибке валидации (например, по паролю) ", async () => {
    const app = await setupServer();

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@mail.com", password: "" });

    expect(response.statusCode).toBe(422);
    expect(response.body.status).toBe("error");
    expect(() =>
      UNPROCESSABLE_ENTITY_SCHEMA.parse(response.body),
    ).not.toThrow();
  });
});

describe("/POST /auth/refresh", () => {
  const getRefreshToken = async (app: any) => {
    const email = `ref-${Date.now()}@mail.com`;
    const password = "Password123";
    const reg = await request(app)
      .post("/auth/register")
      .send({ name: "testuser", email, password });
    return reg.body.data.refresh_token as string;
  };

  it("Успешное обновление", async () => {
    const app = await setupServer();
    const refresh_token = await getRefreshToken(app);

    const response = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token });

    expect(response.statusCode).toBe(200);
    expect(() => refreshTokenResponseSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 401 при обращении с несуществующим (либо устаревшим) рефреш-токеном", async () => {
    const app = await setupServer();

    const response = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token: "invalid.token.here" });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(() => ErrorSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 422 при ошибке валидации (например, при нулевой длине рефреш-токена) ", async () => {
    const app = await setupServer();

    const response = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token: "" });

    expect(response.statusCode).toBe(422);
    expect(response.body.status).toBe("error");
    expect(() =>
      UNPROCESSABLE_ENTITY_SCHEMA.parse(response.body),
    ).not.toThrow();
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ where: "body", path: "refresh_token" }),
      ]),
    );
  });
});

describe("/POST /auth/profile", () => {
  beforeAll(populateAccessToken);

  it("Выдает данные о пользователе при передаче корректного Authorization-хедера", async () => {
    const app = await setupServer();

    const response = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(() => profileResponseSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 401 при отсутствии Authorization-хедера", async () => {
    const app = await setupServer();

    const response = await request(app).get("/auth/profile");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(() => ErrorSchema.parse(response.body)).not.toThrow();
  });

  it("Выдает 401 при передаче несуществующего (либо некорректного) аксесс-токена", async () => {
    const app = await setupServer();

    const response = await request(app)
      .get("/auth/profile")
      .set("Authorization", "Bearer invalid.token.here");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(() => ErrorSchema.parse(response.body)).not.toThrow();
  });
});
