const assert = require('assert')
const Postgres = require('./../strategies/postgres/postgre')
const HeroiSchema = require('../strategies/postgres/schemas/heroisSchema')


const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'Flechas Mágicas'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}
let context = {}

describe('Postgres Strategy', () => {
    //this.timeout(Infinity)
    before(async () => {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema)
        context = new Postgres(connection, model)

        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
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

    it('Atualizar', async () => {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha',
            poder: 'Bracelete'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id })
        assert.deepEqual(result, 1)
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
        assert.deepEqual(itemAtualizado.poder, novoItem.poder)
    })

    it('Remover por ID', async () => {
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)
    })
})
