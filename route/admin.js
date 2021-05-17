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

router.get("/most-rated", async (req, res) => {
    let result = await db.getMostRatedCourses();
    if(result)
        res.status(200).send(result);
    else
        res.status(400).send();
});

router.get("/dist-courses", async (req, res) => {
    let result = await db.distributionOfCourses();
    if(result)
        res.status(200).send(result);
    else
        res.status(400).send();
});

router.get("/average-category", async (req, res) => {
    let result = await db.averageCategory();
    if(result)
        res.status(200).send(result);
    else
        res.status(400).send();
});


module.exports = router;
