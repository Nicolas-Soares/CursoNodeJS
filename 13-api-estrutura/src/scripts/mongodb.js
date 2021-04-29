//create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

//read
db.herois.find()

//update
db.herois.update({ _id: ObjectId('ehiu12982r3rn28') }, 
                { $set: { name: 'Lanterna Verde' } })

db.herois.update({ poder: 'Velocidade' }, 
                { $set: { poder: 'Super força' } })

//delete
dbb.herois.remove({})
dbb.herois.remove({ nome: 'Mulher maravilha' })