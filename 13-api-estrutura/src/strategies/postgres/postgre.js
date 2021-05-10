const Sequelize = require('sequelize')


class Postgres {
    constructor(connection, schema) {
        this._connection = connection
        this._schema = schema
    }
    
    async isConnected() {
        try {
            await this._connection.authenticate()
            return true;
        } catch (error) {
            console.error('Fail ', error)
            return false;
        }
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        await model.sync()
        return model
    }

    async create(item) {
        const { dataValues } = await this._schema.create(item)
        return dataValues
    }

    read(item = {}) {
        return this._schema.findAll({ where: item, raw: true })
    }

    async update(idItemAtualizar, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'

        return await this._schema[fn](item, { where: {id : idItemAtualizar} })
    }

    async delete(id) {
        const query = id ? { id } : {}
        return this._schema.destroy({ where: query })
    }

    static async connect() {
        const connection = new Sequelize(
            'MeusHerois',
            'postgres',
            't3f0x36583625',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: 0,
                logging: false
            }
        )
        return connection
    }
}

module.exports = Postgres