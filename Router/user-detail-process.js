const router = require("express").Router();
const crypto = require("crypto");
const {
  server_picture_save,
  user_db_profile_picture,
  user_db_banner_picture,
  user_db_cv,
} = require("../Models/user-db-img-process");
const {
  user_db_about,
  user_db_job,
  user_db_talent,
  user_db_city,
  user_db_district,
} = require("../Models/user-db-process");
const path = require("path");
const fs = require("fs");

router.post("/profilepicture", (req, res, next) => {
  if (!req.user)
    return res.json({ code: "0x114", mess: "oturum açmanız gerekiyor" });

  req.params.picture_path = "../Public/profile-picture";
  req.params.picture_name = crypto.randomBytes(7).toString("hex");

  server_picture_save(req, res, (err) => {
    if (err)
      return res.json({
        code: "0x111",
        mess: "resim sunucuya kayıt edilemedi",
      });

    next();
  });
});

router.post("/profilepicture", (req, res, next) => {
  if (req.session.publicUser.profile_picture == "default_profile.png") next();
  fs.unlink(`Public${req.session.publicUser.profile_picture}`, (err) => {
    if (err) {
      console.log("hatayı burada konsolaya yazdır resim silinemedi");
    }
    next();
  });
});

router.post("/profilepicture", async (req, res, next) => {
  try {
    const fullpath = `/profile-picture/${path.basename(req.file.filename)}`;
    req.session.publicUser.profile_picture = fullpath;
    let response = await user_db_profile_picture(fullpath, req.user.id);

    if (response.code == "0x202")
      return res.json({ code: "0x202", mess: "successfull" });
    res.json({ code: "0x112", mess: "sql hata verdi" });
  } catch (error) {
    res.json({ code: "0x112", mess: "sql hata verdi" });
  }
});

router.post("/profilebanner", (req, res, next) => {
  if (!req.user)
    return res.json({ code: "0x114", mess: "oturum açmanız gerekiyor" });
  req.params.picture_path = "../Public/banner-picture";
  req.params.picture_name = crypto.randomBytes(7).toString("hex");
  server_picture_save(req, res, (err) => {
    if (err)
      return res.json({
        code: "0x111",
        mess: "resim sunucuya kayıt edilemedi",
      });
    // res.json({code:"0x202",mess:"succesful"})
    next();
  });
});

router.post("/profilebanner", (req, res, next) => {
  if (req.session.publicUser.banner_picture == "default_banner.png") next();
  fs.unlink(`Public/${req.session.publicUser.banner_picture}`, (err) => {
    if (err) {
      console.log("hatayı burada konsolaya yazdır resim silinemedi", err);
    }
    next();
  });
});

router.post("/profilebanner", (req, res, next) => {
  const fullpath = `/banner-picture/${path.basename(req.file.filename)}`;
  req.session.publicUser.banner_picture = fullpath;

  user_db_banner_picture(fullpath, req.user.id)
    .then((respose) => {
      if (respose.code == "0x202")
        return res.json({ code: "0x202", mess: "successfull" });
      res.json({ code: "0x112", mess: "sql hata verdi" });
    })
    .catch((err) => {
      res.json({ code: "0x112", mess: "sql hata verdi" });
    });
});

router.post("/cv", (req, res, next) => {
  if (!req.user)
    return res.json({ code: "0x114", mess: "oturum açmanız gerekiyor" });

  req.params.picture_path = "../Public/cv-file";
  req.params.picture_name = crypto.randomBytes(7).toString("hex");
  server_picture_save(req, res, (err) => {
    if (err)
      return res.json({
        code: "0x111",
        mess: "resim sunucuya kayıt edilemedi",
      });
    next();
  });
});

router.post("/cv", (req, res, next) => {
  if (req.session.publicUser.cv == "default_cv.png") next();
  fs.unlink(`Public${req.session.publicUser.cv}`, (err) => {
    if (err) {
      console.log("hatayı burada konsolaya yazdır resim silinemedi");
    }
    next();
  });
});

router.post("/cv", (req, res, next) => {
  const fullpath = `/cv-file/${path.basename(req.file.filename)}`;
  req.session.publicUser.cv = fullpath;
  user_db_cv(fullpath, req.user.id)
    .then((response) => {
      if (response.code == "0x202")
        return res.json({ code: "0x202", mess: "successfull" });
      res.json({ code: "0x112", mess: "sql hata verdi" });
    })
    .catch((err) => {
      res.json({ code: "0x112", mess: "sql hata verdi" });
    });
});

router.post("/about", async (req, res, next) => {
  try {
    if (!req.user)
      return res.json({ code: "0x114", mess: "oturum açmanız gerekiyor" });

    let response = await user_db_about(req.body.about, req.user.id);

    if (response.code != "0x202")
      return res.json({ code: "0x122", mess: "about kayıt edilemesi" });

    req.session.publicUser.about = req.body.about;
    res.json({ code: "0x202", mess: "successfull" });
  } catch (error) {
    res.json({ code: "0x105", mess: "genel fonksiyon hatası" });
  }
});

router.post("/job", async (req, res, next) => {
  try {
    if (!req.user)
      return res.json({ code: "0x114", mess: "oturum açmanız gerekiyor" });

    let response = await user_db_job(req.body.job, req.user.id);
    if (response.code != "0x202")
      return res.json({ code: "0x123", mess: "job kayıt edilemedi" });
    req.session.publicUser.job = req.body.job;
    res.json({ code: "0x202", mess: "successfull" });
  } catch (err) {
    res.json({ code: "0x105", mess: "genel fonksiyon hatası" });
  }
});

router.post("/talent", async (req, res, next) => {
  try {
    if (!req.user)
      return res.json({ code: "0x114", mess: "oturum açmanız gerekiyor" });
    let response = await user_db_talent(req.body.talent, req.user.id);
    if (response.code != "0x202")
      return res.json({ code: "0x124", mess: "talent kayıt edilemedi" });

    req.session.publicUser.talent = req.body.talent;
    return res.json({ code: "0x202", mess: "successfull" });
  } catch (err) {
    res.json({ code: "0x105", mess: "genel fonksiyon hatası" });
  }
});

router.post("/city", async (req, res, next) => {
  try {
    if (!req.user)
      return res.json({ code: "0x114", mess: "oturum açmanız gerekiyor" });

    let response = await user_db_city(req.body.city, req.user.id);
    if (response.code != "0x202")
      return res.json({ code: "0x125", mess: "city kayıt edilemedi" });
    req.session.publicUser.city = req.body.city;
    return res.json({ code: "0x202", mess: "successfull" });
  } catch (error) {
    return res.json({ code: "0x105", mess: "genel fonksiyon hatası" });
  }
});

router.post("/district", async (req, res, next) => {
  try {
    if (!req.user)
      return res.json({ code: "0x114", mess: "oturum açmanız gerek" });
    console.log(req.body);
    let response = await user_db_district(req.body.district, req.user.id);
    if (response.code != "0x202")
      return res.json({ code: "0x126", mess: "district kayıt edilemedi" });
    req.session.publicUser.district = req.body.district;
    return res.json({ code: "0x202", mess: "successfull" });
  } catch (error) {
    res.json({ code: "0x105", mess: "genel fonksiyon hatası" });
  }
});



module.exports = router;
