const db = require("../db");
const express = require('express');
const router = express.Router();

router.post("/insert_quiz", async (req, res) => {
    if (!req.body.name && !req.body.duration){
        res.status(400).send({message: "Name or duration has an empty value"});
        return;
    }

    let result = await db.insertQuiz(req.body.duration, req.body.name, req.body.creatorId, req.body.courseId);
    if (!result){
        res.status(400).send({message: "Insert quiz operation failed"});
    } else {
        res.status(200).send({message: "Quiz is successfully added", quiz_id: result});
    }
});

router.post("/insert_flash", async (req, res) => {
    if (!req.body.question){
        res.status(400).send({message: "Question has an empty value"});
        return;
    }

    let result = await db.insertFlashCard(req.body.question, req.body.quizId);

    if (!result){
        res.status(400).send({message: "Insert flash card operation failed"});
    } else {
        res.status(200).send({message: "Flash card successfully added", flash_id: result});
    }
});

router.post("/insert_true_false", async (req, res) => {
    let result = await db.insertTrueFalse(req.body.flashId, req.body.answer);

    if (!result){
        res.status(400).send({message: "Insert true false question operation failed"});
    } else {
        res.status(200).send({message: "True-False question successfully added"})
    }
});

router.post("/insert_multiple", async (req, res) => {
    if (!req.body.choice1 && !req.body.choice2 && !req.body.choice3 && !req.body.choice4 && !req.body.answer){
        res.status(400).send({message: "Answer fields have empty values"});
        return;
    }

    let result = await db.insertMultiple(req.body.flashId, req.body.choice1, req.body.choice2, req.body.choice3, req.body.choice4, req.body.answer);

    if (!result){
        res.status(400).send({message: "Insert multiple choice question operation failed"});
    } else {
        res.status(200).send({message: "True-False question successfully added"})
    }
});

router.get("/retrieve_quizzes/:course_id", async (req, res) => {
    let courseId = req.params["course_id"];
    console.log("Course ID - 1");
    console.log(courseId);

    let result = await db.getQuizzes(courseId);
    console.log(result);
    if (!result){
        res.status(400).send({message: "Retrieve quizzes operation are failed"});
    } else {
        res.status(200).send(result);
    }
});

router.get("/retrieve_completed_quizzes/:course_id/:user_id", async (req, res) => {
    let courseId = req.params["course_id"];
    let userId = req.params["user_id"];

    console.log("Course ID - 2");
    console.log(courseId);
    console.log("User ID");
    console.log(userId);

    let result = await db.getCompletedQuizzes(courseId, userId);
    console.log(result);
    if (!result){
        res.status(400).send({message: "Retrieve completed quizzes operation are failed"});
    } else {
        res.status(200).send(result);
    }
});

router.get("/retrieve_quiz_inf/:quiz_id", async (req, res) => {
    let quizId = req.params["quiz_id"];

    let result = await db.getQuizInf(quizId);
    console.log("Retrieve Quiz Inf");
    console.log(result);
    if (!result){
        res.status(400).send({message: "Retrieve quiz information operation failed"});
    } else {
        res.status(200).send(result);
    }
});

router.get("/retrieve_quiz_qa_tf/:quiz_id", async (req, res) => {
    let quizId = req.params["quiz_id"];

    let result = await db.getQuizQATF(quizId);
    console.log("Retrieve True-False");
    console.log(result);
    if (!result){
        res.status(400).send({message: "Retrieve true-false operation failed"});
    } else {
        res.status(200).send(result);
    }
});

router.get("/retrieve_quiz_qa_m/:quiz_id", async (req, res) => {
    let quizId = req.params["quiz_id"];

    let result = await db.getQuizQAM(quizId);
    console.log("Retrieve Multiple Choice");
    console.log(result);
    if (!result){
        res.status(400).send({message: "Retrieve multiple choice operation failed"});
    } else {
        res.status(200).send(result);
    }
});

router.post("/insert_completed_quiz", async (req, res) => {
    if (!req.body.quizId && !req.body.userId && !req.body.score){
        res.status(400).send({message: "Completed quiz can not be inserted."});
        return;
    }

    let result = await db.insertCompletedQuiz(req.body.quizId, req.body.userId, req.body.score);

    if (!result){
        res.status(400).send({message: "Completed quiz can not be inserted."});
    } else {
        res.status(200).send({message: "This quiz inserted to the completed quizzes."});
    }
});

router.get("/retrieve_attend/:course_id", async (req, res) => {
    let courseId = req.params["course_id"];

    let result = await db.getNumberOfAttenders(courseId);

    console.log("Attend");
    console.log(result);

    if (!result){
        res.status(400).send({message: "Can not retrieve number of attenders"});
    } else {
        res.status(200).send(result);
    }
});

router.get("/retrieve_avg_score/:course_id", async (req, res) => {
    let courseId = req.params["course_id"];

    let result = await db.getScoreAvg(courseId);

    console.log("Avg Score");
    console.log(result);

    if (!result){
        res.status(400).send({message: "Can not retrieve average of score"});
    } else {
        res.status(200).send(result);
    }
});

router.get("/retrieve_is_creator/:user_id", async (req, res) => {
    let userId = req.params["user_id"];
    let result = await db.isCreator(userId);
    res.send(result);
});

module.exports = router;