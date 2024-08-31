import mongoose from "mongoose";


const schema = new mongoose.Schema({

   
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        
     ],
    completedLecture: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Lecture",
        },
        
     ],
     course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Courses",
        },
        
     ],
},{
    timestamps: true,
});

export  const Progress = mongoose. model("Progress", schema);