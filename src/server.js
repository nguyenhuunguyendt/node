const fastify = require('fastify')(/*{ logger: true }*/)
require('dotenv').config()
const PORT = process.env.PORT





fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["POST", "PUT", "GET", "DELETE"]
});


fastify.register(require('@fastify/cookie'), {
  secret: "my-secret", // for cookies signature
  parseOptions: {}     // options for parsing cookies
})

fastify.register(require('./routers'), { prefix: '/api' })


const startServer = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
}
startServer()