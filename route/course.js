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

router.post("/addRating", async (req, res)=>{
    let result = await db.addRating(
        req.body.ratingScore,
        req.body.content,
        req.body.user_id,
        req.body.course_id
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db write stage of rating creation."});
    }else{
        res.status(200).send({"message": "Successfully rating created."});
    }
});

router.post("/buyCourse", async (req, res) => {
    let result = await db.buyCourse(
        req.body.uid,
        req.body.cid
    );
    if (result == null) {
        res.status(400).send({"message": "There is an error occurred in the db write stage of buying a course"});
    } else {
        res.status(200).send({"message": "Successfully course bought"});
    }
});

router.post("/completeLecture", async(req, res) => {
    let result = await db.completeLecture(
        req.body.uid,
        req.body.cid,
        req.body.lid
    );
    if (result == null) {
        res.status(400).send({"message": "There is an error occurred in the db write stage of completing a lecture"});
    } else {
        res.status(200).send({"message": "Successfully lecture completed"});
    }
});

router.get("/retrieve/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getCourse(
        req.params.cid,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db retrieve stage of course creation."});
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

router.get("/:cid/allRatings", async (req, res) => {
    console.log(JSON.stringify(req.params.lid));
    let result = await db.getRatings(
        req.params.cid,
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
        req.body.percentage,
        req.body.adminId
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db write stage of discount creation."});
    }else{
        res.status(200).send({"message": "Successfully discount created."});
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

router.get("/getLectureIndices/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getLectureIndices(
        req.params.cid,
    );
    res.status(200).send(result);
});

router.get("/getCourseRatings/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getCourseRatings(
        req.params.cid,
    );
    res.status(200).send(result);
});

router.get("/isCourseCompleted/:cid/:uid", async (req, res) => {
    let result = await db.isCourseCompleted(
        req.params.cid,
        req.params.uid,
    );
    res.status(200).send(result);
});

router.get("/isLectureCompleted/:cid/:lid/:uid", async (req, res) => {
    console.log(JSON.stringify(req.params.cid));
    let result = await db.isLectureCompleted(
        req.params.uid,
        req.params.cid,
        req.params.lid,
    );
    res.status(200).send(result);
});

router.post("/updateRating", async (req, res) => {
    let response = await db.updateRating(
        req.body.ratingScore,
        req.body.content,
        req.body.user_id,
        req.body.course_id,
    );
    if(!response){
        res.status(400).send({"message": "There is an error occured in the db update stage of rating."});
    }else {
        res.status(200).send({"message": "Successfully updated rating."});
    }
});


router.get("/isCourseRated/:cid/:uid", async (req, res) => {
    console.log(JSON.stringify(req.params.cid));
    let result = await db.isCourseRated(
        req.params.cid,
        req.params.uid,
    );
    res.status(200).send(result);
});

router.post("/refund", async(req, res)=>{
    let result = await db.makeRefund(
        req.body.courseId,
        req.body.title,
        req.body.reason,
        req.body.userId,
    );

    if(result)
        res.status(200).send({message: "Refund request successfully sent."});
    else
        res.status(400).send({message: "There is an error occured on the refund process."});
});

module.exports = router;
