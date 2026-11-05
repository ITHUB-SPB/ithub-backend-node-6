import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { generateTokenPair } from "../src/lib/jwt"

describe('генерация пары токенов', () => {
    it('Возвращает данные в корректном формате', () => {
        const pair = generateTokenPair({ userId: "13", email: 'user13@example.com' })
        // проверить вывод функции на соответствие схемы зода (либо вручную)
    })

    it('Значение expires_in успешно получено из env', () => {
        // убедиться, что env.JWT_EXPIRES_IN успешно подтянут из окружения
    })

    it('Вызывает функцию generateAccessToken с корректным входом', () => {
        // убедиться, что произошел вызов generateAccessToken
        // убедиться, что на вход передается payload с входа функции generateTokenPair
        // https://vitest.dev/guide/learn/mock-functions
    })

    it('Вызывает функцию generateRefreshToken с корректным входом', () => {
        // убедиться, что произошел вызов generateRefreshToken
        // убедиться, что на вход передается payload с входа функции generateTokenPair
        // https://vitest.dev/guide/learn/mock-functions  
    })
})