const Hapi = require('hapi')
const MongoDB = require('./strategies/mongodb/mongodb')
const HeroRoute = require('./routes/heroRoutes')
const HeroiSchema = require('./strategies/mongodb/schemas/heroisSchema')
const { methods } = require('./routes/heroRoutes')
const HSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const { version } = require('joi')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main(){
    try {
        const connection = MongoDB.connect()
        const context = new MongoDB(connection, HeroiSchema)
        const swaggerOptions = {
            info: {
                title: 'API Herois - #CursoNodeBR - By: Nicolas Conterato Soares',
                version: 'v1.0'
            },
        }

        await app.register([
            Vision,
            Inert,
            {
                plugin: HSwagger,
                options: swaggerOptions
            }
        ])

        app.route(
            mapRoutes(new HeroRoute(context), HeroRoute.methods())
        )

        await app.start()
        console.log('Servidor rodando na porta ', app.info.port)

        return app
    } catch (error) {
        console.error('Erro: ', error)
    }
}

module.exports = main()