const EventEmmitter = require('events')
class Emissor extends EventEmmitter {

}
const meuEmissor = new Emissor()
const clicar = 'user:click'

meuEmissor.on(clicar, function(click){
    console.log('O usuario clicou', click)
})

const stdin = process.openStdin()

function main (){
    
}

stdin.addListener('data', function(value){
    console.log(`Voce digitou: ${value.toString().trim()}`)
})