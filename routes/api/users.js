const express = require("express");
const router = express.Router();

// @router    Get api/users
// @desc      Test Route
// access     Public
router.get("/",(req,res) => { res.send("User route")});

module.exports = router;