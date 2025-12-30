const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('mongodb Connected Successfully');
    })
    .catch((err)=>{
        console.log({mssg:'error connecting mongodb',err:err.message});
    })

const courseSchema = new mongoose.Schema({
    courseCode:{
        type:String,
        required:[true, "Course code is required"],
        unique:true,
        trim:true
    },
    courseName:{
        type:String,
        required:[true, "course name is required"],
        trim:true
    },
    category:{
        type:String,
        required:[true, "Category is required"],
        trim:true 
    },
    duration:{
        type:Number,
        required:[true, "Duration is required"],
        min:1

    }
});

const Course = mongoose.model('Course', courseSchema);

app.post('/api/courses', async (req,res)=>{
    try{
        const {courseName,courseCode,category,duration}=req.body;
        if(!courseName || !courseCode || !category || !duration){
            return res.status(400).json({mssg:'All fields are required'});
        }
        const newCourse = new Course({courseName,courseCode,category,duration});
        await newCourse.save()
        res.status(201).json(newCourse);
    }
    catch(err){
         if (err.code === 11000) {
            return res.status(400).json({ message: 'Course code already exists' });
        }
        res.status(400).json({message:'error adding course',err:err.message});
    }
})

app.get('/api/courses', async(req,res)=>{
    try{
    const course = await Course.find();
    res.status(200).json(course);
    }
    catch(err){
        res.status(500).json('error fetching course')
    }

})

app.get('/api/courses/:id',async(req,res)=>{
    try{
    const course = await Course.findById(req.params.id);
    if(!course){
        return res.status(404).json('Course not found');
    }
    res.status(200).json(course);
    }
    catch(err){
        res.status(400).json({message:'Invalid course id',err:err.message});
    }
})

app.put('/api/courses/:id', async(req,res)=>{
    try{
        const updateCourse = await Course.findByIdAndUpdate(
            req.params.id,req.body,{new:true, runValidators:true});
        if(!updateCourse){
            return res.status(404).json({message:'course not found', err:err.message});
        }
        res.status(200).json(updateCourse);
    }
    catch(err){
        res.status(400).json({mssg:'invalid course id',err:err.message});
    }
})

app.delete('/api/courses/:id', async (req,res)=>{
    try{
        const deleteCourse = await Course.findByIdAndDelete(
            req.params.id);
        if(!deleteCourse){
            return res.status(404).json({message:'course not found', err:err.message});
        }
        res.status(200).json(deleteCourse);
    }
     catch(err){
        res.status(400).json({message:'invalid course id',err:err.message});
    }
})

PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`${PORT} is running`);
    
})