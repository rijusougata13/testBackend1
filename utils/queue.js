// const Queue = require("bull");
// const jobQueue=new Queue("job-runner-queue");
// const Task=require("../models/Task");

// const num_workers=5;

// jobQueue.process(num_workers,async({data})=>{
//     const taskId=data.id;
//     const task=await Task.findById(taskId);
//     console.log(task);
//     if(task===undefined){
//         throw Error("cann't find task");
//     }
//     try{
//         let output;
//         output=data.num1+data.num2;
//         task["answer"]=output;
//         task["status"]="success";
//         await  task.save();
//         return true;
//     }
//     catch(err){
//         task["status"]="failure";
//         await task.save();
//         throw Error(JSON.stringify(err));
//     }
// })

// jobQueue.on("failed", (error) => {
//   console.log(error.data.id, "failed", error.failedReason);
// });

// const addJobToQueue=async (jobId,num1,num2)=>{
//     // setTimeout(()=>{
//         console.log("start");
//    const data=await jobQueue.add({id:jobId,num1,num2});
//     // },10000)
//     console.log("data",data);
// }

const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
  console.log('Redis Connected!');
});
var kue = require('kue')
  , jobs = kue.createQueue()
  ;

function newJob (name){
  name = name || 'Default_Name';
  var job = jobs.create('new job', {
    name: name
  });

  job
    .on('complete', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'is done');
    })
    .on('failed', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'has failed');
    })

  job.save();
}

jobs.process('new job', function (job, done){
  /* carry out all the job function here */
  done && done();
});

module.exports={
    newJob,
}