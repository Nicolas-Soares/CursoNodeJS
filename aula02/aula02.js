function getUser(resolveruser) {
    setTimeout(() => {
        return resolveruser(null, {
            id: Math.random(),
            nome: 'John',
            datanasc: new Date()
        })
    }, 1000)
}

function getPhone(userId, resolverphone) {
    setTimeout(() => {
        return resolverphone(null, {
            numero: '11166638',
            ddd: 51
        })
    }, 2000)
}

function getEnd(userId, resolverend) {
    setTimeout(() => {
        return resolverend(null, {
            rua: 'Rua do Jtinha',
            numero: 1050
        })
    }, 3000)
}


getUser(function resolverUser(erro, user) {
    if(erro){
        console.error('Deu ruim em USUARIO ', error)
    }

    getPhone(user.id, function resolverphone(erro2, phone) {
        if(erro2){
            console.error('Deu ruim em TELEFONE ', error)
        }

        getEnd(user.id, function resolverend(erro3, endereco) {
            if(erro3){
                console.error('Deu ruim em ENDERECO ', error)
            }

            console.log(`
            Nome: ${user.nome} 
            Endereco: ${endereco.numero}, ${endereco.rua}
            Telefone: (${phone.ddd}) ${phone.numero}
            `)
        })
    })
})
