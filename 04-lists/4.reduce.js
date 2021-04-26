const { getPeople } = require('./service')
Array.prototype.meuReduce = function (callback, valorinicial){
    let valorfinal = typeof valorinicial !== undefined ? valorinicial : this[0]
    for(let i in this){
        valorfinal = callback(valorfinal, this[i])
    }
    return parseInt(valorfinal)
}

async function main(){
    try {
        const {results} = await getPeople('a')

        const peso = results.map(item => parseInt(item.height))
        console.log('pesos: ', peso)

                                   // CALLBACK la de cima 
        const total = peso.meuReduce((anterior, proximo) =>{
            return anterior + proximo
        }, 0)
        
        console.log('total: ', total)
    } catch (error) {
        console.error('Deu ruim: ', error)
    }
}

main()