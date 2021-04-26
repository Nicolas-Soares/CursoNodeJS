const service = require('./service')

async function main(){
    try {
        const result = await service.getPeople('a')
        
        const names = result.results.map((personagem) => personagem.name)
        
        for(i in names){
            console.log(`[${i}] ${names[i]}`)
        }
    } catch (error) {
        console.error('Deu ruim: ', error)
    }
}

main()