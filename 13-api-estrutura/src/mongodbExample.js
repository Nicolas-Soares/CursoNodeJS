const Mongoose = require('mongoose')

Mongoose.connect('mongodb://localhost:27017/herois', { useNewUrlParser: true , useUnifiedTopology: true}, function (error) {
    if (!error) return console.log('Conectado!');
    console.log('Falha na conexão: ', error)
})

const connection = Mongoose.connection

connection.once('open', () => console.log('Database rodando!'))

// setTimeout(() => {
//     const state = connection.readyState
//     console.log('state: ', state)
// }, 1000);

const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

const model = Mongoose.model('heroi', heroiSchema)

async function main(){
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })
    console.log('resultado: ', resultCadastrar)

    const listItems = await model.find()
    console.log('items: ', listItems)
}

main()