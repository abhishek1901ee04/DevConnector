const express = require("express");
const router = express.Router();
const auth  = require("../../middleware/auth")
const User = require("../../models/Users")
const {body ,validationResult} = require
("express-validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// @router    Get api/auth
// @desc      Test Route
// access     Public
router.get("/",auth,async(req,res) => { 
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @router    Post api/auth
// @desc      Register Data
// access     Public
router.post(
    '/', // Replace 'your-route' with your desired endpoint URL
    [
      body('email', 'Enter a valid Email').isEmail(),
      body('password', 'Please enter a password with 6 or more characters').exists(),
    ],
    async(req, res) => {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {email,password} = req.body;
      try{
        // see if user exists 
        let user = await User.findOne({email});

        if(!user) {
            return res
            .status(400)
            .json({errors : [{msg : "Invalid Credential "}] });
        }
        //matching passowrd 
        let isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res
            .status(400)
            .json({errors : [{msg : "Invalid Credential"}] });
        }

        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {expiresIn:3600},
            (err,token)=>{
                if(err)throw err;
                res.json({token});
            }
        );
      }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
      }
     
      
    }
  );

module.exports = router; 