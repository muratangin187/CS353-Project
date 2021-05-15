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

router.post("/addAnnouncement", async (req, res)=>{
    let result = await db.addAnnouncement(
        req.body.title,
        req.body.content,
        req.body.creator_id,
        req.body.course_id
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db write stage of announcement creation."});
    }else{
        res.status(200).send({"message": "Successfully announcement created."});
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

router.post("/addCourseToCart", async (req, res) => {
    let result = await db.addCourseToCart(
        req.body.uid,
        req.body.cid
    );
    if (result == null) {
        res.status(400).send({"message": "There is an error occurred in the db write stage of buying a course"});
    } else {
        res.status(200).send({"message": "Successfully course bought"});
    }
});

router.post("/addCourseToWishlist", async (req, res) => {
    let result = await db.addCourseToWishlist(
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

router.get("/allAnnouncements/:cid", async (req, res) => {
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getAnnouncements(
        req.params.cid,
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
    let result = await db.getCourseRatings(
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

router.post("/close-refund", async (req, res)=>{
    let response = await db.closeRefund(req.body.refundId, req.body.isAccepted, req.body.adminId);
    if(response){
        res.status(200).send({"message": "Refund successful"});
    }else{
        res.status(400).send({"message": "There is an error occured in the db write stage of refund creation."});
    }
});

router.get("/get-all-refunds", async(req, res)=>{
    let result = await db.getAllRefunds();
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db read stage of refund creation."});
    }else{
        res.status(200).send(result);
    }
});

router.get("/get-discounts/:cid", async(req, res)=>{
    let result = await db.getAllDiscounts(req.params.cid);
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db read stage of discount creation."});
    }else{
        res.status(200).send(result);
    }
});

router.post("/allow-discount", async (req, res)=>{
    let result = await db.allowDiscount(req.body.cid,req.body.did,req.body.isAllowed);
    res.status(200).send(result);
});

router.post("/disable-discount", async (req, res)=>{
    let result = await db.disableDiscount(req.body.did);
    res.status(200).send(result);
});

router.post("/delete-lecture", async (req, res)=>{
    let result = await db.deleteLecture(req.body.lid);
    res.status(200).send(result);
});

router.post("/delete-announcement", async (req, res)=>{
    let result = await db.deleteAnnouncement(req.body.aid);
    res.status(200).send(result);
});

router.get("/discounts/:did", async(req, res)=>{
    let result = await db.isDiscountAllowed(req.params.did);
    res.status(200).send(result);
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

router.get("/getAllLectures/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.getAllLectures(
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

router.get("/getCourseNamesOfCreator/:uid", async (req, res)=>{
    console.log(JSON.stringify(req.params.uid));
    let result = await db.getCourseNamesOfCreator(
        req.params.uid,
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

router.post("/toggleVisibility", async (req, res) => {
    let response = await db.toggleVisibility(
        req.body.lid
    );
    if(!response){
        res.status(400).send({"message": "There is an error occured in the db update stage of visibility."});
    }else {
        res.status(200).send({"message": "Successfully toggled visibility."});
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

router.get("/isCourseBought/:cid/:uid", async (req, res) => {
    console.log(JSON.stringify(req.params.cid));
    let result = await db.isCourseBought(
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

router.post("/ask-question", async(req, res)=>{
    console.log("Asking question: " + req.body.content + " - " + req.body.cid + " - " + req.body.qid);
    if(req.body.answer == 1){
        let result = await db.answerQuestion(
            req.body.content,
            req.body.uid,
            req.body.qid
        );
        if(result)
            res.status(200).send({message: "Answered question successfully."});
        else
            res.status(400).send({message: "There is an error occured on the question answering process."});
    }else{
        let result = await db.askQuestion(
            req.body.content,
            req.body.cid,
            req.body.qid,
            req.body.uid
        );
        if(result)
            res.status(200).send({message: "Asked question successfully."});
        else
            res.status(400).send({message: "There is an error occured on the question asking process."});
    }
});

router.get("/get-root-questions/:cid", async(req, res)=>{
    console.log(`Get root questions for course: ${req.params.cid}`);
    let result = await db.getRootQuestions(req.params.cid);
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db read stage of question retrieval."});
    }else{
        res.status(200).send(result);
    }
});

router.get("/get-question-answer/:qid", async (req, res) => {
    console.log(`Get answer of question: ${req.params.qid}`);
    let result = await db.getAnswer(req.params.qid);
    res.status(200).send(result);
});

router.get("/get-question-children/:qid", async (req, res) => {
    console.log(`Get children questions for question: ${req.params.qid}`);
    let result = await db.getQuestionChildren(req.params.qid);
    res.status(200).send(result);
});

module.exports = router;
