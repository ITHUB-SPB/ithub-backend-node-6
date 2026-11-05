import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest'

import { setupServer } from '../src/bootstrap'
import { beforeEach } from 'node:test';


let accessToken: string | undefined;

beforeAll(async () => {
    const app = await setupServer()
    const credentials = { email: 'Supertest2@example.com', password: 'Supertest2' }

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
            .send({ ...credentials, name: 'Supertest2' })
            .set('Accept', 'application/json')
            .then(response => {
                accessToken = response.body.data.access_token
            })
    }
})

// beforeEach(async () => {
//     const app = await setupServer()
//     const server = app.listen()

//     return () => {
//         server.close()
//     }
// })

describe('/GET users', () => {
    it('throws 401 with message if not credentials passed', async () => {
        const app = await setupServer()
        const response = await request(app).get('/users')

        expect(response.statusCode).toBe(401)
    })

    it('returns data and meta with correct credentials', async () => {
        const app = await setupServer()

        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
    })
})
