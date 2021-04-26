const Commander = require('commander')
const Database = require('./database')
const Heroi = require('./heroi')

async function main() {
    Commander
        .version('v1')
        .option('-n, --nome [value]', "Nome do heroi")
        .option('-p, --poder [value]', "Poder do heroi")
        .option('-c, --cadastrar', "Cadastrar um heroi")
        .option('-ls, --listar', "Listar os herois")
        .option('-rem, --remover [value]', "Remover um heroi pelo id")
        .option('-att, --atualizar [value]', "Atualizar um heroi pelo id")
        .parse(process.argv)

        const options = Commander.opts()
        const heroi = new Heroi(options)
    try {
        if(options.cadastrar){
            const resultado = await Database.cadastrar(heroi)
            if (!resultado) {
                console.error('Heroi nao foi cadastrado!')
                return;
            }
            console.log('Heroi cadastrado com sucesso')
            console.log(heroi)
        }

        if (options.listar) {
            const resultado = await Database.listar()
            console.log(resultado)
            return;
        }

        if (options.remover) {
            const resultado = await Database.remover(parseInt(options.remover))
            if (!resultado) {
                console.error('Nao foi possivel remover o heroi')
                return
            }
            console.log('Heroi removido com sucesso!')
        }

        if (options.atualizar) {
            const idAtt = parseInt(options.atualizar)
            const dado = JSON.stringify(heroi)
            const heroiAtt = JSON.parse(dado)
            const resultado = await Database.atualizar(idAtt, heroiAtt)
            if (!resultado) {
                console.error('Nao foi possivel atualizar o heroi')
                return;
            }
            console.log('Heroi atualizado com sucesso!')
        }
    } catch (error) {
        console.error('Deu ruim: ', error)
    }
}

main()