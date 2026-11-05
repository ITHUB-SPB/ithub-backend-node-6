import request from 'supertest'

import { setupServer } from '../src/bootstrap.js'

const app = await setupServer()

request(app)
    .get('/users')