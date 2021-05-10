const assert = require('assert')
const api = require('./../api')
const Postgres = require('../strategies/postgres/postgre')
const UserSchema = require('../strategies/postgres/schemas/userSchema')

let app = {}
const USER = {
    username: 'Nicolas',
    password: '123'
}

const DB_USER = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$tDs5q1cJe9fldW5iC7ZCH.xwaTFXHA.l/oatsISD.EVNQwUMltUGm'
}

describe('Auth Suite de Testes', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres,  UserSchema)
        const postgres = new Postgres(connectionPostgres, model)
        await postgres.update(null, DB_USER, true)
    })

    it('Deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const dados = JSON.parse(result.payload)

        assert.deepStrictEqual(result.statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('Deve retornar nao autorizado ao tentar obter login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'nicolasconterato',
                password: '123'
            }
        })

        const dados = JSON.parse(result.payload)

        assert.deepStrictEqual(result.statusCode, 401)
        assert.deepStrictEqual(dados.error, 'Unauthorized')
    })
})