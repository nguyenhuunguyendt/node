const jwt = require('jsonwebtoken');
const validator = require("email-validator");
const bcrypt = require('bcryptjs');
const pool = require('../config/connectDb')
const utils = require('../utils')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

// đăng ký 

const authenUser = (req, res) => {
    res.statusCode = 200

    res.send({
        statusCode: 200,
        user: req.user
    })
}
const register = async (req, res) => {
    try {
        console.log(req.file)
        console.log(req.body)
        const { userName, password, email } = req.body
        let [result] = await pool.query("SELECT * FROM users WHERE userName = ? ", [userName])
        if (Array.isArray(result) && result.length === 0) {
            /* Kiểm tra địa chỉ email có tồn tại ? nếu tồn tại mới lưu user*/
            if (validator.validate(email)) {
                const hashpassword = await utils.hashUserpassword(password) // hash paswword 
                await pool.query(" INSERT INTO users (userName, password,email)  VALUES (?,?,?)",
                    [userName, hashpassword, email])
                res.statusCode = 200
                res.send({
                    statusCode: res.statusCode,
                    errMesage: "Register success!",
                })
            }
            res.statusCode = 300
            res.send({
                statusCode: res.statusCode,
                errMessage: "Invalid email address "
            })
        } else {
            res.statusCode = 300
            res.send({
                statusCode: res.statusCode,
                errMesage: "User is exist in system"
            })
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}



// đăng nhập và gửi lên token
const login = async (req, res) => {
    console.log(req.body)
    try {
        const { userName, password } = req.body
        const [result] = await pool.query("SELECT * FROM users WHERE userName = ? ", [userName])
        if (Array.isArray(result) && result.length === 0) {
            res.statusCode = 300
            res.send({
                statusCode: res.statusCode,
                errMessage: "passord or username wrong"
            })
        }
        let check = bcrypt.compareSync(password, result[0].password);
        if (check) {
            const user = {
                userName: result[0].userName,
                isAdmin: result[0].isAdmin,
                isActive: result[0].isActive,
                id: result[0].id
            }
            const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s'
            })
            console.log(accesstoken)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            await pool.query('INSERT INTO refeshtoken (value) VALUES (?)', [refreshToken])
            delete result[0]["password"]

            res.send({
                statusCode: res.statusCode,
                accesstoken,
                refreshToken,
                user: result[0]
            })
        } else {
            res.statusCode = 300
            res.send({
                statusCode: res.statusCode,
                errMessage: "password or username wrong"
            })
        }
    } catch (error) {

        throw error
    }

}
// đăng xuất
const logout = (req, res) => {

}

// lấy tất cả user
const getAllUser = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE isAdmin = false')
        res.statusCode = 200
        users.forEach((user, index, arr) => {
            delete user["password"]
        })
        res.send({
            statusCode: res.statusCode,
            users,
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

// active tài khoản
const activeAccount = async (req, res) => {
    try {
        const { id } = req.body
        const [result] = await pool.query('UPDATE users SET isActive = true WHERE id = ?', [id])
        res.statusCode = 200
        res.send({
            statusCode: 200,
            result
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}


// reset password trên link Email
const executeRecoverPassword = async (req, res) => {
    try {
        const { id, token } = req.params
        const [data] = await pool.query('SELECT * FROM users Where id = ? AND token = ? ', [id, token])
        if (data.length > 0) {
            const randomPass = Math.round(Math.random() * 1000000) + ''
            const hashpassword = await utils.hashUserpassword(randomPass)
            await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashpassword, id])
            await utils.sendEmailConfirmPassword({
                email: data[0].email,
                randomPass
            })
            await pool.query('UPDATE users SET token = ? WHERE id = ? ', [null, id])
            res.statusCode = 200
            res.send({
                statusCode: res.statusCode,
                errMesage: "sent new Password to your email !"
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}
// gửi link đến email xác nhận
const confirmPasswordToEmaill = async (req, res) => {
    try {
        const { userName } = req.body
        const [data] = await pool.query('SELECT * FROM users WHERE userName = ? LIMIT 1', [userName])
        if (data.length > 0 && data[0]) {
            const token = uuidv4()
            const link = `http://localhost:9999/api/user/recover-password/${data[0].id}/${token}`
            await pool.query('UPDATE users SET token = ? WHERE id = ? ', [token, data[0].id])
            await utils.sendEmailConfirmPassword({
                email: data[0].email,
                link
            })
            res.statusCode = 200
            res.send({
                statusCode: res.statusCode,
                errMesage: "success !"
            })
        } else {
            res.statusCode = 400
            res.send({
                statusCode: res.statusCode,
                errMesage: "User is not exist "
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const changePassword = async (req, res) => {
    try {
        console.log(req.body)
        const { id, passwordOld, passwordNew } = req.body
        const [users] = await pool.query("SELECT * FROM users WHERE id = ? ", [id])
        if (users.length > 0) {
            let check = bcrypt.compareSync(passwordOld, users[0].password);
            if (check) {
                const hashpassword = await utils.hashUserpassword(passwordNew)
                let data = await pool.query(" UPDATE users SET password = ? WHERE id = ?", [hashpassword, id])
                res.statusCode = 200
                res.send({
                    statusCode: res.statusCode,
                    data
                })
            } else {
                res.statusCode = 300,
                    res.send({
                        statusCode: res.statusCode,
                        errMesage: "Password is wrong"
                    })
            }
        } else {
            res.statusCode = 300
            res.send({
                statusCode: res.statusCode,
                errMesage: "User is not exist"
            })
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}

const resetPassword = async (req, res) => {
    try {
        const { newPassword, id } = req.body
        const data = await pool.query('UPDATE users SET password = ? WHERE ID = ?', [newPassword, id])
        res.statusCode = 200
        res.send({
            statusCode: res.statusCode,
            data
        })
    } catch (error) {
        throw error
    }

}

module.exports = {
    register,
    login,
    logout,
    getAllUser,
    activeAccount,
    executeRecoverPassword,
    confirmPasswordToEmaill,
    changePassword,
    resetPassword,
    authenUser
}