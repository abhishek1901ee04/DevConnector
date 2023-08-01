const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const {body ,validationResult} = require
("express-validator")
const User = require("../../models/Users");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");
// @router    Post api/users
// @desc      Register Data
// access     Public
router.post(
    '/', // Replace 'your-route' with your desired endpoint URL
    [
      body('name', 'Name is Required').not().isEmpty(),
      body('email', 'Enter a valid Email').isEmail(),
      body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async(req, res) => {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {name,email,password} = req.body;
      try{
        // see if user exists 
        let user = await User.findOne({email});

        if(user) {
            res.status(400).json({errors : [{msg : "User already exists"}] });
        }

        const avatar = gravatar.url(email,{
            s:"200",
            r:"pg",
            d:"mm"
        })
        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password,salt);

        await user.save();

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