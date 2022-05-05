const pool = require("../config/connectDb")
// lấy chi tiết sách
const getDetailBook = async (req, res) => {
    try {
        console.log(req.params)
        const [data] = await pool.query("SELECT * FROM books WHERE id = ? ", [req.params.id])
        res.statusCode = 200
        res.send({
            statusCode: res.statusCode,
            data
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

//nếu có query lấy theo LIKE còn không lấy tất cả (20 bản 1 trang )
const getAllBooks = async (req, res) => {
    try {
        console.log("params : ", req.params)
        console.log("query :", req.query)
        const { currentPage } = req.params
        const keyWord = Object.keys(req.query)
        const numberPages = 20
        const skip = numberPages * currentPage
        let queryString = ""
        let valuesQuery = []
        if (Object.keys(req.query).length !== 0) {
            queryString = `SELECT * FROM books WHERE ${keyWord[0]} LIKE ?  OR ${keyWord[0]} LIKE ? LIMIT ?,?`
            valuesQuery = [`%${req.query[keyWord[0]]}%`, `%${req.query[keyWord[0]]}%`, skip, numberPages]
        } else {
            queryString = "SELECT * FROM books LIMIT  ?,? "
            valuesQuery = [skip, numberPages]
        }
        const [books] = await pool.query(queryString, valuesQuery)

        const [total] = await pool.query('SELECT COUNT(id) as total FROM books')
        res.statusCode = 200
        books.map(item => {
            item.image = Buffer.from(item.image, 'base64').toString('binary')
            return item
        })
        res.send({
            statusCode: res.statusCode,
            page: currentPage + 1,
            totalPage: Math.ceil(total[0].total / numberPages),
            books
        })
    } catch (error) {
        console.log(error)
        throw error
    }

}
// thêm  sách  (role Admin)
const createBook = async (req, res) => {
    try {
        console.log(req.body)
        const { name, image, author, quantity, type, year } = req.body
        const [data] = await pool.query(
            'INSERT INTO books (year,type,author,quantity,name,image) VALUES(?,?,?,?,?,?)',
            [year, type, author, quantity, name, image]
        )
        res.statusCode = 200,
            res.send({
                statusCode: res.statusCode,
                data
            })

    } catch (error) {
        console.log(error)
        throw error
    }


}
// xóa sách (role Admin)
const deleteBook = async (req, res) => {
    try {

        console.log(req.body)
        const { id } = req.body
        const [data] = await pool.query('DELETE FROM books WHERE id= ? ', [id])
        res.statusCode = 200
        res.send({
            statusCode: res.statusCode,
            data
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}
// cập nhật sách  (role Admin) 
const updateBook = async (req, res) => {
    try {
        console.log(req.body)
        const { id, name, image, author, quantity, type, year } = req.body
        const [data] = await pool.query('UPDATE books SET name = ?, image = ? , author = ? , quantity = ? , type = ? , year = ? WHERE id = ?',
            [name, image, author, quantity, type, year, id])
        res.statusCode = 200
        res.send({
            statusCode: res.statusCode,
            data
        }
        )
    } catch (error) {
        console.log(error)
        throw error
    }
}
/*lưu vào bảng store biểu hiện tình trạng sách đang mượn*/
const storeBook = async (req, res) => {
    try {
        console.log(req.body)
        const { id, bookId, dateBorrow, dateGive, } = req.body
        const [data] = await pool.query(
            "INSERT INTO stores(userId,bookId,dateBorrow,dateGive) VALUES(?,?,?,?)",
            [id, bookId, dateBorrow, dateGive])
        res.statusCode = 200
        res.send({
            statusCode: res.statusCode,
            data
        })

    } catch (error) {
        console.log(error)
        throw error
    }
}
// xác nhận mượn sách 
const confirmBook = async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.body
        const [data] = await pool.query("UPDATE stores SET isConfirmed = true WHERE id = ?", [id])
        res.statusCode = 200
        res.send({
            statusCode: res.statusCode,
            data
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}
// xóa sách trong bảng store và lưu sách đó vào bảng history  (role Admin)
const createHistoryBook = async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.body
        const queryString = `INSERT INTO histories (userId,bookId,dateBorrow,dateGive)
              SELECT userId,bookId,dateBorrow,dateGive 
              FROM stores 
              WHERE id = ? ;
         DELETE FROM stores
              WHERE id = ?`
        const [data] = await pool.query(queryString, [id, id])
        res.statusCode = 300
        res.send({
            statusCode: res.statusCode,
            data: data[0]
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}



const getStoreBook = async (req, res) => {
    try {
        const { id } = req.params
        const [data] = await pool.query(`SELECT *
        FROM users
        INNER JOIN stores 
        ON users.id =stores.userId 
        LEFT JOIN books
        ON stores.bookId = books.id
        WHERE stores.userId = ? AND isConfirmed = true
        `, [id])
        console.log(data)
        res.statusCode = 200
        res.send({
            statusCode: res.statusCode,
            data
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

const getHistory = async (req, res) => {
    try {
        const { id } = req.params.id
        const [data] = await pool.query(`SELECT * FROM histories WHERE userId = ? `, [id])
        res.statusCode = 200
        res.send({
            errMessage: res.statusCode,
            data
        })
    } catch (error) {
        console.log(error)
        throw error
    }

}
module.exports = {
    getAllBooks,
    createBook,
    deleteBook,
    updateBook,
    getDetailBook,
    storeBook,
    confirmBook,
    createHistoryBook,
    getStoreBook,
    getHistory
}