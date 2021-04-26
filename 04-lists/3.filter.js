const { getPeople } = require('./service')
Array.prototype.meuFilter = function (callback){
    const lista = []
    for(i in this){
        const item = this[i]
        const result = callback(item, i, this)

        if(!result) continue;
            lista.push(item)
    }
    return lista
}


async function main() {
    try {
        const { results } = await getPeople('a')
        /* 
        const familiaLars = results.filter((personagem) => {
            const result = personagem.name.toLowerCase().indexOf('lars') !== -1
            return result
        })
        */
                                          // CALLBACK la de cima
       const familiaLars = results.meuFilter((item, i, lista) => {
            console.log(`index: ${i}`, lista.length)
            return item.name.toLowerCase().indexOf('lars') !== -1
       })
        const names = familiaLars.map((personagem) => personagem.name)
        console.log(names)
    } catch (error) {
        console.error('Deu ruim: ', error)
    }
}
main()