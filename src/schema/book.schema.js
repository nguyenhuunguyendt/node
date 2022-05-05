const schemaPostBook = {
    type: 'object',
    properties: {
        type: { type: 'string' },
        year: { type: 'integer' },
        author: { type: 'string' },
        quantity: { type: 'integer' },
        name: { type: 'string' },
        image: { type: 'string' },
    },
    required: ["type", "year", "author", "quantity", "name", "image"]
}

const schemaDeleteBook = {
    type: 'object',
    properties: {
        id: { type: "integer" }
    },
    required: ["id"]
}

const schemaGetDetailBook = {
    type: 'object',
    properties: {
        id: { type: "integer" }
    },
    required: ["id"]
}

const schemaUpdateBook = {
    type: 'object',
    properties: {
        id: { type: "integer" },
        type: { type: 'string' },
        year: { type: 'integer' },
        author: { type: 'string' },
        quantity: { type: 'integer' },
        name: { type: 'string' },
        image: { type: 'string' },
    },
    required: ["id", "type", "year", "author", "quantity", "name", "image"]
}

const schemaGetAllBook = {
    type: "object",
    properties: {
        currentPage: { type: "integer", minimum: 0 }
    },
    required: ["currentPage"]
}
const schemaStoreBook = {
    type: "object",
    properties: {
        bookId: { type: "integer", minimum: 1 },
        userId: { type: "integer", minimum: 1 },
        dateBorrow: { type: "integer" },
        dateGive: { type: "integer" },
    },
    required: ["bookId", "userId", "dateBorrow", "dateGive",]
}

const schemaConfirmBook = {
    type: "object",
    properties: {
        id: { type: "integer", minimum: 1 }
    },
    required: ["id"]
}

const schemaHistoryBook = {
    type: "object",
    properties: {
        id: { type: "integer" }
    },
    required: ["id"]
}

const schemaGetStoreBook = {
    type: "object",
    properties: {
        id: { type: "integer" }
    },
    required: ["id"]
}
module.exports = {
    schemaPostBook,
    schemaDeleteBook,
    schemaUpdateBook,
    schemaGetDetailBook,
    schemaGetAllBook,
    schemaStoreBook,
    schemaConfirmBook,
    schemaHistoryBook,
    schemaGetStoreBook
}