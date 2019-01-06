function getUserInfos(req) {
    const user = {
        agent: req.header('user-agent'), // User Agent we get from headers
        referrer: req.header('referrer'), //  Likewise for referrer
        ip: req.header('x-forwarded-for') || req.connection.remoteAddress //, // Get IP - allow for proxy
    }
    return JSON.stringify(user, null, 2)
}
module.exports = function (req) {
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
        html: getUserInfos(req) // plain text body
    }
    transporter.sendMail(mailOptions, function (err, info) {
    if(err)
        console.log(err)
    else
        console.log(info)
    })
}