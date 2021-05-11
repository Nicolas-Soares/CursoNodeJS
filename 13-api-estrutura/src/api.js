const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || 'dev'
ok(env === 'prod' || env === 'dev', 'A env é invalida, ou dev ou prod')

const configPath = join(__dirname, '../config', `.env.${env}`)

config({
    path: configPath
})

const Hapi = require('hapi')
const MongoDB = require('./strategies/mongodb/mongodb')
const Postgres = require('./strategies/postgres/postgre')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')
const HeroiSchema = require('./strategies/mongodb/schemas/heroisSchema')
const UserSchema = require('./strategies/postgres/schemas/userSchema')
const { methods } = require('./routes/heroRoutes')

const JWT_SECRET = process.env.JWT_KEY

const HapiJwt = require('hapi-auth-jwt2')
const HSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const { version } = require('joi')

const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    try {
        const connection = MongoDB.connect()
        const context = new MongoDB(connection, HeroiSchema)

        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UserSchema)
        const contextPostgres = new Postgres(connectionPostgres, model)

        const swaggerOptions = {
            info: {
                title: 'API Herois - #CursoNodeBR - By: Nicolas Conterato Soares',
                version: 'v1.0'
            },
        }

        await app.register([
            HapiJwt,
            Vision,
            Inert,
            {
                plugin: HSwagger,
                options: swaggerOptions
            }
        ])

        app.auth.strategy('jwt', 'jwt', {
            key: JWT_SECRET,
            validate: async (dado, request) => {
                const [result] = await contextPostgres.read({
                    username: dado.username.toLowerCase()
                })

                if (!result) {
                    return {
                        isValid: false
                    }
                }

                return {
                    isValid: true
                }
            }
        })
        app.auth.default('jwt')

        app.route([
            ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
            ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods())
        ])

        await app.start()
        console.log('Servidor rodando na porta ', app.info.port)

        return app
    } catch (error) {
        console.error('Erro: ', error)
    }
}

module.exports = main()