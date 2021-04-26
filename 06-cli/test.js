const { deepEqual, ok } = require('assert')
const database = require('./database')

const DEFAULT_TEST_ITEM = {
    nome: 'Flash',
    poder: 'Speed',
    id: 1
}

const DEFAULT_ITEM_ATUALIZAR = {
    nome: 'Lanterna Verde',
    poder: 'Energia do Anel',
    id: 2
}

describe('Suite de manipulação de herois', () =>{
    before(async () =>{
           await database.cadastrar(DEFAULT_TEST_ITEM)
           await database.cadastrar(DEFAULT_ITEM_ATUALIZAR)
        })
    it('Deve pesquisar um heroi usando arquivos', async () =>{
        const expected = DEFAULT_TEST_ITEM
        const [resultado] = await database.listar(expected.id)
        deepEqual(resultado, expected)
    })
    
    it('Deve remover um heroi por id', async () =>{
        const expected = true
        const resultado = await database.remover(DEFAULT_TEST_ITEM.id)
        deepEqual(resultado, expected)
    })

    it('Deve cadastrar um heroi utilizando arquivos', async () =>{
        const expected = DEFAULT_TEST_ITEM
        await database.cadastrar(DEFAULT_TEST_ITEM)
        const [actual] = await database.listar(DEFAULT_TEST_ITEM.id)
        deepEqual(actual, expected)
    })

    it('Deve atualizar um herois por id', async () => {
        const expected = {
            ...DEFAULT_ITEM_ATUALIZAR,
            nome: 'Batman',
            poder: 'Dinheiro'
        }
        const novoDado = {
            nome: 'Batman',
            poder: 'Dinheiro'
        }
        await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado)
        const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id)
        deepEqual(resultado, expected)
    })
})