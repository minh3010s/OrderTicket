const express=require('express')
const router=express.Router();
const Transport=require("../models/transport")
//api cho tra
router.post("/addTransprt",(req,res)=>{
    try {
        const transport=new Transport({
            name:req.body.name,
            imageSrc:req.body.imageSrc
        })
        transport.save()
        .then(()=>res.status(200).json({message:"Add oke",transport}))
        .catch(err=>console.log(err))
    } catch (error) {
        console.log(error)
    }
})

router.get("/getTransport",async(req,res)=>{
    try {
        const transport=await Transport.find();
        res.status(200).json(transport)
    } catch (error) {
        console.log(error)
    }
})

module.exports=router;