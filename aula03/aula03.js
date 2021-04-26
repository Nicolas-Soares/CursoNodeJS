const { mainModule } = require('process')
const util = require('util')
const getUserAsync = util.promisify(getUser)
const getPhoneAsync = util.promisify(getPhone)
const getEndAsync = util.promisify(getEnd)

function getUser(callback) {
        setTimeout(() => {
            return callback(null ,{
                id: Math.random(),
                nome: 'John',
                datanasc: new Date()
            })
        }, 1000)
}

function getPhone(userId, callback) {
    setTimeout(() => {
        return callback(null, {
            numero: '11166638',
            ddd: 51
        })
    }, 2000)
}

function getEnd(userId, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'Rua do Jtinha',
            numero: 1050
        })
    }, 1000)
}



main()
async function main(){
    try {
        console.time('tempo-teste')
        const usuario = getUserAsync()
        const result = await Promise.all([
            getPhoneAsync(usuario.id),
            getEndAsync(usuario.id)
        ])

        const phone = result[0]
        const end = result[1]

        console.log(`
            Nome: ${usuario.nome}
            Telefone: ${phone.ddd} ${phone.numero}
            Endereco: ${end.rua}, ${end.numero}
        `)
        console.timeEnd('tempo-teste')
    } catch (error) {
        console.error('Deu ruim: ', error)
    }
}



/*
main()
async function main(){
    try {
        console.time('medida-promise')
        var usuario = await getUserAsync()
        var result = await Promise.all([
            getPhoneAsync(usuario.id),
            getEndAsync(usuario.id)
        ])
        var telefone = result[0]
        var endereco = result[1]

        console.log(`
        Usuario: ${usuario.nome},
        Telefone: (${telefone.ddd}) ${telefone.numero}
        Endereco: ${endereco.rua}, ${endereco.numero}
        `)
        console.timeEnd('medida-promise')
    } catch (error) {
        console.error('Deu ruim: ', error)
    }
}
*/
