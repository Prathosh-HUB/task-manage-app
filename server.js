const express = require("express");
const mongoose= require("mongoose");
const cors=require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/taskdb")
.then(()=>console.log("DB connected"))
.catch(err=> console.log(err)); 

const TaskSchema= new mongoose.Schema({
    title: String,
    status:{type:String, default:"Pending"},
    created_at:{type: Date, default: Date.now}
});
const Task =mongoose.model("Task", TaskSchema);

//add task
app.post("/tasks", async(req,res)=>{
     console.log("BODY:", req.body);
    try{
        const task =new Task({title:req.body.title});
        await task.save();
        res.json(task);
}catch(error){
    res.status(500).json({ error: error.message});
}
});

//get ..
app.get("/tasks",async(req,res)=>{
    try{
        const tasks =await Task.find();
        res.json(tasks);
    }catch(error){
        res.status(500).json({ error: error.message});
    }
})
//update...
app.put("/tasks/:id",async(req,res)=>{
    try{
        const task =await Task.findByIdAndUpdate(req.params.id,
            {status:req.body.status},
            {new:true}
        );res.json(task);
    }catch(error){
        res.status(500).json({ error: error.message});
    }
})
// delete .
app.delete("/tasks/:id",async(req,res)=>{
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error:error.message });
  }
});
app.listen(5000, ()=> console.log("server running on 5000"));