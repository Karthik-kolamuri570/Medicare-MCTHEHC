const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BloodBank=require('./../models/BloodBank')
exports.registerBank= async (req,res)=>{
    try{
        // console.log("Registering blood bank with data:", req.body);
        const {name,license_no,email,password,location,contact,capacity}=req.body;
        console.log(name,license_no,email,password,location,contact,capacity);
        if(!name || !license_no || !email || !password || !location || !contact || !capacity){
            return res.status(400).json({message:"All fields are required"});
        }
        // Check for existing bank with same email or license number
        const existingBank= await BloodBank.findOne({$or:[{email}, {license_no}]});
        if(existingBank){
            return res.status(400).json({message:"Bank already exists with the given email or license number"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const bank= new BloodBank({name,license_no,email,password:hashedPassword,location,contact,capacity});
        await bank.save();  
        const token=jwt.sign({id:bank._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(201).json({message:"Blood bank registered successfully", bank,token});   
    }
    catch(error){
        console.error("Error registering blood bank:", error);
        res.status(500).json({message:"Server error"});
    }
}

exports.loginBank= async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const bank=await BloodBank.findOne({email});
        if(!bank){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,bank.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        req.session.bankLogin={
            bankId: bank._id,
            name: bank.name,
            email: bank.email
        }

        const token=jwt.sign({id:bank._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.json({message:"Login successful",bank,token});
    }
    catch(error){
        console.error("Error logging in blood bank:", error);
        res.status(500).json({message:"Server error"});
    }
}

exports.updateBank=async (req,res)=>{
    try{
        const {name,license_no,email,password,location,contact,capacity}=req.body;
        const bank=await BloodBank.findById(req.session.bankLogin.bankId);//gettting bank id from session...
        if(!bank){
            return res.status(404).json({message:"Bank not found"});
        }
        if(name){
            bank.name=name;
        }
        if(license_no){
            bank.license_no=license_no;
        }
        if(email){
            const existingBank= await BloodBank.findOne({$or:[{email}, {license_no}]});
            if(existingBank && existingBank._id.toString() !== bank._id.toString()){
                return res.status(400).json({message:"Bank already exists with the given email or license number"});
            }
            bank.email=email;
        }
        if(password){
            if(bank.password == password){ // I am not allowing to update the same password...
                return res.status(400).json({message:"New password must be different from the old password"});
            }
            const salt=await bcrypt.genSalt(10);
            bank.password=await bcrypt.hash(password,salt);
        }
        if(location){
            bank.location=location;
        }
        if(contact){
            bank.contact=contact;
        }
        if(capacity){
            bank.capacity=capacity;
        }
        await bank.save();
        console.log("Updated bank details:", bank);
        res.json({message:"Bank details updated successfully",bank});
    }
    catch(error){
        console.error("Error updating bank details:", error);
        res.status(500).json({message:"Server error"});
    }
}
exports.getBankDetails=async (req,res)=>{
    try{
        const bank=await BloodBank.findById(req.session.bankLogin.bankId);
        if(!bank){
            return res.status(404).json({message:"Bank not found"});
        }
        res.json({bank});
        console.log("Fetched bank details:", bank);
    }
    catch(error){
        console.error("Error fetching bank details:", error);
        res.status(500).json({message:"Server error"});
    }   
}
exports.logoutBank=(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error("Error logging out blood bank:", err);
            return res.status(500).json({message:"Server error"});
        }
        console.log("Logged out blood bank");
        res.clearCookie('connect.sid');
        res.json({message:"Logout successful"});
    });
}
exports.getAllBanks=async (req,res)=>{
    try{
        const banks=await BloodBank.find().select('-password');
        if(!banks){
            return res.status(404).json({message:"No banks found"});
        }
        console.log("Fetched all banks:", banks);
        res.json({banks});
    }
    catch(error){
        console.error("Error fetching all banks:", error);
        res.status(500).json({message:"Server error"});
    }
}
exports.updateStock=async (req,res)=>{
    try{
        const {blood_group,units}=req.body;
        if(!blood_group || !units){
            return res.status(400).json({message:"All fields are required"});
        }
        if(units<=0){
            return res.status(400).json({message:"Units must be positive"});
        }
        const bank=await BloodBank.findById(req.session.bankLogin.bankId);
        if(!bank){
            return res.status(404).json({message:"Bank not found"});
        }
        switch(blood_group){
            case "A+":
                bank.A_pos+=units;
                break;
            case "A-":
                bank.A_neg+=units;
                break;
            case "B+":
                bank.B_pos+=units;
                break;
            case "B-":
                bank.B_neg+=units;
                break;
            case "O+":
                bank.O_pos+=units;
                break;
            case "O-":
                bank.O_neg+=units;
                break;
            case "AB+":
                bank.AB_pos+=units;
                break;
            case "AB-":
                bank.AB_neg+=units;
                break;
            default:
                return res.status(400).json({message:"Invalid blood group"});
        }
        await bank.save();
        res.json({message:"Stock updated successfully",bank});
    }
    catch(error){
        console.error("Error updating stock:", error);
        res.status(500).json({message:"Server error"});
    }
}
