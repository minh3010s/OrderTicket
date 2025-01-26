const mongoose=require('mongoose');
const transportSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageSrc:{
        type:String
    }
})
module.exports=mongoose.model("Transport",transportSchema);