module.exports = (fastify, opts, done) => {
    fastify.register(require('./books.router'), { prefix: '/book' })
    fastify.register(require('./users.router'), { prefix: '/user' })
    done()
}
