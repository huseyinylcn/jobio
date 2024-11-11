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

const job_asset_control = (data)=>{
    return new Promise((resolve,reject)=>{
        let result = new sql.Request()
        result
        .input('job_id',sql.NVarChar,data.job_id)
        .query(`if exists(select * from [job_advert] where id = @job_id)
            begin select 1 as sonuc
            end
            else select 0  as sonuc
            `).then(response=>{
                if (response.recordset[0].sonuc == 1) resolve({code:"0x202",mess:"successfull"})
                else resolve({code:"0x144",mess:"böyle bir iş ilanı yok "})
            }).catch(err=>{
                reject({code:"0x112",mess:"sql genel fonksiyon hatası"})
            })
    }).catch(error=>{
        
    })
}
const job_applicant_assest_control = (data)=>{
    return new Promise((resolve,reject)=>{
        let result = new sql.Request()
        result
        .input('user_id',sql.NVarChar, data.id)
        .query(`
            if exists(select * from [applicants] where applicant_id = @user_id)
            begin select 1 as sonuc
            end
            else select 0  as sonuc
            
            `).then(response=>{
            if (response.recordset[0].sonuc == 1){
                resolve({code:"0x147",mess:"zaten başvuru yapılmış"})
            }
            else{
                resolve({code:"0x202",mess:"successfull"})
            }
        }).catch(err=>{
            reject({code:"0x148",mess:"sorgu hata veridi kontrol edilemedi "})
        })
    }).catch(error=>{
        return {code:"0x112",mess:"sql genel fonksiyon hatası"}
    })
}

const job_applicant = (data)=>{
    return new Promise((resolve,reject)=>{
        let result = new sql.Request()
        result
        .input('job_id',sql.NVarChar,data.job_id)
        .input('cv',sql.NVarChar,data.cv)
        .input('user_id',sql.NVarChar,data.user_id)
        .query(`insert into [dbo].[applicants]
                            ([applicant_id]
                            ,[job_id]
                            ,[cv])
                        values
                            (@user_id,
                            @job_id,
                            @cv)
            `)
        .then(result=>{
            resolve({code:"0x202",mess:"succssfull"})
        }).catch(err=>{
            reject({code:"0x146",mess:"iş başvurusu yapılamadı tekrar deneyin sorun sql"})
        })
    }).catch(err=>{
        return {code:"0x112",mess:"sql genel fonksiyon hatası"}
    })
}


module.exports = {job_create,job_asset_control,job_applicant,job_applicant_assest_control}