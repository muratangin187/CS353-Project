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

    if (!result){
        res.status(400).send({message: "Retrieve completed quizzes operation are failed"});
    } else {
        res.status(200).send(result);
    }
});

module.exports = router;