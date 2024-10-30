const sql = require("mssql")


const job_create = (data)=>{
return new Promise((resolve,reject)=>{
    let result = new sql.Request()
    result
    .input("company",sql.NVarChar,data.company)
    .input("admin",sql.NVarChar,data.admin)
    .input("title",sql.NVarChar,data.title)
    .input("price",sql.NVarChar,data.price)
    .input("about",sql.NVarChar,data.about)
    .input("location",sql.NVarChar,data.location)
    .input("type",sql.NVarChar,data.type)
    .input("id",sql.NVarChar,data.id)

    .query(`
        INSERT INTO [dbo].[job_advert]
           ([company]
           ,[admin]
           ,[title]
           ,[price]
           ,[about]
           ,[location]
           ,[type]
           ,[id])
     VALUES
           (@company
           ,@admin
           ,@title
           ,@price
           ,@about
           ,@location
           ,@type
           ,@id)
        `).then(response=>{
        resolve({code:"0x202",mess:"successfull"})
    }).catch((err=>{
        reject({code:"0x134",mess:"iş ilanı verilemedi"})
    }))
}).catch(err=>{
    return {code:"0x112",mess:"sql genel fonksiyon hatası"}
})
}


module.exports = {job_create}