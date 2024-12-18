const router = require("express").Router();
const crypto = require("crypto");

const { job_create,job_asset_control, job_applicant, job_applicant_assest_control } = require("../Models/job_db_proccess");
const { company_get } = require("../Models/company-db-process");

router.post("/create", (req, res, next) => {
  if (!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });

 if (!("title" in req.body))
    return res.json({
      code: "0x137",
      mess: "gelen veri hatalı title anahtarı yok",
    });
  else if (!("price" in req.body))
    return res.json({
      code: "0x138",
      mess: "gelen veri hatalı price anahtarı yok",
    });
  else if (!("about" in req.body))
    return res.json({
      code: "0x139",
      mess: "gelen veri hatalı about anahtarı yok",
    });
  else if (!("location" in req.body))
    return res.json({
      code: "0x140",
      mess: "gelen veri hatalı location anahtarı yok",
    });
  else if (!("type" in req.body))
    return res.json({
      code: "0x141",
      mess: "gelen veri hatalı type anahtarı yok",
    });
  else if (!("max" in req.body.price))
    return res.json({
      code: "0x142",
      mess: "gelen veri hatalı price içinde max anahtarı yok",
    });
  else if (!("min" in req.body.price))
    return res.json({
      code: "0x143",
      mess: "gelen veri hatalı price içinde min anahtarı yok",
    });

  req.body.admin = req.user.id;
  req.body.company = req.query.id;
  req.body.id = crypto.randomBytes(10).toString("hex");
  req.body.price = JSON.stringify(req.body.price);
  next();
});

router.post("/create", async (req, res, next) => {
  try {
    let company_response = await company_get(req.query.id)
   

    if (!(typeof(company_response.data) == 'object')) return  res.json({code:"",mess:"şirket bulunamadı"})
    if (!("admin" in company_response.data)) return  res.json({code:"",mess:"şirket bulunamadı"})

    if(company_response.data.admin != req.user.id) return res.json({ code: "0x127", mess: "bu şirket size ait değil" });

    let response = await job_create(req.body);
    if (response.code == "0x202")
      return res.json({ code: "0x202", mess: "succesfull" });
    else return res.json({ code: "0x134", mess: "iş ilanı oluşturulamadı" });

  } catch (error) {
    console.log("error",error)
    return res.json({ code: "0x105", mess: "genel fonksiyon hatası"});
  }
});


router.post("/apply",async(req,res,next)=>{

  if (!req.user) return res.json({ code: "0x114", mess: "oturum kapalı" });

  if (!("job_id" in req.body && "cv" in req.body)) return res.json({ code: "0x145", mess: "gelen veri eksik veya hatalı" });

  let response = await job_asset_control(req.body)

  if (response.code == '0x202') next()
  else if(response.code == "0x144") return res.json({ code: "0x144", mess: "böyle bir iş bulunamadıı job id yanlış" });
  else return res.json({code:"0x112",mess:"sql genel fonksiyon hatası"})
  
})

router.post("/apply",async(req,res,next)=>{

let response = await  job_applicant_assest_control(req.user)
if (response.code == '0x202') next()
  else if (response.code == '0x147') return res.json({code:"0x147",mess:"zaten başvuru yapılmış"})
else if( response.code = '0x148') return res.json({code:"0x148",mess:"control sorgu hatası"})
  else if(response.code == '0x112') return res.json({code:'0x112',mess:"genel sql func hatası"})
else return {code:"0x000",mess:"bilinmeyen hata"}
  })

router.post("/apply",async(req,res,next)=>{
  req.body.user_id = req.user.id
let response = await job_applicant(req.body)
if (response.code == '0x202') return res.json({code:"0x202",mess:"succesfuul"})
else if (response.code == '0x146') return res.json({code:"0x146",mess:"iş başvurusu yapılamadı "})
else return res.json({code:"0x112",mess:"sql func genel hata"})

})



module.exports = router;
