const assert = require('assert')
const Postgres = require('./../strategies/postgre')
const context = new Postgres()

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'Flechas Mágicas'
}

describe('Postgres Strategy', () => {
    //this.timeout(Infinity)
    before(async () => {
        await context.connect()
    })
    it('PostgreSQL Connection', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('Cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('Listar', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
})
