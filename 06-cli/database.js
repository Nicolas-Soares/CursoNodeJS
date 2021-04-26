const {
    readFile,
    writeFile
} = require('fs')
const {
    promisify
} = require('util')
//Para pegar dados de um arquivo json é so fazer o require do arquivo json
//Esse exemplo é só uma maneira de pegar os dados caso seja soutro tipo de arquivo
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

class Database {
    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }
    async getDadosArquivo(){
        const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8')
        return JSON.parse(arquivo.toString())
    }
    async escreverArquivo(dados){
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados))
        return true
    }
    async cadastrar(heroi){
        const dados = await this.getDadosArquivo()
        const id = heroi.id <= 2 ? heroi.id : Date.now()
        const heroiComId = {
            ...heroi,
            id
        }
        
        return await this.escreverArquivo([...dados, heroiComId])
    }
    async listar(id){
        const dados = await this.getDadosArquivo()
        const dadosFiltrados = dados.filter(item => (id ? (item.id === id) : true))
        return dadosFiltrados
    }
    async remover(id){
        if(!id){
            await this.escreverArquivo([])
            return true
        }
        
        const dados = await this.getDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))
        if(indice === -1){
            throw Error('O usuario informado nao existe')
        }
        dados.splice(indice, 1)
        await this.escreverArquivo(dados)
        return true
    }
    async atualizar(id, modification){
        const dados = await this.getDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))
        if(indice === -1){
            throw Error('O heroi informado nao existe')
        }
        const atual = dados[indice]
        const objetoAtualizado = {
            ...atual,
            ...modification
        }
        dados.splice(indice, 1)

        return await this.escreverArquivo([
            ...dados,
            objetoAtualizado
        ])
    }
}

module.exports = new Database()