const Hapi = require('hapi')
const MongoDB = require('./strategies/mongodb/mongodb')
const HeroiSchema = require('./strategies/mongodb/schemas/heroisSchema')

const app = new Hapi.Server({
    port: 5000
})

async function main(){
    try {
        const connection = MongoDB.connect()
        const context = new MongoDB(connection, HeroiSchema)

        app.route([{
            path: '/herois',
            method: 'GET',
            handler: (request, response) => {
                return context.read()
            }
        }])

        await app.start()
        console.log('Servidor rodando na porta ', app.info.port)
    } catch (error) {
        console.error('Erro: ', error)
    }
}

main()