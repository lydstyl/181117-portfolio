module.exports = function () {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'lydstyl@gmail.com',
               pass: 'lgszkzmlhqwnbblj'
        }
    })
    const mailOptions = {
        from: 'lydstyl@gmail.com', // sender address
        to: 'lydstyl@gmail.com', // list of receivers
        subject: 'Connexion au portfolio', // Subject line
        html: '<p>Mon message HTML : cool peut être un recruteur ?</p>'// plain text body
    }
    transporter.sendMail(mailOptions, function (err, info) {
    if(err)
        console.log(err)
    else
        console.log(info)
    })
}
