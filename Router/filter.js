const router = require('express').Router()


router.post("/user",(req,res,next)=>{
res.json("activate")
})


router.post("/company",(req,res,next)=>{
    res.json("activate")
})


router.post("/job",(req,res,next)=>{
    res.json("activate")
})

module.exports = router