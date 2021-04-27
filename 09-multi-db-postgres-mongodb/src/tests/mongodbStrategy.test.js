const assert = require('assert')
const MongoDB = require('./../strategies/mongodb')
const context = new MongoDB()

describe('MongoDB Suite de testes', () => {
    before(async () => {
        await context.connect()
    })
    it('Verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'
        console.log(result)
        assert.deepEqual(expected, result)
    })
})