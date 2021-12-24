const Queue = require("bull");
const jobQueue=new Queue("job-runner-queue");
const Task=require("../models/Task");

const num_workers=5;

jobQueue.process(num_workers,async({data})=>{
    const taskId=data.id;
    const task=await Task.findById(taskId);
    console.log("Task",task);
    if(task===undefined){
        throw Error("cann't find task");
    }
    try{
        let output;
        output=Number(data.num1)+Number(data.num2);
        task["answer"]=output;
        task["status"]="success";
        await  task.save();
        return true;
    }
    catch(err){
        task["status"]="failure";
        await task.save();
        throw Error(JSON.stringify("haha",err));
    }
})

jobQueue.on("failed", (error) => {
  console.log(error.data.id, "failed", error.failedReason);
});

const newJob=async (jobId,num1,num2)=>{
    setTimeout(async()=>{        
      const data=await jobQueue.add({id:jobId,num1,num2});
    },10000)
}


module.exports={
    newJob,
}