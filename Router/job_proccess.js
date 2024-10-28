const router = require("express").Router();
const { job_create } = require("../Models/job_db_proccess");

let test = {
  id: "12",
  admin: "12",
  title: "test title",
  price: "test price",
  about: "test about",
  location: "test location",
  type: "test type",
};
router.post("/create", (req, res, next) => {
  if (!req.user) res.json({ code: "0x114", mess: "oturum kapalı" });


  if (!("id" in req.body))
    return res.json({ code: "0x135", mess: "gelen veri hatalı id anahtarı yok" });
  else if (!("admin" in req.body))
    return res.json({ code: "0x136", mess: "gelen veri hatalı admin anahtarı yok" });
  else if (!("title" in req.body))
    return res.json({ code: "0x137", mess: "gelen veri hatalı title anahtarı yok" });
  else if (!("price" in req.body))
    return res.json({ code: "0x138", mess: "gelen veri hatalı price anahtarı yok" });
  else if (!("about" in req.body))
    return res.json({ code: "0x139", mess: "gelen veri hatalı about anahtarı yok" });
  else if (!("location" in req.body))
    return res.json({ code: "0x140", mess: "gelen veri hatalı location anahtarı yok" });
  else if (!("type" in req.body))
    return res.json({ code: "0x141", mess: "gelen veri hatalı type anahtarı yok" });
  else if (!("max" in req.body.price))
    return res.json({code: "0x142",mess: "gelen veri hatalı price içinde max anahtarı yok"});
  else if (!("min" in req.body.price))
    return res.json({code: "0x143",mess: "gelen veri hatalı price içinde min anahtarı yok"});

  req.body.admin = req.user.id;
  req.body.id = req.query.id;
  req.body.price = JSON.stringify(req.body.price);
  next();
});

router.post("/create", (req, res, next) => {

  job_create(req.body)
    .then((response) => {
      if (response.code == "0x202")
        return res.json({ code: "0x202", mess: "succesfull" });
      else return res.json({ code: "0x134", mess: "iş ilanı oluşturulamadı" });
    })
    .catch((err) => {
      return res.json({ code: "0x105", mess: "genel fonksiyon hatası" });
    });
});

module.exports = router;
