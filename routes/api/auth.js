const express = require("express");
const router = express.Router();

// @router    Get api/auth
// @desc      Test Route
// access     Public
router.get("/",(req,res) => { res.send("auth route")});

module.exports = router;