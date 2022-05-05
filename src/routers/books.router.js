const booksController = require('../controllers/books.controller')
const { schemaPostBook, schemaDeleteBook, schemaUpdateBook,
    schemaGetDetailBook, schemaGetAllBook, schemaStoreBook,
    schemaGetStoreBook, schemaConfirmBook, schemaHistoryBook
} = require('../schema/book.schema')
const { authenToken, authorizationUser, authorizationAdmin } = require('../controllers/auth.controller')


const bookPostOpts = {
    schema: {
        body: schemaPostBook
    },
    preHandler: [authenToken, authorizationAdmin]
}
const bookDelelteOpts = {
    schema: {
        body: schemaDeleteBook
    },
    preHandler: [authenToken, authorizationAdmin]
}

const bookUpdateOpts = {
    schema: {
        body: schemaUpdateBook
    },
    preHandler: [authenToken, authorizationAdmin]
}
const bookGetDetailOpts = {
    schema: {
        params: schemaGetDetailBook
    },
    preHandler: [authenToken]
}
const bookGetAllOpts = {
    schema: {
        params: schemaGetAllBook
    },
    preHandler: [authenToken]
}
const bookStoreOpts = {
    schema: {
        body: schemaStoreBook
    },
    preHandler: [authenToken, authorizationUser]

}
const getStoreBookOpts = {
    schema: {
        params: schemaGetStoreBook
    },
    preHandler: [authenToken, authorizationUser]
}
const confirmBookOpts = {
    schema: {
        body: schemaConfirmBook
    },
    preHandler: [authenToken, authorizationUser]
}
const historyBookOpts = {
    schema: {
        body: schemaHistoryBook
    },
    preHandler: [authenToken, authorizationAdmin]
}
module.exports = (fastify, opts, done) => {
    fastify.post('/create', bookPostOpts, booksController.createBook)
    fastify.delete('/delete', bookDelelteOpts, booksController.deleteBook)
    fastify.put('/update', bookUpdateOpts, booksController.updateBook)
    fastify.get('/:id', bookGetDetailOpts, booksController.getDetailBook)
    fastify.get('/page/:currentPage', bookGetAllOpts, booksController.getAllBooks)
    fastify.post('/store', bookStoreOpts, booksController.storeBook)
    fastify.get('/store/:id', getStoreBookOpts, booksController.getStoreBook)
    fastify.get('/history/:id', booksController.getHistory)
    fastify.post('/confirm', confirmBookOpts, booksController.confirmBook)
    fastify.post('/history', historyBookOpts, booksController.createHistoryBook)

    // fastify.get('/', bookGetOpts, booksController.getDetailBook)

    done()
}

