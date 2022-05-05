const jwt = require('jsonwebtoken');
const pool = require("../config/connectDb")
const authenToken = (req, res, done) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            if (!token) {
                res.statusCode = 401
                res.send({
                    statusCode: res.statusCode
                })
            }
            console.log(token, 'aaa')
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.statusCode = 403
                    res.send({
                        statusCode: res.statusCode,
                        errMessage: "You cant not access to content"
                    })
                }
                req.user = data
                done()
            });
        } else {
            res.statusCode = 403
            res.send({
                statusCode: res.statusCode,
                errMessage: " You cant not access to content"
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const authorizationUser = (req, res, done) => {
    try {
        if (req.params && req.user.id === req.params.id && req.user.isActive || req.body && req.user.id === req.body.id && req.user.isActive || req.user.isAdmin) {
            done()
        } else {
            res.statusCode = 403
            res.send({
                statusCode: res.statusCode,
                errMessage: "You can not access to content"
            })
        }
    } catch (error) {
        throw error
    }
}

const authorizationAdmin = (req, res, done) => {
    try {
        if (req.user.isAdmin) {
            done()
        } else {
            res.statusCode = 403
            res.send({
                statusCode: res.statusCode,
                errMessage: "You can not access to content"
            })
        }
    } catch (error) {
        throw error
    }
}

const refreshtoken = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        res.statusCode = 401
        res.send({ statusCode: res.statusCode });
    }
    let [result] = await pool.query('Select * from refeshtoken where value = ?', [refreshToken])
    if (result.length = 0) {
        res.statusCode = 403
        res.send({
            statusCode: res.statusCode,
            errMessage: "you can not access to content"
        })
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) {
            res.statusCode = 403
            res.send({
                statusCode: res.statusCode,
                errMessage: "you can not access to content"
            })
        };
        const accessToken = jwt.sign(
            {
                userName: data.userName,
                isAdmin: data.isAdmin,
                id: data.id,
                isActive: data.isActive
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s', });
        res.send({ accessToken });
    });

}

module.exports = {
    authenToken,
    refreshtoken,
    authorizationUser,
    authorizationAdmin
}