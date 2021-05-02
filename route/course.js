const db = require("../db");
const express = require('express')
const router = express.Router()

router.post("/create", async (req, res)=>{
    console.log(JSON.stringify(req.body));
    let result = await db.insertCourse(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.thumbnail,
        req.body.category,
        req.body.creator_id
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db write stage of course creation."});
    }else{
        res.status(200).send({"message": "Successfully course created."});
    }
});

router.get("/retrieve", async (req, res)=>{
    console.log(JSON.stringify(req.body));
    let result = await db.getCourse(
        req.body.cid,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db write stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send({"message": "Successfully course created."});
    }
});

module.exports = router;
