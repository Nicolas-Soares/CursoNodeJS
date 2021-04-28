const assert = require('assert')
const MongoDB = require('./../strategies/mongodb')
const context = new MongoDB()

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Bracelete'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super teia'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Velocidade'
}
let MOCK_HEROI_ID = ''

describe('MongoDB Suite de testes', () => {
    before(async () => {
        await context.connect()
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result.id
    })
    it('Verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'
        console.log(result)
        assert.deepEqual(expected, result)
    })

    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('Listar', async () => {
        const [{nome, poder}] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        assert.deepEqual({nome, poder}, MOCK_HEROI_DEFAULT)
    })

    it('Atualizar',  async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })
        assert.deepEqual(result.nModified, 1)
    })

    it('Deletar', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.n, 1)
    })
})