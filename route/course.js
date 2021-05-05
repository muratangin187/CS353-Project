const db = require("../db");
const express = require('express');
const router = express.Router();

router.post("/create", async (req, res)=>{
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

router.post("/addNote", async (req, res)=>{
    let result = await db.addNote(
        req.body.title,
        req.body.content,
        req.body.user_id,
        req.body.lecture_id
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db write stage of note creation."});
    }else{
        res.status(200).send({"message": "Successfully note created."});
    }
});

router.post("/addBookmark", async (req, res)=>{
    let result = await db.addBookmark(
        req.body.timestamp,
        req.body.user_id,
        req.body.lecture_id
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db write stage of bookmark creation."});
    }else{
        res.status(200).send({"message": "Successfully bookmark created."});
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

router.get("/:lid/allNotes/:uid", async (req, res) => {
    console.log(JSON.stringify(req.params.lid));
    let result = await db.getNotes(
        req.params.uid,
        req.params.lid
    );
    if(result == null){
        res.status(400).send([]);
    }else{
        console.log(result);
        res.status(200).send(result);
    }
})

router.get("/:lid/allBookmarks/:uid", async (req, res) => {
    console.log(JSON.stringify(req.params.lid));
    let result = await db.getBookmarks(
        req.params.uid,
        req.params.lid
    );
    if(result == null){
        res.status(400).send([]);
    }else{
        console.log(result);
        res.status(200).send(result);
    }
})

router.get("/:cid/getLecture/:lid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getLecture(
        req.params.cid,
        req.params.lid,
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

router.get("/all-courses", async (req, res)=>{
    let response = await db.getAllCourses();
    if(response){
        res.status(200).send(response);
    }else{
        res.status(200).send([]);
    }
});

router.post("/create-discount", async (req, res)=>{
    let result = await db.createDiscount(
        req.body.courseId,
        req.body.startDate,
        req.body.endDate,
        req.body.percentage
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db write stage of course creation."});
    }else{
        res.status(200).send({"message": "Successfully course created."});
    }
});

router.get("/maxIndex/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getMaxLectureIndex(
        req.params.cid,
    );
    res.status(200).send(result);
});

router.get("/getVisibleLectures/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getVisibleLectures(
        req.params.cid,
    );
    res.status(200).send(result);
});

module.exports = router;
