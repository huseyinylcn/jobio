const multer = require("multer");
const path = require("path");
const sql = require("mssql");


const stronge = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, req.params.picture_path));
  },
  filename: async (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, req.params.picture_name + fileExtension);
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const server_picture_save = multer({
  storage: stronge,
  fileFilter: fileFilter,
}).single("img");

const user_db_profile_picture = (img_path, id) => {
  return new Promise((resolve, reject) => {
    sql
      .query(
        `UPDATE [dbo].[user_detail]
   SET [profile_picture] = '${img_path}' 
      
 WHERE id = '${id}'
` )
      .then((response) => {

        resolve({ code: "0x202", mess: "successfull" });
      })
      .catch((err) => {
        reject({ code: "0x112", mess: "sql kayıt hatası" });
      });
  });
};



const user_db_banner_picture = (img_path, id) => {
  return new Promise((resolve, reject) => {
    sql
      .query(
        `UPDATE [dbo].[user_detail]
   SET [banner_picture] = '${img_path}' 
      
 WHERE id = '${id}'
` )
      .then((response) => {

        resolve({ code: "0x202", mess: "successfull" });
      })
      .catch((err) => {
        reject({ code: "0x112", mess: "sql kayıt hatası" });
      });
  });
};

const user_db_cv = (cv_path, id) => {
  return new Promise((resolve, reject) => {
    sql
      .query(
        `UPDATE [dbo].[user_detail]
   SET [cv] = '${cv_path}' 
      
 WHERE id = '${id}'
` )
      .then((response) => {

        resolve({ code: "0x202", mess: "successfull" });
      })
      .catch((err) => {
        reject({ code: "0x112", mess: "sql kayıt hatası" });
      });
  });
};


module.exports = { server_picture_save, user_db_profile_picture,user_db_banner_picture,user_db_cv };
