// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const BloodBank=require('./../models/BloodBank')
// exports.registerBank= async (req,res)=>{
//     try{
//         // console.log("Registering blood bank with data:", req.body);
//         const {name,license_no,email,password,location,contact,capacity}=req.body;
//         console.log(name,license_no,email,password,location,contact,capacity);
//         if(!name || !license_no || !email || !password || !location || !contact || !capacity){
//             return res.status(400).json({message:"All fields are required"});
//         }
//         // Check for existing bank with same email or license number
//         const existingBank= await BloodBank.findOne({$or:[{email}, {license_no}]});
//         if(existingBank){
//             return res.status(400).json({message:"Bank already exists with the given email or license number"});
//         }
//         const salt=await bcrypt.genSalt(10);
//         const hashedPassword=await bcrypt.hash(password,salt);
//         const bank= new BloodBank({name,license_no,email,password:hashedPassword,location,contact,capacity});
//         await bank.save();  
//         const token=jwt.sign({id:bank._id},process.env.JWT_SECRET,{expiresIn:"1h"});
//         res.status(201).json({message:"Blood bank registered successfully", bank,token});   
//     }
//     catch(error){
//         console.error("Error registering blood bank:", error);
//         res.status(500).json({message:"Server error"});
//     }
// }

// exports.loginBank= async (req,res)=>{
//     try{
//         const {email,password}=req.body;
//         if(!email || !password){
//             return res.status(400).json({message:"All fields are required"});
//         }
//         const bank=await BloodBank.findOne({email});
//         if(!bank){
//             return res.status(400).json({message:"Invalid credentials"});
//         }
//         const isMatch=await bcrypt.compare(password,bank.password);
//         if(!isMatch){
//             return res.status(400).json({message:"Invalid credentials"});
//         }
//         req.session.bankLogin={
//             bankId: bank._id,
//             name: bank.name,
//             email: bank.email
//         }

//         const token=jwt.sign({id:bank._id},process.env.JWT_SECRET,{expiresIn:"1h"});
//         res.json({message:"Login successful",bank,token});
//     }
//     catch(error){
//         console.error("Error logging in blood bank:", error);
//         res.status(500).json({message:"Server error"});
//     }
// }

// exports.updateBank=async (req,res)=>{
//     try{
//         const {name,license_no,email,password,location,contact,capacity}=req.body;
//         const bank=await BloodBank.findById(req.session.bankLogin.bankId);//gettting bank id from session...
//         if(!bank){
//             return res.status(404).json({message:"Bank not found"});
//         }
//         if(name){
//             bank.name=name;
//         }
//         if(license_no){
//             bank.license_no=license_no;
//         }
//         if(email){
//             const existingBank= await BloodBank.findOne({$or:[{email}, {license_no}]});
//             if(existingBank && existingBank._id.toString() !== bank._id.toString()){
//                 return res.status(400).json({message:"Bank already exists with the given email or license number"});
//             }
//             bank.email=email;
//         }
//         if(password){
//             if(bank.password == password){ // I am not allowing to update the same password...
//                 return res.status(400).json({message:"New password must be different from the old password"});
//             }
//             const salt=await bcrypt.genSalt(10);
//             bank.password=await bcrypt.hash(password,salt);
//         }
//         if(location){
//             bank.location=location;
//         }
//         if(contact){
//             bank.contact=contact;
//         }
//         if(capacity){
//             bank.capacity=capacity;
//         }
//         await bank.save();
//         console.log("Updated bank details:", bank);
//         res.json({message:"Bank details updated successfully",bank});
//     }
//     catch(error){
//         console.error("Error updating bank details:", error);
//         res.status(500).json({message:"Server error"});
//     }
// }
// exports.getBankDetails=async (req,res)=>{
//     try{
//         const bank=await BloodBank.findById(req.session.bankLogin.bankId);
//         if(!bank){
//             return res.status(404).json({message:"Bank not found"});
//         }
//         res.json({bank});
//         console.log("Fetched bank details:", bank);
//     }
//     catch(error){
//         console.error("Error fetching bank details:", error);
//         res.status(500).json({message:"Server error"});
//     }   
// }
// exports.logoutBank=(req,res)=>{
//     req.session.destroy((err)=>{
//         if(err){
//             console.error("Error logging out blood bank:", err);
//             return res.status(500).json({message:"Server error"});
//         }
//         console.log("Logged out blood bank");
//         res.clearCookie('connect.sid');
//         res.json({message:"Logout successful"});
//     });
// }
// exports.getAllBanks=async (req,res)=>{
//     try{
//         const banks=await BloodBank.find().select('-password');
//         if(!banks){
//             return res.status(404).json({message:"No banks found"});
//         }
//         console.log("Fetched all banks:", banks);
//         res.json({banks});
//     }
//     catch(error){
//         console.error("Error fetching all banks:", error);
//         res.status(500).json({message:"Server error"});
//     }
// }
// exports.updateStock=async (req,res)=>{
//     try{
//         const {blood_group,units}=req.body;
//         if(!blood_group || !units){
//             return res.status(400).json({message:"All fields are required"});
//         }
//         if(units<=0){
//             return res.status(400).json({message:"Units must be positive"});
//         }
//         const bank=await BloodBank.findById(req.session.bankLogin.bankId);
//         if(!bank){
//             return res.status(404).json({message:"Bank not found"});
//         }
//         switch(blood_group){
//             case "A+":
//                 bank.blood_groups.A_pos+=units;
//                 break;
//             case "A-":
//                 bank.blood_groups.A_neg+=units;
//                 break;
//             case "B+":
//                 bank.blood_groups.B_pos+=units;
//                 break;
//             case "B-":
//                 bank.blood_groups.B_neg+=units;
//                 break;
//             case "O+":
//                 bank.blood_groups.O_pos+=units;
//                 break;
//             case "O-":
//                 bank.blood_groups.O_neg+=units;
//                 break;
//             case "AB+":
//                 bank.blood_groups.AB_pos+=units;
//                 break;
//             case "AB-":
//                 bank.blood_groups.AB_neg+=units;
//                 break;
//             default:
//                 return res.status(400).json({message:"Invalid blood group"});
//         }
//         await bank.save();
//         res.json({message:"Stock updated successfully",bank});
//     }
//     catch(error){
//         console.error("Error updating stock:", error);
//         res.status(500).json({message:"Server error"});
//     }
// }




const mongoose = require('mongoose');
const BloodBank = require('../models/BloodBank');
const Notification = require('../models/Notification');
const bcrypt = require('bcrypt');
const Request = require('./../models/Request');
const Donation = require('./../models/Donate');

// Bank Login
const bankLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find bank by email
        const bank = await BloodBank.findOne({ email });
        if (!bank) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, bank.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Create session
        req.session.bankLogin = {
            bankId: bank._id,
            email: bank.email,
            name: bank.name
        };

        res.json({
            success: true,
            message: 'Login successful',
            bank: {
                id: bank._id,
                name: bank.name,
                email: bank.email,
                location: bank.location
            }
        });
    } catch (error) {
        console.error('Bank login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
};

// Register New Bank
const registerBank = async (req, res) => {
    try {
        const { name, email, password, license_no, location, contact, capacity } = req.body;

        // Validation
        if (!name || !email || !password || !license_no || !location || !contact) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Check if bank already exists
        const existingBank = await BloodBank.findOne({ 
            $or: [{ email }, { license_no }] 
        });

        if (existingBank) {
            return res.status(409).json({
                success: false,
                message: 'Bank with this email or license number already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Initialize blood groups with 0 stock
        const bloodGroups = {
            A_pos: 0, A_neg: 0,
            B_pos: 0, B_neg: 0,
            AB_pos: 0, AB_neg: 0,
            O_pos: 0, O_neg: 0
        };

        // Create new bank
        const newBank = new BloodBank({
            name,
            email,
            password: hashedPassword,
            license_no,
            location,
            contact,
            capacity: capacity || 1000,
            blood_groups: bloodGroups
        });

        await newBank.save();

        res.status(201).json({
            success: true,
            message: 'Blood bank registered successfully',
            bank: {
                id: newBank._id,
                name: newBank.name,
                email: newBank.email,
                license_no: newBank.license_no
            }
        });
    } catch (error) {
        console.error('Bank registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
};

// Verify Authentication
const verifyAuth = (req, res) => {
    if (req.session && req.session.bankLogin && req.session.bankLogin.bankId) {
        res.json({
            success: true,
            authenticated: true,
            bank: {
                id: req.session.bankLogin.bankId,
                email: req.session.bankLogin.email,
                name: req.session.bankLogin.name
            }
        });
    } else {
        res.json({
            success: true,
            authenticated: false
        });
    }
};

// Get Bank Profile and Stock
const getMyBank = async (req, res) => {
    try {
        const bank = await BloodBank.findById(req.session.bankLogin.bankId).select('-password');
        
        if (!bank) {
            return res.status(404).json({
                success: false,
                message: 'Bank not found'
            });
        }

        res.json({
            success: true,
            bank: bank
        });
    } catch (error) {
        console.error('Get bank profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bank details'
        });
    }
};

// Get Notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            bankId: req.session.bankLogin.bankId 
        }).sort({ createdAt: -1 }).limit(50);

        res.json({
            success: true,
            notifications: notifications || []
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            notifications: []
        });
    }
};

// Mark All Notifications as Read
const markNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { bankId: req.session.bankLogin.bankId, read: false },
            { read: true }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark notifications read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notifications as read'
        });
    }
};

// Update Bank Profile
const updateProfile = async (req, res) => {
    try {
        const { name, location, contact, capacity } = req.body;
        
        const updatedBank = await BloodBank.findByIdAndUpdate(
            req.session.bankLogin.bankId,
            { name, location, contact, capacity },
            { new: true, select: '-password' }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            bank: updatedBank
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// Bank Logout
const bankLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
};

const getAllBanks=async (req,res)=>{
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

const getRequests = async (req, res) => {
  try {
    const bankId = req.session.bankLogin.bankId;
    // Find one donation document with matching bank_id
    const bank = await Request.find({ bank_id: new mongoose.Types.ObjectId(bankId) });
    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }
    res.json({ requests: bank });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getDonations = async (req, res) => {
  try {
    const bankId = req.session.bankLogin.bankId;
    // Use findOne with filter, NOT findById
    const bank = await Donation.find({ bank_id: new mongoose.Types.ObjectId(bankId) });
    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }
    console.log(bank);
    res.json({ donations: bank });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

    

module.exports = {
    bankLogin,
    registerBank,
    verifyAuth,
    getMyBank,
    getNotifications,
    markNotificationsRead,
    updateProfile,
    bankLogout,
    getAllBanks,
    getRequests,
    getDonations
};
