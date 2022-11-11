const express = require("express"); 
const bycryptjs = require("bcryptjs");
const User = require('../models/userschema');
const jwt = require('jsonwebtoken');
const authrouter = express.Router();

authrouter.post("/api/login" , async (req, res) => {
  try {
     const {email , password}  = req.body ; 
     console.log({email , password})
     const user  = await User.findOne({email}); 
      if(!user){
          return res.status(400).send({msg : "user with this email does not exist"});
      }
      const isMatch = await bycryptjs.compare(password , user.password);
      if(!isMatch){
          return res.status(400).send({msg : "Incorrect password"});
      }
      
      const token = jwt.sign({id : user._id}, "passwordkey");
      res.status(200).json({token, ...user._doc});
  
  } catch (error) {
        res.status(500).json({ error: error.message });
  }
})



module.exports = authrouter; 