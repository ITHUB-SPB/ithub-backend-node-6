import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import * as z from 'zod'
import dotenv from 'dotenv'
import { generateTokenPair } from "../src/lib/jwt";
import * as jwtModule from '../src/lib/jwt'

dotenv.config({ path: ".env.development" })

const TokenPairSchema = z.object({
    access_token: z.string().min(1),
    refresh_token: z.string().min(1),
    token_type: z.literal("Bearer"),
    expires_in: z.string().min(1),
})
const payload = { userId: "13", email: "user13@example.com" }

afterEach(() => {
    vi.restoreAllMocks();
})


describe('генерация пары токенов', () => {
    it('Возвращает данные в корректном формате', () => {
        const pair = generateTokenPair(payload)
        expect(() => TokenPairSchema.parse(pair)).not.toThrow()
    })

    it('Значение expires_in успешно получено из env', () => {
        const pair = generateTokenPair(payload)
        expect(pair.expires_in).toBe(process.env.JWT_EXPIRES_IN)
        expect(pair.expires_in).toBeTruthy()
    })

    it('Вызывает функцию generateAccessToken с корректным входом', () => {
        const spy = vi.spyOn(jwtModule.jwtService, "generateAccessToken")
        generateTokenPair(payload)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(payload)
    })

    it('Вызывает функцию generateRefreshToken с корректным входом', () => {
        const spy = vi.spyOn(jwtModule.jwtService, "generateRefreshToken")
        generateTokenPair(payload)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(payload)
    })
})