const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const MOCK_SENHA = 'Nick@12345'
const HASH = '$2b$04$NBYTpFT6IHcFRtd50KxMneblAETsJugS1p657JSx7hMIcw.hoklu2'

describe('UserHelper Suite de testes', function () {
    it('Gerar hash a partir de senha', async () => {
        const result = await PasswordHelper.hashPassword(MOCK_SENHA)
        
        assert.ok(result.length > 10)
    })

    it('Compara senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(MOCK_SENHA, HASH)

        assert.ok(result)
    })
})