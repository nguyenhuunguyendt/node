const schemaRegister = {
    type: 'object',
    properties: {
        userName: { type: 'string', maxLength: 100 },
        password: { type: 'string' },
        email: { type: "string", format: "email" }
    },
    required: ["userName", "password", "email"]
}

const schemaLogin = {
    type: 'object',
    properties: {
        userName: { type: 'string', maxLength: 100 },
        password: { type: 'string' },
    },
    required: ["userName", "password",]

}

const schemaActiveAccount = {
    type: "object",
    properties: {
        id: { type: "integer" }
    },
    required: ["id"]
}

const schemaExecuteRecoverPassword = {
    type: "object",
    properties: {
        id: { type: "integer" },
        token: { type: "string" }
    },
    required: ["id", "token"]
}

const schemaConfirmPasswordToEmaill = {
    type: "object",
    properties: {
        userName: { type: "string" }
    },
    required: ["userName"]
}

module.exports = {
    schemaRegister,
    schemaLogin,
    schemaActiveAccount,
    schemaExecuteRecoverPassword,
    schemaConfirmPasswordToEmaill
}