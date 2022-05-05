const bcrypt = require('bcryptjs');
require('dotenv').config()
const nodemailer = require("nodemailer");

const hashUserpassword = async (password) => {
    try {
        let hashpassword = await bcrypt.hashSync(password);
        return hashpassword
    } catch (error) {
        console.log(error)
    }

}

const sendEmailConfirmPassword = async (data) => {
    let html = ''
    if (data.link) {
        html = `Vui lòng xác nhận tại đường link bên dưới
        <a href=${data.link}>Cick here</a>
         `
    }
    else {
        html = `Mật khẩu reset của bạn là : ${data.randomPass}`
    }
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USE, // generated ethereal user
            pass: process.env.MAIL_APP_PASSWORD, // generated ethereal password
        },
    });
    await transporter.sendMail({
        from: `"Quản lý thứ viện " <${process.env.EMAIL_USE}>`, // sender address
        to: data.email, // list of receivers
        subject: "Xác nhận email reset password", // Subject line
        text: "Hello world?", // plain text body
        html
    })
}


module.exports = {
    hashUserpassword,
    sendEmailConfirmPassword,

}
