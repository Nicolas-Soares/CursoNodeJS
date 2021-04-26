const Sequelize = require('sequelize')


class Postgres {
    constructor() {
        this._driver = null
        this._herois = null
    }
    
    async isConnected() {
        try {
            await this._driver.authenticate()
            return true;
        } catch (error) {
            console.error('Fail ', error)
            return false;
        }
    }

    async defineModel() {
        this._herois = this._driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'tb_herois',
            freezeTableName: false,
            timestamps: false
        })
    
        await this._herois.sync()
    }

    async create(item) {
        const { dataValues } = await this._herois.create(item)
        return dataValues
    }

    read(item = {}) {
        return this._herois.findAll({ where: item, raw: true })
        
    }

    async connect() {
        this._driver = new Sequelize(
            'MeusHerois',
            'postgres',
            't3f0x36583625',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: 0
            }
        )
        await this.defineModel()
    }
}

module.exports = Postgres