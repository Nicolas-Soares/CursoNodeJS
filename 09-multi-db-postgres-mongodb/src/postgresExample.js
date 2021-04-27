const Sequelize = require('sequelize')
const driver = new Sequelize(
    'MeusHerois',
    'postgres',
    't3f0x36583625',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)

async function main() {
    const Herois = driver.define('herois', {
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

    await Herois.sync()
    // await Herois.create({
    //     nome: 'Lanterna Verde',
    //     poder: 'Energia do Anel'
    // })
    const result = await Herois.findAll({
        //O raw permite que o resultado retorne apenas os dados da tabela de uma forma resumida e mais limpa
        raw: true,
        attributes: ['nome']
    })
    console.log('Result: ', result)
}

main()