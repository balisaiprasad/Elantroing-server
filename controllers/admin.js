import TryCatch from "../middleware/TryCatch.js"
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/lecture.js";
import{rm } from "fs";
import {promisify} from "util";
import fs from "fs";
import { User } from "../models/User.js";

export const createCourse = TryCatch(async (req,res)=>{
    const {title, description, createdBy, duration , price} =  req.body;

    const image = req.file;


    await Courses.create ({ 

        title,
        description,
        
        createdBy,
        image: image?.path,
        duration,
        price,

    });

    res.status(201).json({
        message:"Course Created Sucessfully",
    });
});

export const addLectures = TryCatch(async(req,res)=>{
    const course= await Courses.findById(req.params.id);

    if(!course)
        return res.status(404).json({
        message:"No Course with this name"
        });

        const {title,description} = req.body
        const file= req.file
        const lecture = await Lecture.create({

            title,
            description,
            video: file?.path,
            course: course._id,
        });

        res.status(201).json({
            message:"lecture added",
            lecture,

        });
});


export const deleteLecture = TryCatch(async(req,res)=>{
    const lecture = await Lecture.findById(req.params.id);

    rm(lecture.video,()=>{
        console.log("video deleted");

    });

    await lecture.deleteOne();

    res.json({message: "Lecture Deleted"})
});

const unlinkAsync = promisify( fs.unlink)


export const deleteCourse = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);

   const lectures = await Lecture.find({course: course._id})

   await Promise.all(
    lectures.map(async(lecture)=>{
        await unlinkAsync(lecture.video);
        console.log("video Deleted");
    })
   );

   rm(course.image,()=>{
    console.log("image deleted");

});

await Lecture.find({course: req.params.id}).deleteMany()

await course.deleteOne()

await User.updateMany({},{$pull:{ subscription: req.params.id}});

res.json({
    message:"Course Deleted",
});

});
export const getAllStats = TryCatch(async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const totalCourses = (await Courses.find()).length;
        const totalLectures = (await Lecture.find()).length;
        const totalUsers = (await User.find()).length;

        const stats = {
            totalCourses,
            totalLectures,
            totalUsers,
        };

        res.json({ stats });
    } catch (error) {
        console.error('Error in fetching stats:', error.message); // Log the error message
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


export const getAllUser = TryCatch(async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const Users = await User.find({_id:{$ne:req.user._id}}).select("-password");

        
        res.json({ Users });
    } catch (error) {
        console.error('Error in fetching users:', error.message); // Log the error message
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


export const updateRoles= TryCatch(async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const user=await User.findById(req.params.id)


        if(user.role === "user"){
            user.role="admin";
            await user.save()
        
        return res.status(200).json({
            message:"Role updated to admin"
        })
    }
        if(user.role === "admin"){
            user.role="user";
            await user.save()
       
        return res.status(200).json({
            message:"Role updated to "
        })
    }
    } catch (error) {
        console.error('Error in fetching stats:', error.message); // Log the error message
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
