const mongoose=require("mongoose");
const TaskSchema=mongoose.Schema({
    number_1:{
        type:Number,
        required:true,

    },
    number_2:{
        type:Number,
        required:true,

    },
    answer:{
        type:Number,
    },
    status:{
        type:String,
        default:"pending",
    }
})

const Task=new mongoose.model("numberTask",TaskSchema);
module.exports=Task;