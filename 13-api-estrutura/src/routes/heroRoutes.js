const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const { required } = require('joi')

const failAction = (request, headers, erro) => {
    throw erro
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Deve listar os herois',
                notes: 'Pode paginar resultados e filtrar por nome',
                validate: {
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers,
                }
            },

            handler: (request, headers) => {
                try {
                    const {
                        skip, limit, nome
                    } = request.query

                    const query = {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    }


                    return this.db.read(nome ? query : {}, skip, limit)
                } catch (error) {
                    console.log('Deu ruim: ', error)
                    return Boom.internal()
                }

            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar um heroi',
                notes: 'Deve cadastrar um heroi por nome e poder',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(50)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({
                        nome, poder
                    })

                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    }
                } catch (error) {
                    console.error('Erro: ', error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar um heroi por ID',
                notes: 'Pode atualizar qualquer campo',
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(50)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) return Boom.preconditionFailed('ID nao encontrado no banco!')

                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }
                } catch (error) {
                    console.error('Erro: ', error)
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve remover o heroi por ID',
                notes: 'O ID tem que ser valido',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params
                    const result = await this.db.delete(id)

                    if (result.n !== 1) return Boom.preconditionFailed('ID nao encontrado no banco!')
                        
                    return {
                        message: 'Heroi removido com sucesso!'
                    }
                } catch (error) {
                    console.error('Erro: ', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes