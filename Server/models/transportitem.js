const mongoose=require('mongoose');
const transportItemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("TransportItem",transportItemSchema);