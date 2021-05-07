const assert = require('assert')
const api = require('./../api')

let app = {}

describe('Auth Suite de Testes', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('Deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'Nicolas',
                password: '123'
            }
        })

        const dados = JSON.parse(result.payload)

        assert.deepStrictEqual(result.statusCode, 200)
        assert.ok(dados.token.length > 10)
    })
})