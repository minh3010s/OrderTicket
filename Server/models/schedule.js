const mongoose=require('mongoose');
const scheduleSchema=mongoose.Schema({
    name:{
        type:String
    },
    departuretime:{
        type:String
    },
    arrivaltime:{
        type:String
    },
    transportId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transport"
    },
    price:{
        type:String
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Place" 
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Place" 
    },
})
module.exports=mongoose.model("Schedule",scheduleSchema)