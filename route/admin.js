const db = require("../db");
const express = require('express')
const jwt = require("jsonwebtoken");
const {SECRET} = require("../config");
const {verifyToken} = require("../authMiddle");
const router = express.Router()

router.get("/most-bought", async (req, res) => {
    let result = await db.getMostBoughtCourses();
    if(result)
        res.status(200).send(result);
    else
        res.status(400).send();
});

module.exports = router;
