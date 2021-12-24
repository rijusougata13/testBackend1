const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const Task = require("./models/Task");
const {newJob}=require("./utils/queue");

mongoose.connect("mongodb+srv://rijusougata13:13072001@realmcluster.22swx.mongodb.net/compilerapp?retryWrites=true&w=majority",
{
    useNewUrlParser:true,
    useUnifiedTopology:true,    
},
    (err)=>{
        if(err){
            console.log("Error ",err);
            process.exit(1);
   
        }
        else{
        console.log("Successfully Connected!!");
      }
    }
    
);

const app=express()
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/",async(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Hi from test API"
    })
})

app.get("/calculate/:number1/:number2",async (req,res)=>{
    const num1=req.params.number1;
    const num2=req.params.number2;
    try{
        const task=await new Task({
            number_1:num1,
            number_2:num2,
        }).save();

        const unique_identifier=task["_id"];
        newJob("Sn");
        // newJob(unique_identifier,num1,num2);
        return res.status(201).json({
            success:true,
            message:"successfully added to queue",
            unique_identifier
        })
        
        
    }catch(err){
        console.log("Error",err);
        res.status(500).json({
            success:false,
        })
    }
    res.status(200).json({
        success:true,
        message:{
            num1,num2
        }
    })
})


const PORT=5000;
app.listen(process.env.PORT || PORT,()=>{
    console.log("Listening on port 5000");
});