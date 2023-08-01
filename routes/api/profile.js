const express = require("express");
const router = express.Router();

// @router    Get api/profile
// @desc      Test Route
// access     Public
router.get("/test",(req,res) => { res.send("profile route")});

module.exports = router;