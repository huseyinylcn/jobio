const router = require("express").Router()
const crypto = require("crypto");
const {mail_verify}= require("../Models/verification-process");
const {user_db_get, user_db_login, user_db_sigin, user_db_sigin_control} = require("../Models/user-db-process");


const generate_code = ()=>{
    return Math.floor(Math.random() * 9000) + 1000; 
}


let generate_code_global;
let user_sigin_info_global;
let user_sigin_time = true




router.post("/signin",(req,res,next)=>{
    try {
        
        const  { fullname, birth, username, password, contact} = req.body
        user_db_sigin_control(username,contact).then(response=>{
  
            if(response.code == "0x117") return res.json({code:"0x117",mess:"kullanıcı adı ve mail/telefon daha önce kullanılmış"})
            else if(response.code == "0x118") return res.json({code:"0x118",mess:"kullanıcı adı daha önce kullanılmış"})
            else if(response.code == "0x119") return res.json({code:"0x118",mess:"mail/telefon daha önce kullanılmış"})
        else next()
        })
  
       
    } catch (error) {
       return res.json({code:"0x105",mess:"Sigin ilk fonksiyon hata verdi Genel Hata",error})
    }
})

router.post("/sigin",(req,res)=>{
    try {
        const  { fullname, birth, username, password, contact} = req.body
        const date_format = /^\d{4}\.\d{2}\.\d{2}$/
        const fullname_format = /[?*\/+\-.\^#1234567890_!]/
        const username_format = /[?*\/+\-\^]/
        if(!date_format.test(birth)) return res.json({code:"0x101",mess:"Tarih Formatı Hatalı Olması gerek format '2024.05.12' "})
            if(fullname_format.test(fullname)) return res.json({code:"0x102",mess:"İsim Formatı Yanlış İçerisinde istenmeyen karakter Var"})
            if(username_format.test(username)) return res.json({code:"0x103",mess:"Kullanıcı adı formatı yanlış içerisinde istenmeyen karakter var"})
            if(password.length < 8) return res.json({code:"0x104",mess:"Şifreniz 8 karekterden kısa olmasın"}) 
            next()
    } catch (error) {
        
    }
})


router.post("/signin",(req,res,next)=>{
    try {
        generate_code_global = generate_code()
        const create_user_id = crypto.randomBytes(10).toString("hex")
        req.body.id = create_user_id
        user_sigin_info_global = req.body
        const what_concat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.contact)
        const what_concat_phone = /^[+]?[(]?[0-9]{1,4}[)]?[-\s0-9]*$/.test(req.body.contact)
        if(what_concat) {
            mail_verify(req.body.contact,generate_code_global).then(response=>{
                if(response.code = "0x202"){
                    setTimeout(() => {
                        console.log("zaman aşımına uğradı!!!")
                        user_sigin_time = false
                    }, 120000);
                  
                    res.json({code:"0x202",mess:"successfull"})
                    //kayıt işlemi gerçekleşir
                }else{
                    res.json({code:"0x107",mess:"email adresine doğrulama kodu gönderilemedi"})
                }
            })
        }
        else if(what_concat_phone) console.log("bu bir telefon numarası")
        else return res.json({code:"0x106",mess:"girilen telefon veya email arızalı "})
        
    } catch (error) {
        return res.json({code:"0x105",mess:"Sigin 2. fonksiyon hata verdi Genel Hata",error})
    }

})




router.post("/signin/verification",(req,res,next)=>{
  
   try {
        if(!user_sigin_time) return res.json({code:"0x109",mess:"mail doğrulama kodu zaman aşımına uğradı"})

        if(generate_code_global == req.body.code){
            
            user_db_sigin(user_sigin_info_global).then(response=>{
                if (response.code == "0x202"){
                    res.json({code:"0x202",mess:"successfull"})
                }
            }).catch(err=>{
                res.json({code:"0x107",mess:"sql kayıt hatası"})
            })
        }else{
            res.json({code:"0x108",mess:"doğrulama kkodu yanlış"})
        }
   } catch (error) {
    return res.json({code:"0x105",mess:"Sigin verification 1. fonksiyon hata verdi Genel Hata",error})
   }
})




router.post("/logout",(req,res,next)=>{
    req.logout(err=>{
        if(err) return res.json({code:"0x120",mess:"oturum kapatılamadı"})
            res.json({code:"0x202",mess:"successfull"})
    })
})




router.post("/login",(req,res,next)=>{

    try {
        if(req.user) return res.json({code:"0x115",mess:"oturum zaten açık"})

        user_db_login(req.body).then(response=>{
            if(response.code == "0x202"){
                req.login(response.info,(err)=>{
                    if(err) return  res.json({code:"0x113",mess:" kullanıcı adı ve şifere doğru ama oturum açılamadı"})
                    // res.json({code:"0x202",mess:"successfull"})
                next()
                    })
                
            } 
            else  res.json({code:"0x110",mess:"kullanıcı adı veya şifre yanlış "})
        }).catch(err=>{
            res.json()
        })
    } catch (error) {
        res.json({code:"0x105",mess:"genel 1.fonksiyon hatası "})
    }
})

router.post("/login",(req,res,next)=>{
    try {
        user_db_get(req.user.id).then(response=>{
            if(response.code != "0x202") return res.json({code:"0x116",mess:"oturum açıldı ama kullanıcı bilgileri db den gelmedi"})
               
                req.session.publicUser = response.data
                
                res.json({code:"0x202",mess:"successfull"})
            })
    } catch (error) {
        res.json({code:"0x105",mess:"genel 1.fonksiyon hatası "})
    }
})





module.exports = router