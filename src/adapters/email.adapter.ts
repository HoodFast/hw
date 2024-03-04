const nodemailer = require('nodemailer')



export const emailAdapter= {


       async sendEmail(email:string, subject:string, message:string) {
            let transporter =  nodemailer.createTransport({
                host: "smtp.mail.ru",
                secure: true,
                port: 465,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                },
                tls: {rejectUnauthorized: false}
            })

            let info = await transporter.sendMail({
                from: 'test <rabota-trassa@mail.ru>',
                to:email,
                subject,
                html: message
            })

           return !!info
        }
    }


