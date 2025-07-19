import jwt from "jsonwebtoken";
import Test from "../models/Test.js";
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

export async function getAllTest(req,res){
    try {
        const test = await Test.find();
        res.status(200).json(test);
    } catch (err){
        console.log("Error in getAllTest function ", err);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function createTest(req,res){
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const userId = decoded.userId;
    try {
        const {title,content} = req.body;
        const test = new Test({title,content,user:userId});

        await test.save();
        res.status(201).json({message:"A new test has been created"});
    } catch (err){
        console.log("error in createTest function ", err);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function showTest(req,res){
    try {
        const test = await Test.findById(req.params.id);
        res.status(200)
            .json(test);
    } catch (err) {
        console.log("error in showTest function ", err);
        res.status(500).json({message:"Internal server error"}); 
    }
}

export async function updateTest(req,res){
    try {
        const {title,content} = req.body;
        await Test.findByIdAndUpdate(req.params.id,{title,content});
        res.status(201).json({message:"Test has been updated"});
    } catch (err) {
        console.log("error in updateTest function ", err);
        res.status(500).json({message:"Internal server error"});     
    }
}

export async function deleteTest(req,res){
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.status(201).json({message:"Test has been deleted"});
    } catch (err) {
        console.log("error in deleteTest function ", err);
        res.status(500).json({message:"Internal server error"});   
    }
}