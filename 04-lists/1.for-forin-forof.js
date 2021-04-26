const service = require('./service')

async function main(){
    try {
        const result = await service.getPeople('a')
        const names = result.results.map((personagem) =>{
            return personagem.name
        })

        console.log('Nomes: ', names)
    } catch (error) {
        console.error('Erro interno: ', error)
    }
}

main()