const sql = require("mssql");

const company_create = (id, admin) => {
  try {
    let result = new sql.Request();

    result.input("id", sql.NVarChar, id).input("admin", sql.NVarChar, admin)
      .query(`INSERT INTO [dbo].[company]
           ([id]
           ,[size]
           ,[industry]
           ,[contact]
           ,[profile_picture]
           ,[banner_picture]
           ,[about]
           ,[city]
           ,[admin]
           ,[name])
     VALUES
           (@id
           ,NULL
           ,NULL
           ,NULL
           ,NULL
           ,NULL
           ,NULL
           ,NULL
           ,@admin
           ,NULL)`);
    return { code: "0x202", mess: "successfull" };
  } catch (error) {
    return { code: "0x112", mess: "sql sorgu hatastv" };
  }
};

let company_get = (company_id) => {
  return new Promise((resolve, reject) => {
    let result = new sql.Request();
    result
      .input("id", sql.NVarChar, company_id)
      .query(`select * from company where id = @id`)
      .then((response) => {
        resolve({
          code: "0x202",
          mess: "successfull",
          data: response.recordset[0],
        });
      });
  }).catch((err) => {
    return { code: "0x112", mess: "sql sorgu hattası", error: err };
  });
};

const company_db_name =async (company_name, company_id) => {
  try {
    console.log(company_name,company_id)
    let result = new sql.Request();
   await result
      .input("id", sql.NVarChar, company_id)
      .input("name", sql.NVarChar, company_name).query(`
        
UPDATE [dbo].[company]
   SET 
      [name] = @name
 WHERE id = @id
        `);
        return {code:"0x202",mess:"succesfull"}
  } catch (err) {
    return { code: "0x112", mess: "sql sorgu hattası", error: err };
  }
};

const company_db_size =async (company_size, company_id) => {
    try {
      let result = new sql.Request();
     await result
        .input("id", sql.NVarChar, company_id)
        .input("size", sql.NVarChar, company_size).query(`
          
  UPDATE [dbo].[company]
     SET 
        [size] = @size
   WHERE id = @id
          `);
          return {code:"0x202",mess:"succesfull"}
    } catch (err) {
      return { code: "0x112", mess: "sql sorgu hattası", error: err };
    }
  };


  const company_db_industry =async (company_industry, company_id) => {
    try {
      let result = new sql.Request();
     await result
        .input("id", sql.NVarChar, company_id)
        .input("industry", sql.NVarChar, company_industry).query(`
          
  UPDATE [dbo].[company]
     SET 
        [industry] = @industry
   WHERE id = @id
          `);
          return {code:"0x202",mess:"succesfull"}
    } catch (err) {
      return { code: "0x112", mess: "sql sorgu hattası", error: err };
    }
  };


  const company_db_contact =async (company_contact, company_id) => {
    try {
      let result = new sql.Request();
     await result
        .input("id", sql.NVarChar, company_id)
        .input("contact", sql.NVarChar, company_contact).query(`
          
  UPDATE [dbo].[company]
     SET 
        [contact] = @contact
   WHERE id = @id
          `);
          return {code:"0x202",mess:"succesfull"}
    } catch (err) {
      return { code: "0x112", mess: "sql sorgu hattası", error: err };
    }
  };


  const company_db_about =async (company_about, company_id) => {
    try {
        console.log(company_about,company_id)
      let result = new sql.Request();
     await result
        .input("id", sql.NVarChar, company_id)
        .input("about", sql.NVarChar, company_about).query(`
          
  UPDATE [dbo].[company]
     SET 
        [about] = @about
   WHERE id = @id
          `);
          return {code:"0x202",mess:"succesfull"}
    } catch (err) {
      return { code: "0x112", mess: "sql sorgu hattası", error: err };
    }
  };


  const company_db_city =async (company_city, company_id) => {
    try {
      let result = new sql.Request();
     await result
        .input("id", sql.NVarChar, company_id)
        .input("city", sql.NVarChar, company_city).query(`
          
  UPDATE [dbo].[company]
     SET 
        [city] = @city
   WHERE id = @id
          `);
          return {code:"0x202",mess:"succesfull"}
    } catch (err) {
      return { code: "0x112", mess: "sql sorgu hattası", error: err };
    }
  };

  const company_db_profile_picture =async (company_profile_picture, company_id) => {
    try {
      let result = new sql.Request();
     await result
        .input("id", sql.NVarChar, company_id)
        .input("profile_picture", sql.NVarChar, company_profile_picture).query(`
          
  UPDATE [dbo].[company]
     SET 
        [profile_picture] = @profile_picture
   WHERE id = @id
          `)
            return {code:"0x202",mess:"succesfull"}
      
    } catch (err) {
      return { code: "0x112", mess: "sql sorgu hattası", error: err };
    }
  };

  const company_db_banner_picture =async (company_banner_picture, company_id) => {
    try {
      let result = new sql.Request();
     await result
        .input("id", sql.NVarChar, company_id)
        .input("banner_picture", sql.NVarChar, company_banner_picture).query(`
          
  UPDATE [dbo].[company]
     SET 
        [banner_picture] = @banner_picture
   WHERE id = @id
          `)
            return {code:"0x202",mess:"succesfull"}
      
    } catch (err) {
      return { code: "0x112", mess: "sql sorgu hattası", error: err };
    }
  };


 

module.exports = { company_create, company_get,company_db_name,company_db_size,company_db_industry,company_db_contact,company_db_about,company_db_city,company_db_profile_picture ,company_db_banner_picture};
