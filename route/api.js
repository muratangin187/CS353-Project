const express = require('express')
const router = express.Router()
const userRouter = require("./user");
const courseRouter = require("./course");
const courseCreatorRouter = require("./creator");
const quizRouter = require("./quiz");

router.use("/user", userRouter);
router.use("/course", courseRouter); // /api/course/create
router.use("/creator", courseCreatorRouter);
router.use("/quiz", quizRouter);

module.exports = router;