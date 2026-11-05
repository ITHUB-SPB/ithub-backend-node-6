import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest'

import { setupServer } from '../src/bootstrap'


let accessToken: string | undefined;

const populateAccessToken = async () => {
    const app = await setupServer()
    const credentials = { email: 'Supertest1@example.com', password: 'Supertest1' }

    try {
        await request(app)
            .post('/auth/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .then(response => {
                accessToken = response.body.data.access_token
            })
    } catch (error: unknown) {
        await request(app)
            .post('/auth/register')
            .send({ ...credentials, name: 'Supertest1' })
            .set('Accept', 'application/json')
            .then(response => {
                accessToken = response.body.data.access_token
            })
    }
}

describe('/POST /auth/register', () => {
    it('Успешная регистрация нового аккаунта', async () => {
        // после получения ответа вызвать валидацию через зод и убедиться в отсутствии ошибок
    })

    it('Выдает 409 при попытке использования занятой почты', async () => {
        // проверить статус-код и success: false в ответе
    })

    it('Выдает 422 при ошибке валидации (например, по паролю) ', async () => {
        // проверить статус-код, success: false и наличие массива errors с соответствующей ошибкой в ответе
    })
})

describe('/POST /auth/login', () => {
    it('Успешный логин', async () => {
        // после получения ответа вызвать валидацию через зод и убедиться в отсутствии ошибок
    })

    it('Выдает 401 при входе с данными несуществующего пользователя', async () => {
        // проверить статус-код и success: false в ответе
    })

    it('Выдает 422 при ошибке валидации (например, по паролю) ', async () => {
        // проверить статус-код, success: false и наличие массива errors с соответствующей ошибкой в ответе
    })
})

describe('/POST /auth/refresh', () => {
    it('Успешное обновление', async () => {
        // после получения ответа вызвать валидацию через зод и убедиться в отсутствии ошибок
    })

    it('Выдает 401 при обращении с несуществующим (либо устаревшим) рефреш-токеном', async () => {
        // проверить статус-код и success: false в ответе
    })

    it('Выдает 422 при ошибке валидации (например, при нулевой длине рефреш-токена) ', async () => {
        // проверить статус-код, success: false и наличие массива errors с соответствующей ошибкой в ответе
    })
})

describe('/POST /auth/profile', () => {
    beforeAll(populateAccessToken)

    it('Выдает данные о пользователе при передаче корректного Authorization-хедера', async () => {
        // после получения ответа вызвать валидацию через зод и убедиться в отсутствии ошибок
    })

    it('Выдает 401 при отсутствии Authorization-хедера', async () => {
        // проверить статус-код и success: false в ответе

        const app = await setupServer()

        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(403)
    })

    it('Выдает 401 при передаче несуществующего (либо некорректного) аксесс-токена', async () => {
        // проверить статус-код и success: false в ответе
    })
})

