const { schemaRegister, schemaLogin, schemaActiveAccount,
    schemaExecuteRecoverPassword, schemaConfirmPasswordToEmaill } = require('../schema/user.schema')
const usersController = require('../controllers/users.controller')
const { authenToken, authorizationAdmin, authorizationUser, refreshtoken } = require('../controllers/auth.controller')
const registerOpts = {
    schema: {
        body: schemaRegister
    },
}
const AuthOpts = {
    preHandler: authenToken
}
const loginOpts = {
    schema: {
        body: schemaLogin
    }
}
const activeAccountOpts = {
    schema: {
        body: schemaActiveAccount
    },
    preHandler: [authenToken, authorizationAdmin]

}
const getAllUserOpts = {
    preHandler: [authenToken, authorizationAdmin]
}

const executeRecoverPasswordOpts = {
    schema: {
        params: schemaExecuteRecoverPassword
    },
    preHandler: [authenToken, authorizationUser]

}
const confirmPasswordToEmaillOpts = {
    schema: {
        body: schemaConfirmPasswordToEmaill
    }
}
const changePasswordOpts = {
    schema: {

    },
    preHandler: [authenToken, authorizationUser]

}
const resetPasswordOpts = {
    schema: {

    },
    preHandler: [authenToken, authorizationAdmin]

}
module.exports = (fastify, opts, done) => {
    fastify.get('/auth', AuthOpts, usersController.authenUser)
    fastify.post('/refreshToken', refreshtoken)
    fastify.post('/register', registerOpts, usersController.register)
    fastify.post('/login', loginOpts, usersController.login)
    fastify.put('/active', activeAccountOpts, usersController.activeAccount)
    fastify.get('/', getAllUserOpts, usersController.getAllUser)
    fastify.get('/recover-password/:id/:token', executeRecoverPasswordOpts, usersController.executeRecoverPassword)
    fastify.post('/confirm-password', confirmPasswordToEmaillOpts, usersController.confirmPasswordToEmaill)
    fastify.put('/change-password', changePasswordOpts, usersController.changePassword)
    fastify.put('/reset-password', resetPasswordOpts, usersController.resetPassword)
    done()
}



