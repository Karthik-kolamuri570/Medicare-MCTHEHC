const express = require('express');
const router= express.Router();
const BloodBank=require("./../models/BloodBank");
const userController=require("./../controllers/userController");
router.get('/',(req,res)=>{
    res.send("Blood bank Home Pagee");
})

module.exports=router;