const assert = require('assert')
const api = require('./../api')

let app = {}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Gaviao Negro',
    poder: 'Mira de ferro'
}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY29sYXMiLCJpZCI6MSwiaWF0IjoxNjIwNDE3MzU1fQ.z6KqfAwif8sLXC6rAmfEt3ePvEA6xUu2qnIcKWocLlA'
const headers = {
    Authorization: TOKEN
}

let MOCK_ID = ''

describe('Suite de testes na API Heroes', function () {
    this.beforeAll(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })

        const dados = JSON.parse(result.payload)

        MOCK_ID = dados._id
    })

    it('Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar /herois - deve  retornar somente 10 registros', async () => {
        const tamanho_limit = 3
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${tamanho_limit}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === tamanho_limit)
    })

    it('Listar /herois - deve retornar um erro com LIMIT incorreto', async () => {
        const tamanho_limit = 'AEE'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${tamanho_limit}`
        })

        const errorResult = {
            "statusCode": 400, 
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"] 
            } 
        }

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })

    it('Listar /herois - deve  filtrar um item', async () => {
        const NAME = MOCK_HEROI_INICIAL.nome
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, NAME)
    })

    it('Cadastrar POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: MOCK_HEROI_CADASTRAR
        })

        const { message, _id } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi cadastrado com sucesso!')
    })

    it('Atualizar PATCH - /herois/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })

        const dados = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')
    })

    it('Atualizar PATCH - /herois/:id - Não deve atualizar com ID incorreto', async () => {
        const _id = `608aac6040b8503274584267`
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })

        const dados = JSON.parse(result.payload)
        const esperado = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID nao encontrado no banco!'
        }

        assert.ok(result.statusCode === 412)
        assert.deepEqual(dados, esperado)
    })

    it('Deletar DELETE - /herois/:id', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })
        const dados = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi removido com sucesso!')
    })

    it('Deletar DELETE - /herois/:id - Não deve remover', async () => {
        const _id = '608aac6040b8503274584267'
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })
        const dados = JSON.parse(result.payload)
        const esperado = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID nao encontrado no banco!'
        }

        assert.ok(result.statusCode === 412)
        assert.deepEqual(dados, esperado)
    })

    it('Deletar DELETE - /herois/:id - Não deve remover com ID inválido', async () => {
        const _id = 'ID_INVALIDO'
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })
        const dados = JSON.parse(result.payload)
        const esperado = {
            error: 'Internal Server Error',
            message: 'An internal server error occurred',
            statusCode: 500
        }

        assert.ok(result.statusCode === 500)
        assert.deepEqual(dados, esperado)
    })
})