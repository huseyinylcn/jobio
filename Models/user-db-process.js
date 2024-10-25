const sql = require("mssql");

const user_db_sigin = (data) => {
  return new Promise((resolve, reject) => {
    let request = new sql.Request();
    request
      .input("fullname", sql.NVarChar, data.fullname)
      .input("birth", sql.Date, data.birth)
      .input("username", sql.NVarChar, data.username)
      .input("password", sql.NVarChar, data.password)
      .input("id", sql.NVarChar, data.id)
      .input("contact", sql.NVarChar, data.contact)
      .query(
        `INSERT INTO [dbo].[user]
           ([fullname]
           ,[birth]
           ,[username]
           ,[password]
           ,[id]
           ,[contact])
     VALUES
           (@fullname
           ,@birth
           ,@username
           ,@password
           ,@id
           ,@contact
           
          

INSERT INTO [dbo].[user_detail]
           ([id]
           ,[profile_picture]
           ,[banner_picture]
           ,[about]
           ,[job]
           ,[talent]
           ,[city]
           ,[district]
           ,[cv])
     VALUES
           (@id
           ,'default_profile_picture.jpg'
           ,'default_banner_picture.jpg'
           ,''
           ,''
           ,''
           ,''
           ,''
           ,'')
           `
      )
      .then((response) => {
        resolve({ code: "0x202", data: response, mess: "successfull" });
      })
      .catch((err) => {
        reject({ code: "0x112", data, err, mess: "sql kayıt hatası" });
      });
  });
};

let user_db_sigin_control = (username, contact) => {
  return new Promise((resolve, reject) => {
    let request = new sql.Request();
    request
      .input("username", sql.NVarChar, username)
      .input("contact", sql.NVarChar, contact)
      .query(
        `IF EXISTS (SELECT * FROM [user] where username = @username AND  contact = @contact)
BEGIN SELECT 1 AS sonuc
END
ELSE IF EXISTS (SELECT * FROM [user] where username = @username)
BEGIN SELECT 2 AS sonuc 
END
ELSE IF EXISTS (SELECT * FROM [user] where contact = @contact)
BEGIN SELECT 3 AS sonuc 
END
ELSE
SELECT 0 AS sonuc`
      )
      .then((response) => {
        if (response.recordset[0].sonuc == 1) {
          resolve({
            code: "0x117",
            mess: "kullanıcı adı ve mail adresi daha önce kullanılmış",
          });
        } else if (response.recordset[0].sonuc == 2)
          resolve({
            code: "0x118",
            mess: "kullanıcı adı daha önce kullanılmış",
          });
        else if (response.recordset[0].sonuc == 3)
          resolve({
            code: "0x119",
            mess: "mail veya tel daha önce kullanılmış",
          });
        else if (response.recordset[0].sonuc == 0)
          resolve({
            code: "0x202",
            mess: "mail veya tel daha önce kullanılmış",
          });
        else reject({ code: "0x112", mess: "sorgudan sonuc alınamadı " });
      })
      .catch((err) => {
        reject({ code: "0x112", mess: "sql hata verdi" });
      });
  }).catch((err) => {
    console.log("hata burada", err);
  });
};

const user_db_login = (data) => {
  return new Promise((resolve, reject) => {
    let request = new sql.Request();
    request
      .input("username", sql.NVarChar, data.username)
      .input("password", sql.NVarChar, data.password)
      .query(
        `IF EXISTS(SELECT 1 FROM [user]  WHERE (username = @username OR contact = @username)
        AND [password] = @password)
	BEGIN SELECT fullname,birth,username,contact,id FROM [user] WHERE (username = @username OR contact = @username)
        AND [password] = @password
		END
		ELSE
		BEGIN
		SELECT 0 AS sonuc
		END`
      )
      .then((response) => {
        if (response.recordset[0].sonuc != 0)
          resolve({
            code: "0x202",
            mess: "kullanıcı ve şifre doğru",
            info: response.recordset[0],
          });
        else
          resolve({ code: "0x110", mess: "kullanıcı adı veya şifre yanlış" });
      })
      .catch((err) => {
        reject({ code: "0x112", mess: "sql sorgu hatası" });
      });
  });
};

const user_db_get = (id) => {
  return new Promise((resolve, reject) => {
    let request = new sql.Request();
    request
      .input("id", sql.NVarChar, id)
      .query(
        `IF EXISTS (SELECT 1 FROM [user_detail] WHERE id = @id)
BEGIN
    SELECT * FROM [user_detail] WHERE  id = @id
END
ELSE
BEGIN
    SELECT 0 AS sonuc
END
`
      )
      .then((response) => {
        if (response.recordset[0].sonuc == 0)
          reject({ code: "0x112", mess: "sql sorgu hatası" });
        resolve({
          code: "0x202",
          mess: "successfull",
          data: response.recordset[0],
        });
      })
      .catch((err) => {
        reject({ code: "0x112", mess: "sql sorgu hatası" });
      });
  });
};

const user_db_about = (about_text, id) => {
  return new Promise((resolve, reject) => {
    let request = new sql.Request();
    request
      .input("about", sql.NVarChar, about_text) // Parametre ekliyoruz
      .input("id", sql.NVarChar, id)
      .query(
        `
    UPDATE [dbo].[user_detail]
    SET [about] = @about
    WHERE id = @id
  `
      )
      .then((response) => {
        resolve({ code: "0x202", mess: "successfull" });
      })
      .catch((err) => {
        console.log(err);
        reject({ code: "0x112", mess: "sql sorgu hatası" });
      });
  });
};

const user_db_job = (job_text, id) => {
  return new Promise((resolve, reject) => {
    let request = new sql.Request();
    request
      .input("job", sql.NVarChar, job_text) 
      .input("id", sql.NVarChar, id)
      .query(
        `
    UPDATE [dbo].[user_detail]
    SET [job] = @job
    WHERE id = @id
  `
      )
      .then((response) => {
        resolve({ code: "0x202", mess: "successfull" });
      })
      .catch((err) => {
        console.log(err);
        reject({ code: "0x112", mess: "sql sorgu hatası" });
      });
  });
};

const user_db_talent = async (talent_text, id) => {
  try {
    let request = await new sql.Request();
    request
      .input("talent", sql.NVarChar, talent_text)
      .input("id", sql.NVarChar, id)
      .query(
            `
        UPDATE [dbo].[user_detail]
        SET [talent] = @talent
        WHERE id = @id
          `
      );
    return { code: "0x202", mess: "successfull" };
  } catch (err) {
    return { code: "0x112", mess: "sql sorgu hatası" };
  }
};

const user_db_city = async (city_text, id) => {
  try {
    let request = await new sql.Request();
    request
      .input("city", sql.NVarChar, city_text) 
      .input("id", sql.NVarChar, id)
      .query(
            `
        UPDATE [dbo].[user_detail]
        SET [city] = @city
        WHERE id = @id
          `
      );
    return { code: "0x202", mess: "successfull" };
  } catch (err) {
    return { code: "0x112", mess: "sql sorgu hatası" };
  }
};

const user_db_district = async (district_text,id)=>{
  try {
    let request = await new sql.Request()
    request
    .input("district", sql.NVarChar, district_text) 
    .input("id", sql.NVarChar, id)
    .query(
          `
      UPDATE [dbo].[user_detail]
      SET [district] = @district
      WHERE id = @id
        `
    );
  return { code: "0x202", mess: "successfull" };
  } catch (error) {
    return { code: "0x112", mess: "sql sorgu hatası" };
  }
}

module.exports = {
  user_db_sigin,
  user_db_login,
  user_db_get,
  user_db_sigin_control,
  user_db_about,
  user_db_job,
  user_db_talent,
  user_db_city,
  user_db_district
};
