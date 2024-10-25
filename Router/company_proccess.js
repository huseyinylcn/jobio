const router = require("express").Router();
const crypto = require("crypto");
const fs = require("fs")
const path = require("path")
const {
  company_create,
  company_get,
  company_db_name,
  company_db_size,
  company_db_industry,
  company_db_contact,
  company_db_about,
  company_db_city,
  company_db_profile_picture,
  company_db_banner_picture
} = require("../Models/company-db-process");
const { server_picture_save } = require("../Models/user-db-img-process");

router.post("/create", async (req, res, next) => {
  try {
    if (!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });
    let id = crypto.randomBytes(10).toString("hex");
    let response = await company_create(id, req.user.id);
    if (response.code != "0x202")
      return res.json({ code: "0x127", mess: "company oluşturulamadı" });
    res.json({ code: "0x202", mess: "successfull" });
  } catch (error) {
    res.json({ code: "0x105", mess: "genel fonksiyon hatası" });
  }
});

router.post("/name", async (req, res, next) => {
  if (!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });

  let response = await company_get(req.query.id);
  if (response.data.admin != req.user.id)
    return res.json({ code: "0x127", mess: "bu şirket size ait değil" });
  let response2 = await company_db_name( req.body.name,req.query.id);
    if(response2.code != "0x202") return res.json({code:"0x128",mess:"company name katıt edilemedi sql error"})
    res.json({code:"0x202",mess:"successful"})
});

router.post("/size",async(req,res,next)=>{
    if(!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });
    let response = await company_get(req.query.id);
    if (response.data.admin != req.user.id)
      return res.json({ code: "0x127", mess: "bu şirket size ait değil" });
    let response2 = await company_db_size( req.body.size,req.query.id);
    if(response2.code != "0x202") return res.json({code:"0x129",mess:"company size katıt edilemedi sql error"})
    res.json({code:"0x202",mess:"successful"})

})

router.post("/industry",async(req,res,next)=>{
    if(!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });
    let response = await company_get(req.query.id);
    if (response.data.admin != req.user.id)
      return res.json({ code: "0x127", mess: "bu şirket size ait değil" });
    let response2 = await company_db_industry( req.body.industry,req.query.id);
    if(response2.code != "0x202") return res.json({code:"0x130",mess:"company industry katıt edilemedi sql error"})
    res.json({code:"0x202",mess:"successful"})
})

router.post("/contact",async(req,res,next)=>{
    if(!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });
    let response = await company_get(req.query.id);
    if (response.data.admin != req.user.id)
      return res.json({ code: "0x127", mess: "bu şirket size ait değil" });
    let response2 = await company_db_contact( req.body.contact,req.query.id);
    if(response2.code != "0x202") return res.json({code:"0x131",mess:"company contact katıt edilemedi sql error"})
    res.json({code:"0x202",mess:"successful"})
})

router.post("/about",async(req,res,next)=>{
    if(!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });
    let response = await company_get(req.query.id);
    if (response.data.admin != req.user.id)
      return res.json({ code: "0x127", mess: "bu şirket size ait değil" });

    let response2 = await company_db_about( req.body.about,req.query.id);
    if(response2.code != "0x202") return res.json({code:"0x132",mess:"company about katıt edilemedi sql error"})
    res.json({code:"0x202",mess:"successful"})
})

router.post("/city",async(req,res,next)=>{
    if(!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });
    let response = await company_get(req.query.id);
    if (response.data.admin != req.user.id)
      return res.json({ code: "0x127", mess: "bu şirket size ait değil" });

    let response2 = await company_db_city( req.body.city,req.query.id);
    if(response2.code != "0x202") return res.json({code:"0x133",mess:"company city katıt edilemedi sql error"})
    res.json({code:"0x202",mess:"successful"})
})

router.post("/profilepicture",async(req,res,next)=>{
  if(!req.user) return res.json({code:"0x114",mess:"oturum kapalı"})
    let response = await company_get(req.query.id);

  req.comany_info = response.data
  
    if (response.data.admin != req.user.id)
      return res.json({ code: "0x127", mess: "bu şirket size ait değil" });

    req.params.picture_path = "../Public/company-profile-picture";
    req.params.picture_name = crypto.randomBytes(7).toString("hex");

    server_picture_save(req,res,err=>{
      if(err) return res.json({code:"0x131",mess:"company profil fotoğtafı sunucuya kayıt edilemedi"})
        next()
    })
})

router.post("/profilepicture",(req,res,next)=>{
  if (req.comany_info.profile_picture == "default_profile.png") next();
  fs.unlink(`Public${req.comany_info.profile_picture}`, (err) => {
    if (err) {
      console.log("hatayı burada konsolaya yazdır resim silinemedi");
    }
    next();
  });
})
router.post("/profilepicture",async(req,res,next)=>{
  const fullpath = `/company-profile-picture/${path.basename(req.file.filename)}`;
let response = await company_db_profile_picture(fullpath,req.query.id)

if (response.code == '0x202') return res.json({code:"0x202",mess:"successfull"})
  res.json({code:"0x132",mess:"company profile fotoğrafı sunucu kayıt edilemedi"})

})




router.post("/bannerpicture",async(req,res,next)=>{
  if(!req.user) return res.json({code:"0x114",mess:"oturum kapalı"})
    let response = await company_get(req.query.id);

  req.comany_info = response.data
  
    if (response.data.admin != req.user.id)
      return res.json({ code: "0x127", mess: "bu şirket size ait değil" });

    req.params.picture_path = "../Public/company-banner-picture";
    req.params.picture_name = crypto.randomBytes(7).toString("hex");

    server_picture_save(req,res,err=>{
      if(err) return res.json({code:"0x133",mess:"company kapak fotoğtafı sunucuya kayıt edilemedi"})
        next()
    })
})

router.post("/bannerpicture",(req,res,next)=>{
  if (req.comany_info.banner_picture == "default_profile.png") next();
  fs.unlink(`Public${req.comany_info.banner_picture}`, (err) => {
    if (err) {
      console.log("hatayı burada konsolaya yazdır resim silinemedi");
    }
    next();
  });
})
router.post("/bannerpicture",async(req,res,next)=>{
  const fullpath = `/company-banner-picture/${path.basename(req.file.filename)}`;
let response = await company_db_banner_picture(fullpath,req.query.id)

if (response.code == '0x202') return res.json({code:"0x202",mess:"successfull"})
  res.json({code:"0x134",mess:"company kapak fotoğrafı sunucu kayıt edilemedi"})

})




module.exports = router;
