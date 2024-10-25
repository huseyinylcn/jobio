const nodemailer = require("nodemailer")


const mail_verify = (mail,verify_code)=>{
    return new Promise((resolve,reject)=>{
        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'arezmiacademy@gmail.com',
                pass:'tzenbxdkmoiweecn'
            }
        })
        
        let mailOptions = {
            from:'arezmiacademy@gmail.com',
            to:`${mail}`,
            subject:`Verification`,
            html:`<h3>Mail Adresinizi Doğrulayın</h3><p>Doğrulama Kodunuz <b>${verify_code}</b></p>`
        }
        transporter.sendMail(mailOptions,(err,data)=>{
            if(err){
                console.log(err)
                reject({code:"0x107",mess:"email adresine doğrulama kodu gönderilemedi"})
            }else{
                resolve({code:"0x202",mess:"email adresine doğrulama kodu gönderildi"})
            }
        })
    })
}

module.exports = {mail_verify}