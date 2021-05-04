const db = require("../db");
const express = require('express');
const router = express.Router();

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

router.post("/addLecture", async (req, res)=>{
    console.log(JSON.stringify(req.body));
    let result = await db.addLecture(
        req.body.chapterName,
        req.body.title,
        req.body.duration,
        req.body.date,
        req.body.isVisible,
        req.body.additionalMaterial,
        req.body.video,
        req.body.course_id,
        req.body.lecture_index,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db write stage of lecture creation."});
    }else{
        res.status(200).send({"message": "Successfully lecture created."});
    }
});

router.get("/retrieve/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getCourse(
        req.params.cid,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db retrieve stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send(result);
    }
});

router.post("/filter", async (req, res)=>{
    console.log(JSON.stringify(req.body));
    let response = await db.filterCourses(req.body.minimum,req.body.maximum,req.body.order,req.body.orderDirection,req.body.search,req.body.categories, req.body.pageNumber);
    if(response){
        res.status(200).send(response);
    }else{
        res.status(200).send([]);
    }
});

router.get("/maxIndex/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getMaxLectureIndex(
        req.params.cid,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db retrieve stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send(result);
    }
});

module.exports = router;
