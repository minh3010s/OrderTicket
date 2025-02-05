const Place=require('../models/place')
const express=require('express')
const placeRouter=express.Router();
placeRouter.post("/addPlace",(req,res)=>{
    try {
        const place=new Place({
            name:req.body.name
        })
        place.save()
        .then(()=>res.status(201).json(place))
        .catch(err=>res.status(500).json({message:"Add failed",err}))
    } catch (error) {
        console.log(error)
    }
})

//get all place
placeRouter.get("/getPlace",async(req,res)=>{
    try {
       const place=await Place.find();
       res.status(200).json(place)
    } catch (error) {
        console.log(error)
    }
})
module.exports=placeRouter;