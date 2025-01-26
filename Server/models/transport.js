const mongoose=require('mongoose');
const transportSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("Transport",transportSchema);